import React from 'react';

const Pricing = () => (
  <section className="pricing" id="pricing">
    <div className="pricing__inner">
      <div className="pricing__heading">
        <h2 className="pricing__title">With simple pricing</h2>
        <p className="pricing__desc">One flat rate. No surprises. Invoice in any currency, get paid same day.</p>
      </div>

      <div className="pricing__card">
        <div className="pricing__tier">
          <span className="pricing__label">Invoicing</span>
          <div className="pricing__amount">
            <span className="pricing__pct">1%</span>
            <span className="pricing__per"> per payment</span>
          </div>
        </div>

        <a href="#signup" className="btn btn--dark btn--full">Get started</a>

        <div className="pricing__features">
          <div className="pricing__feature-group">
            <p className="pricing__group-label">Usage</p>
            <ul>
              <li>Unlimited Invoices</li>
              <li>0% on same network &amp; currency</li>
            </ul>
          </div>
          <div className="pricing__feature-group">
            <p className="pricing__group-label">Features</p>
            <ul>
              <li>Flexible payment options (1%)</li>
              <li>Automated QBO/Xero sync</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Pricing;
