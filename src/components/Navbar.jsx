import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="logo-bar">APP CHAT</div>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.email}</span>
      </div>
    </div>
  );
};

export default Navbar;
