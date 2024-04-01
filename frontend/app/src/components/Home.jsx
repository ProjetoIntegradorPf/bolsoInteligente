import React from 'react';
import Sidebar from './Sidebar';
import CardMenu from './CardMenu';

const App = () => {
  return (
    <div>
      <Sidebar />
      <CardMenu numberOfCards={6} />
    </div>
  );
};

export default App;
