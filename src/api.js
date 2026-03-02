const BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const getToken = () => localStorage.getItem('acctual_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  // Auth
  register:   (body)       => req('POST', '/api/auth/register', body),
  login:      (body)       => req('POST', '/api/auth/login', body),
  googleAuth: (credential) => req('POST', '/api/auth/google', { credential }),
  me:         ()           => req('GET',  '/api/auth/me'),

  // Payments
  createPaymentOrder: (invoiceId)  => req('POST', '/api/payments/create-order', { invoiceId }),
  verifyPayment:      (body)       => req('POST', '/api/payments/verify', body),

  // Invoices
  getInvoices:    ()       => req('GET',    '/api/invoices'),
  getInvoice:     (id)     => req('GET',    `/api/invoices/${id}`),
  createInvoice:  (body)   => req('POST',   '/api/invoices', body),
  updateStatus:   (id, s)  => req('PATCH',  `/api/invoices/${id}/status`, { status: s }),
  deleteInvoice:  (id)     => req('DELETE', `/api/invoices/${id}`),
};
