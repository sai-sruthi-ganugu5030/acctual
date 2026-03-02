import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const HAS_GOOGLE_AUTH = process.env.REACT_APP_GOOGLE_CLIENT_ID &&
  process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          <span className="logo-badge">G9</span> Acctual
        </Link>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start sending invoices in seconds</p>

        {error && <div className="auth-error">{error}</div>}

        {/* Google Sign-Up */}
        {HAS_GOOGLE_AUTH && (
          <>
            <div className="google-btn-wrap">
              <GoogleLogin
                onSuccess={onGoogleSuccess}
                onError={() => setError('Google sign-up failed. Please try again.')}
                width="100%"
                text="signup_with"
                shape="rectangular"
                theme="outline"
                size="large"
              />
            </div>
            <div className="auth-divider">
              <span>or sign up with email</span>
            </div>
          </>
        )}

        <form className="auth-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Allen Bane"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Min. 6 characters"
              required
            />
          </div>
          <button type="submit" className="btn btn--dark btn--full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
