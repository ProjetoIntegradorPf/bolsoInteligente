import Sidebar from './Sidebar';
import CardMenu from './CardMenu';
import './Home.css';
import { cards } from '../components/Sidebar';

import React from "react";

const Home = () => {

  return (
      <div className="columns" id='home'>
        <div className="column is-one-quarter">
          <Sidebar />
        </div>
        <div className="cards">
          <CardMenu cards={cards} />
        </div>
      </div>
  );
};

export default Home;
