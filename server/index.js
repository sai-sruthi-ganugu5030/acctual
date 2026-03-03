require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { randomUUID: uuidv4, createHmac } = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const Razorpay = require('razorpay');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Initialize Razorpay only if credentials are provided
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

const app = express();
const JWT_SECRET = 'acctual-jwt-secret-key-2024';
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const INVOICES_FILE = path.join(DATA_DIR, 'invoices.json');

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000',
}));
app.use(express.json());

// ── Helpers ──────────────────────────────────────────────────────────────────
const readJSON = (file) => {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch { return []; }
};

const writeJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ── Auth middleware ───────────────────────────────────────────────────────────
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// ── Auth routes ───────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email))
    return res.status(400).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, password: hashed, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/auth/me', protect, (req, res) => {
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email });
});

// ── Google OAuth ──────────────────────────────────────────────────────────────
app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Google credential required' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const users = readJSON(USERS_FILE);
    let user = users.find(u => u.googleId === googleId || u.email === email);

    if (!user) {
      // New user — create account
      user = { id: uuidv4(), name, email, googleId, picture: picture || '', createdAt: new Date().toISOString() };
      users.push(user);
    } else if (!user.googleId) {
      // Existing email account — link Google to it
      user.googleId = googleId;
      user.picture = picture || '';
    }

    writeJSON(USERS_FILE, users);
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, picture: user.picture } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// ── Invoice routes ────────────────────────────────────────────────────────────
app.get('/api/invoices', protect, (req, res) => {
  const invoices = readJSON(INVOICES_FILE);
  res.json(invoices.filter(inv => inv.userId === req.user.id).reverse());
});

app.post('/api/invoices', protect, (req, res) => {
  const { clientName, clientEmail, items, currency, dueDate, notes } = req.body;
  if (!clientName || !items || items.length === 0)
    return res.status(400).json({ error: 'Client name and at least one item are required' });

  const invoices = readJSON(INVOICES_FILE);
  const userInvoices = invoices.filter(inv => inv.userId === req.user.id);

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const invoice = {
    id: uuidv4(),
    userId: req.user.id,
    invoiceNumber: `INV-${String(userInvoices.length + 1).padStart(4, '0')}`,
    clientName,
    clientEmail: clientEmail || '',
    items,
    currency: currency || 'USD',
    dueDate: dueDate || null,
    notes: notes || '',
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  invoices.push(invoice);
  writeJSON(INVOICES_FILE, invoices);
  res.status(201).json(invoice);
});

app.get('/api/invoices/:id', protect, (req, res) => {
  const invoices = readJSON(INVOICES_FILE);
  const invoice = invoices.find(inv => inv.id === req.params.id && inv.userId === req.user.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

app.patch('/api/invoices/:id/status', protect, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'sent', 'paid', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  const invoices = readJSON(INVOICES_FILE);
  const idx = invoices.findIndex(inv => inv.id === req.params.id && inv.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Invoice not found' });

  invoices[idx].status = status;
  invoices[idx].updatedAt = new Date().toISOString();
  writeJSON(INVOICES_FILE, invoices);
  res.json(invoices[idx]);
});

app.delete('/api/invoices/:id', protect, (req, res) => {
  const invoices = readJSON(INVOICES_FILE);
  const filtered = invoices.filter(
    inv => !(inv.id === req.params.id && inv.userId === req.user.id)
  );
  if (filtered.length === invoices.length)
    return res.status(404).json({ error: 'Invoice not found' });
  writeJSON(INVOICES_FILE, filtered);
  res.json({ success: true });
});

// ── Payment routes (Razorpay) ─────────────────────────────────────────────────
app.post('/api/payments/create-order', protect, async (req, res) => {
  if (!razorpay) return res.status(503).json({ error: 'Payment service unavailable' });

  const { invoiceId } = req.body;
  const invoices = readJSON(INVOICES_FILE);
  const invoice = invoices.find(inv => inv.id === invoiceId && inv.userId === req.user.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  if (invoice.status === 'paid') return res.status(400).json({ error: 'Invoice already paid' });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(invoice.total * 100), // paise
      currency: 'INR',
      receipt: invoice.invoiceNumber,
    });
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

app.post('/api/payments/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = req.body;

  const expectedSig = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSig !== razorpay_signature)
    return res.status(400).json({ error: 'Payment verification failed' });

  const invoices = readJSON(INVOICES_FILE);
  const idx = invoices.findIndex(inv => inv.id === invoiceId && inv.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Invoice not found' });

  invoices[idx].status = 'paid';
  invoices[idx].paymentId = razorpay_payment_id;
  invoices[idx].paidAt = new Date().toISOString();
  writeJSON(INVOICES_FILE, invoices);
  res.json(invoices[idx]);
});

// Serve React build if it exists
const buildPath = path.join(__dirname, '../build');
const buildIndexPath = path.join(buildPath, 'index.html');
const buildExists = fs.existsSync(buildIndexPath);

if (buildExists) {
  app.use(express.static(buildPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(buildIndexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).json({ error: 'Could not serve app' });
      }
    });
  });
} else {
  // Build doesn't exist - show API message
  app.get('/', (req, res) => {
    res.json({ message: 'API running - React build not found', buildPath, buildExists });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Acctual API running on port ${PORT}`));
