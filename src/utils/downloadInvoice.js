const currencySymbol = (currency) => {
  const map = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', AUD: 'A$', CAD: 'C$', USDC: 'USDC ', USDT: 'USDT ' };
  return map[currency] || currency + ' ';
};

const fmt = (amount, currency) =>
  `${currencySymbol(currency)}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUS_LABEL = { pending: 'Pending', sent: 'Sent', paid: 'Paid', cancelled: 'Cancelled' };
const STATUS_COLOR = { pending: '#b45309', sent: '#1d4ed8', paid: '#15803d', cancelled: '#b91c1c' };

export const downloadInvoice = (invoice, userName = '') => {
  const sym = currencySymbol(invoice.currency);
  const subtotal = invoice.items.reduce((s, it) => s + it.quantity * it.price, 0);
  const fee = subtotal * 0.01;
  const total = subtotal;

  const rows = invoice.items.map(it => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">${it.description}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${it.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${sym}${Number(it.price).toFixed(2)}</td>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;">${sym}${(it.quantity * it.price).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${invoice.invoiceNumber} — Acctual Invoice</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      color: #111;
      background: #fff;
      padding: 56px 64px;
      max-width: 800px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .inv-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 56px;
    }
    .inv-logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 700;
      color: #000;
    }
    .inv-logo-badge {
      width: 32px; height: 32px;
      background: #000; color: #fff;
      border-radius: 7px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700;
    }
    .inv-number-block { text-align: right; }
    .inv-number { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #000; }
    .inv-status {
      display: inline-block;
      margin-top: 6px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: ${STATUS_COLOR[invoice.status] + '18'};
      color: ${STATUS_COLOR[invoice.status]};
    }

    /* ── Meta ── */
    .inv-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 48px;
      gap: 24px;
    }
    .inv-meta-block { flex: 1; }
    .inv-meta-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #aaa;
      margin-bottom: 8px;
    }
    .inv-meta-value { font-size: 15px; color: #111; font-weight: 500; line-height: 1.5; }
    .inv-meta-value strong { display: block; font-weight: 700; font-size: 16px; }

    /* ── Items ── */
    .inv-items { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .inv-items thead th {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #aaa;
      padding-bottom: 12px;
      border-bottom: 2px solid #f0f0f0;
      text-align: left;
    }
    .inv-items thead th:not(:first-child) { text-align: right; }
    .inv-items thead th:nth-child(2) { text-align: center; }

    /* ── Totals ── */
    .inv-totals { margin-left: auto; width: 280px; }
    .inv-total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #555;
    }
    .inv-total-final {
      display: flex;
      justify-content: space-between;
      padding: 14px 0 0;
      margin-top: 8px;
      border-top: 2px solid #000;
      font-size: 18px;
      font-weight: 800;
      color: #000;
    }

    /* ── Notes ── */
    .inv-notes {
      margin-top: 48px;
      padding: 20px;
      background: #f7fafc;
      border-radius: 10px;
      font-size: 13px;
      color: #555;
      line-height: 1.6;
    }
    .inv-notes-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: #aaa;
      margin-bottom: 8px;
    }

    /* ── Footer ── */
    .inv-footer {
      margin-top: 56px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .inv-footer-brand { font-size: 13px; font-weight: 600; color: #000; }
    .inv-footer-note { font-size: 12px; color: #bbb; }

    /* ── Print button (screen only) ── */
    .print-bar {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 64px;
      background: #f7fafc;
      border-bottom: 1px solid #e5e7eb;
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
    }
    .print-btn {
      padding: 10px 22px;
      border-radius: 100px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .print-btn--dark { background: #000; color: #fff; }
    .print-btn--outline { background: #fff; color: #000; border: 1.5px solid #000; }
    .print-spacer { height: 64px; }

    @media print {
      .print-bar { display: none !important; }
      .print-spacer { display: none; }
      body { padding: 32px 40px; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <button class="print-btn print-btn--outline" onclick="window.close()">Close</button>
    <button class="print-btn print-btn--dark" onclick="window.print()">⬇ Download PDF</button>
  </div>
  <div class="print-spacer"></div>

  <!-- Header -->
  <div class="inv-header">
    <div class="inv-logo">
      <span class="inv-logo-badge">G9</span> Acctual
    </div>
    <div class="inv-number-block">
      <div class="inv-number">${invoice.invoiceNumber}</div>
      <div class="inv-status">${STATUS_LABEL[invoice.status] || invoice.status}</div>
    </div>
  </div>

  <!-- Meta -->
  <div class="inv-meta">
    <div class="inv-meta-block">
      <div class="inv-meta-label">Billed To</div>
      <div class="inv-meta-value">
        <strong>${invoice.clientName}</strong>
        ${invoice.clientEmail ? invoice.clientEmail : ''}
      </div>
    </div>
    <div class="inv-meta-block">
      <div class="inv-meta-label">From</div>
      <div class="inv-meta-value"><strong>${userName || 'Acctual User'}</strong></div>
    </div>
    <div class="inv-meta-block">
      <div class="inv-meta-label">Issue Date</div>
      <div class="inv-meta-value">${new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
    ${invoice.dueDate ? `
    <div class="inv-meta-block">
      <div class="inv-meta-label">Due Date</div>
      <div class="inv-meta-value">${new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>` : ''}
    <div class="inv-meta-block">
      <div class="inv-meta-label">Currency</div>
      <div class="inv-meta-value">${invoice.currency}</div>
    </div>
  </div>

  <!-- Line items -->
  <table class="inv-items">
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <!-- Totals -->
  <div class="inv-totals">
    <div class="inv-total-row"><span>Subtotal</span><span>${fmt(subtotal, invoice.currency)}</span></div>
    <div class="inv-total-row"><span>Processing fee (1%)</span><span>${fmt(fee, invoice.currency)}</span></div>
    <div class="inv-total-final"><span>Total</span><span>${fmt(total, invoice.currency)}</span></div>
  </div>

  ${invoice.notes ? `
  <div class="inv-notes">
    <div class="inv-notes-label">Notes</div>
    ${invoice.notes}
  </div>` : ''}

  <!-- Footer -->
  <div class="inv-footer">
    <div class="inv-footer-brand">Acctual — Crypto Invoice & B2B Payments</div>
    <div class="inv-footer-note">Thank you for your business</div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
};
