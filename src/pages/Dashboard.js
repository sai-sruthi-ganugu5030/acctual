import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { downloadInvoice } from '../utils/downloadInvoice';

const STATUS_COLORS = {
  pending: { bg: '#fff8e1', color: '#b45309' },
  sent: { bg: '#dbeafe', color: '#1d4ed8' },
  paid: { bg: '#dcfce7', color: '#15803d' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
};

const HAS_RAZORPAY = process.env.REACT_APP_RAZORPAY_KEY_ID &&
  !process.env.REACT_APP_RAZORPAY_KEY_ID.includes('YOUR_KEY');

const fmt = (amount, currency) => {
  if (currency === 'INR') return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  if (currency === 'USDC') return `USDC ${amount.toFixed(2)}`;
  if (currency === 'USDT') return `USDT ${amount.toFixed(2)}`;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getInvoices()
      .then(setInvoices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const handleStatus = async (id, status) => {
    try {
      const updated = await api.updateStatus(id, status);
      setInvoices(inv => inv.map(i => i.id === id ? updated : i));
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePay = async (inv) => {
    try {
      const { orderId, amount, currency, keyId } = await api.createPaymentOrder(inv.id);
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Acctual',
        description: `Invoice ${inv.invoiceNumber}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const updated = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: inv.id,
            });
            setInvoices(prev => prev.map(i => i.id === inv.id ? updated : i));
          } catch (err) {
            alert('Payment verification failed: ' + err.message);
          }
        },
        prefill: { name: inv.clientName, email: inv.clientEmail || '' },
        theme: { color: '#0a1a10' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Could not initiate payment: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    try {
      await api.deleteInvoice(id);
      setInvoices(inv => inv.filter(i => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);

  const stats = {
    total: invoices.length,
    paid: invoices.filter(i => i.status === 'paid').length,
    pending: invoices.filter(i => i.status === 'pending').length,
    earned: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0),
  };

  return (
    <div className="dash-page">
      {/* Dash Navbar */}
      <nav className="dash-nav">
        <Link to="/" className="dash-nav__logo">
          <span className="logo-badge">G9</span> Acctual
        </Link>
        <div className="dash-nav__right">
          <span className="dash-nav__user">👋 {user?.name}</span>
          <button className="btn btn--outline btn--sm" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <div className="dash-inner">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Invoices</h1>
            <p className="dash-sub">Manage and track all your invoices</p>
          </div>
          <Link to="/dashboard/new" className="btn btn--dark">+ New Invoice</Link>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="stat-card">
            <span className="stat-label">Total invoices</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total earned</span>
            <span className="stat-value">${stats.earned.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Paid</span>
            <span className="stat-value stat-value--green">{stats.paid}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <span className="stat-value stat-value--yellow">{stats.pending}</span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="dash-filters">
          {['all', 'pending', 'sent', 'paid', 'cancelled'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Invoice list */}
        {loading ? (
          <div className="dash-empty">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="dash-empty">
            <p>{filter === 'all' ? 'No invoices yet.' : `No ${filter} invoices.`}</p>
            {filter === 'all' && (
              <Link to="/dashboard/new" className="btn btn--dark" style={{ marginTop: 16 }}>
                Create your first invoice
              </Link>
            )}
          </div>
        ) : (
          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}>
                    <td className="inv-num">{inv.invoiceNumber}</td>
                    <td>
                      <div className="inv-client-name">{inv.clientName}</div>
                      {inv.clientEmail && <div className="inv-client-email">{inv.clientEmail}</div>}
                    </td>
                    <td className="inv-amount">{fmt(inv.total, inv.currency)}</td>
                    <td>{inv.currency}</td>
                    <td>
                      <select
                        className="status-select"
                        value={inv.status}
                        style={{ background: STATUS_COLORS[inv.status]?.bg, color: STATUS_COLORS[inv.status]?.color }}
                        onChange={e => handleStatus(inv.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="sent">Sent</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="inv-date">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        {HAS_RAZORPAY && inv.status !== 'paid' && inv.status !== 'cancelled' && (
                          <button
                            className="pay-btn"
                            onClick={() => handlePay(inv)}
                            title="Pay with Razorpay"
                          >
                            Pay ₹{inv.total.toLocaleString('en-IN')}
                          </button>
                        )}
                        <button
                          className="dl-btn"
                          onClick={() => downloadInvoice(inv, user?.name)}
                          title="Download PDF"
                        >
                          Download PDF
                        </button>
                        <button className="del-btn" onClick={() => handleDelete(inv.id)} title="Delete">✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
