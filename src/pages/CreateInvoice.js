import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

const CURRENCIES = ['INR', 'USD', 'USDC', 'USDT', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const emptyItem = () => ({ description: '', quantity: 1, price: '' });

const CreateInvoice = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    currency: 'INR',
    dueDate: '',
    notes: '',
  });
  const [items, setItems] = useState([emptyItem()]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const setItem = (i, k, v) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

  const addItem = () => setItems(prev => [...prev, emptyItem()]);
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i));

  const total = items.reduce((s, it) => s + (parseFloat(it.price) || 0) * (parseInt(it.quantity) || 0), 0);

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    const cleaned = items.map(it => ({
      description: it.description,
      quantity: parseInt(it.quantity) || 1,
      price: parseFloat(it.price) || 0,
    }));
    if (cleaned.some(it => !it.description || it.price <= 0)) {
      setError('Each item needs a description and price greater than 0');
      return;
    }
    setLoading(true);
    try {
      await api.createInvoice({ ...form, items: cleaned });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-page">
      <nav className="dash-nav">
        <Link to="/" className="dash-nav__logo">
          <span className="logo-badge">G9</span> Acctual
        </Link>
        <div className="dash-nav__right">
          <span className="dash-nav__user">👋 {user?.name}</span>
          <button className="btn btn--outline btn--sm" onClick={() => { logout(); navigate('/'); }}>Log out</button>
        </div>
      </nav>

      <div className="dash-inner">
        <div className="dash-header">
          <div>
            <Link to="/dashboard" className="back-link">← Back to invoices</Link>
            <h1 className="dash-title">New Invoice</h1>
          </div>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 24 }}>{error}</div>}

        <form className="invoice-form" onSubmit={onSubmit}>
          <div className="inv-form-grid">
            {/* Left: Client + Settings */}
            <div className="inv-form-col">
              <div className="form-section">
                <h3 className="form-section-title">Client details</h3>
                <div className="form-group">
                  <label>Client name *</label>
                  <input
                    type="text"
                    value={form.clientName}
                    onChange={e => setField('clientName', e.target.value)}
                    placeholder="Marble Studio"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client email</label>
                  <input
                    type="email"
                    value={form.clientEmail}
                    onChange={e => setField('clientEmail', e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Payment settings</h3>
                <div className="form-group">
                  <label>Currency</label>
                  <select value={form.currency} onChange={e => setField('currency', e.target.value)}>
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setField('dueDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setField('notes', e.target.value)}
                    placeholder="Payment terms, bank info, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Right: Line items + total */}
            <div className="inv-form-col">
              <div className="form-section">
                <div className="form-section-header">
                  <h3 className="form-section-title">Line items</h3>
                  <button type="button" className="btn btn--outline btn--sm" onClick={addItem}>+ Add item</button>
                </div>

                <div className="items-list">
                  <div className="items-header">
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Price</span>
                    <span>Total</span>
                    <span></span>
                  </div>
                  {items.map((item, i) => (
                    <div key={i} className="item-row">
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => setItem(i, 'description', e.target.value)}
                        placeholder="Service description"
                      />
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => setItem(i, 'quantity', e.target.value)}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={e => setItem(i, 'price', e.target.value)}
                        placeholder="0.00"
                      />
                      <span className="item-total">
                        {((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)).toFixed(2)}
                      </span>
                      {items.length > 1 && (
                        <button type="button" className="del-btn" onClick={() => removeItem(i)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="invoice-total-row">
                  <span>Total</span>
                  <strong>{form.currency} {total.toFixed(2)}</strong>
                </div>
              </div>

              <button type="submit" className="btn btn--dark btn--full" disabled={loading}>
                {loading ? 'Creating invoice…' : 'Create invoice'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;
