import React from 'react';

const CardMenu = ({ cards }) => {
  return (
    <div data-testid="card-menu" className="column is-two-thirds is-adjusted">
      <div className="columns is-multiline is-adjusted">
        {cards.map((card, index) => (
          <div key={index} data-testid={`card-${index}`} className="column is-one-third is-adjusted">
            <div className="card is-adjusted">
              <div className="card-content is-adjusted">
                <p className="title is-adjusted">{card}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardMenu;
