import React from 'react';

const Mission = () => (
  <section className="mission">
    <div className="mission__inner">
      <div className="mission__text">
        <h2 className="mission__title">
          We exist to make<br />
          getting paid faster,<br />
          easier and cheaper in<br />
          <em>any currency you want</em>
        </h2>
        <p className="mission__sub">
          stablecoin{' '}
          <span className="link-underline">(send money now)</span>. And of course, get
          paid in whatever way works best for you.
        </p>
        <a href="#invoice" className="btn btn--outline">Make an Invoice</a>
      </div>

      <div className="mission__clients">
        <div className="sticky-note">
          <span>Un Acctual</span>
        </div>
        <div className="client-card">
          <div className="client-card__icon">M</div>
          <div className="client-card__info">
            <strong>Marble Studio</strong>
            <span>Invoice #42 · $2,400</span>
          </div>
          <span className="client-card__status sent">Sent</span>
        </div>
        <div className="client-card">
          <div className="client-card__icon cherry">C</div>
          <div className="client-card__info">
            <strong>Cherry AI</strong>
            <span>Invoice #18 · $960</span>
          </div>
          <span className="client-card__status paid">Paid</span>
        </div>
      </div>
    </div>
  </section>
);



export default Mission;
