import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="acct-nav">
      <div className="acct-nav__inner">
        <Link to="/" className="acct-nav__logo">
          <span className="logo-badge">G9</span> Acctual
        </Link>

        <div className="acct-nav__actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn--outline btn--sm">Dashboard</Link>
              <button className="btn btn--dark btn--sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="acct-nav__link">Sign in</Link>
              <Link to="/register" className="btn btn--dark btn--sm">Get started</Link>
            </>
          )}
        </div>

        <button
          className="acct-nav__burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="acct-nav__menu">
          <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="btn btn--dark btn--sm" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
