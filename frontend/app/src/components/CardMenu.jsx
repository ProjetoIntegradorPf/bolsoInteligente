import React from 'react';
import './CardMenu.css';

const CardMenu = ({ numberOfCards }) => {
  const cards = Array.from({ length: numberOfCards }, (_, index) => index + 1);

  return (
    <div className="card-menu">
      {cards.map(card => (
        <div key={card} className="card">
          Card {card}
        </div>
      ))}
    </div>
  );
};

export default CardMenu;
