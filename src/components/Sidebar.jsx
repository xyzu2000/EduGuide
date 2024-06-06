import React from "react";
import Chats from "../components/Chats";
import Navbar from "../components/Navbar";
import Search from "../components/Search";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;