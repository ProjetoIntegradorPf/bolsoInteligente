import React from 'react';

const CardMenu = ({ cards }) => {
  return (
    <div className="columns is-multiline is-centered" style={{ paddingLeft: '20%' }}>
      {cards.map((card, index) => (
        <div key={index} className="column is-one-third is-centered">
          <div className="card" style={{ width: '400px' }}> {/* Define o tamanho fixo do card */}
            <div className="card-content has-text-centered"> {/* Alinha o texto do card no centro */}
              <p className="title" style={{ fontSize: '16px' }}>{card}</p> {/* Define o tamanho fixo do texto */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardMenu;
