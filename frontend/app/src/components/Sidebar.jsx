import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li>Item 4</li>
        {/* Adicione mais itens conforme necessário */}
      </ul>
    </div>
  );
};

export default Sidebar;
