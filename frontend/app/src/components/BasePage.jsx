import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

import React, { useContext, useEffect, useState } from "react";

import { UserContext } from "../context/UserContext";

const BasePage = ({ children }) => {
    
  const [message, setMessage] = useState("");
  const [token] = useContext(UserContext);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("something messed up");
    } else {
      setMessage(data.message);
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  return (
    <div>
      <Sidebar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default BasePage;
