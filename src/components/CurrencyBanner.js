import React from 'react';

const CurrencyBanner = () => (
  <section className="currency-banner">
    <div className="currency-banner__inner">
      <div className="currency-banner__text">
        <h2 className="currency-banner__title">
          Euros, Dollars, Yens,<br />
          USDC, USDT... we do<br />
          it all and{' '}
          <em>we do it fast.</em>
        </h2>
        <p className="currency-banner__sub">
          UI designer in Argentina · Support in Philippines · Built for the world
        </p>
      </div>
      <div className="currency-banner__map">
        <div className="map-bg-line"></div>
        <div className="map-pin map-pin--arg">
          <span className="pin-dot"></span>
          <span className="pin-label">Argentina</span>
        </div>
        <div className="map-pin map-pin--ph">
          <span className="pin-dot"></span>
          <span className="pin-label">Philippines</span>
        </div>
      </div>
    </div>
  </section>
);



export default CurrencyBanner;
