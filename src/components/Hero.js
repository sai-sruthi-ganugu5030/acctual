import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="hero">
    <div className="hero__inner">
      <div className="hero__text">
        <h1 className="hero__title">
          Get paid<br />same day
        </h1>
        <p className="hero__sub">
          By sending customers the most flexible invoices on the market.
        </p>
        <Link to="/register" className="btn btn--dark">Create invoice in seconds</Link>
      </div>

      <div className="hero__visual">
        <div className="mock-notification">
          <span className="mock-dot"></span>
          <div className="mock-notif-text">
            <small>Marble Studio paid</small>
            <strong>$2,400.00</strong>
          </div>
        </div>

        <div className="mock-invoice">
          <div className="mock-invoice__header">
            <span className="mock-inv-label">Invoice</span>
            <span className="mock-inv-num">#1024</span>
          </div>
          <div className="mock-invoice__row">
            <span>Brand identity</span>
            <span>$1,200</span>
          </div>
          <div className="mock-invoice__row">
            <span>Strategy session</span>
            <span>$800</span>
          </div>
          <div className="mock-invoice__total">
            <span>Total</span>
            <span>$2,000</span>
          </div>
          <div className="mock-invoice__pay">
            <span>Pay with</span>
            <span className="mock-pay-options">USDC · USDT · Card</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
