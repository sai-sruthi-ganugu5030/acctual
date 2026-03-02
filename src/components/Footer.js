import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer__cta">
      <div className="footer__cta-inner">
        <h2 className="footer__cta-title">Start sending stablecoin invoices</h2>
        <p className="footer__cta-sub">
          Built for USDC, USDT, and global clients who just want to get paid
        </p>
        <a href="#signup" className="btn btn--light">Generate a stablecoin invoice</a>
      </div>
    </div>

    <div className="footer__links-wrap">
      <div className="footer__links">
        <div className="footer__col">
          <p className="footer__col-title">Search</p>
          <p className="footer__col-title" style={{ marginTop: '28px' }}>Guides</p>
          <ul>
            <li><span className="footer-link">Transfer USDC to Bank</span></li>
            <li><span className="footer-link">Invoice Bookkeeping</span></li>
            <li><span className="footer-link">Stablecoin Invoicing</span></li>
          </ul>
        </div>
        <div className="footer__col">
          <p className="footer__col-title">Send Money</p>
          <ul>
            <li><span className="footer-link">Send money to the US</span></li>
            <li><span className="footer-link">Send money to UK</span></li>
            <li><span className="footer-link">Send money to Canada</span></li>
            <li><span className="footer-link">Send money to Australia</span></li>
            <li><span className="footer-link">Send money to Philippines</span></li>
            <li><span className="footer-link">Send money to Argentina</span></li>
            <li><span className="footer-link">Send money to Mexico</span></li>
            <li><span className="footer-link">Send money to India</span></li>
            <li><span className="footer-link">Send money to Nigeria</span></li>
            <li><span className="footer-link">Send money to Brazil</span></li>
          </ul>
        </div>
      </div>
    </div>

    <div className="footer__bottom-wrap">
      <div className="footer__bottom">
        <span className="footer__logo">
          <span className="logo-badge logo-badge--sm">G9</span> Acctual
        </span>
        <small>© {new Date().getFullYear()} Acctual. All rights reserved.</small>
      </div>
    </div>
  </footer>
);

export default Footer;
