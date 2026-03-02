import React from 'react';

const Features = () => (
  <section className="features" id="features">
    <div className="features__inner">
      <h2 className="features__title">
        What makes for the<br />world's most<br />thoughtful invoice?
      </h2>
      <p className="features__sub">We're so glad you asked.</p>

      <div className="features__grid">
        <div className="features__col">
          <h3>Pay &amp; get paid, however you want</h3>
          <div className="payment-methods">
            <div className="pay-method"><span className="pay-icon">◎</span> USDC</div>
            <div className="pay-method"><span className="pay-icon">₮</span> USDT</div>
            <div className="pay-method"><span className="pay-icon">$</span> USD</div>
            <div className="pay-method"><span className="pay-icon">€</span> EUR</div>
            <div className="pay-method"><span className="pay-icon">¥</span> JPY</div>
            <div className="pay-method"><span className="pay-icon">₿</span> BTC</div>
          </div>
        </div>

        <div className="features__col">
          <h3>Design you're proud of</h3>
          <div className="invoice-preview">
            <div className="inv-prev-header">
              <strong>Invoice</strong>
              <span>#0042</span>
            </div>
            <div className="inv-prev-row">
              <span>Logo design</span>
              <span>$500</span>
            </div>
            <div className="inv-prev-row">
              <span>Web design</span>
              <span>$500</span>
            </div>
            <div className="inv-prev-total">
              <span>Total</span>
              <strong>1,000.00</strong>
            </div>
          </div>
        </div>
      </div>

      <a href="#signup" className="btn btn--dark">Get started</a>
    </div>
  </section>
);

export default Features;
