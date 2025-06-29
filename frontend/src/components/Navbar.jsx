import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";
import { IoMdHome } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { IoDocumentAttach } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5";
import "../App.css"
import logo from "../assets/Stacked_RGB_Purple-Photoroom.png"


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
    window.location.reload(); // To trigger App.jsx re-render and remove Navbar
  };

  return (
    <nav className="bg-white-800 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold p-2">
        <img
          src={logo}
          alt=""
          width={50}
        />
      </Link>
      <div className="flex justify-between items-center">
        <Link to="/" className="mr-4 text-black hover:text-violet-600">
          <IoMdHome className="a"/>
        </Link>
        <Link to="/documents" className="mr-4 text-black hover:text-violet-600">
         <IoDocumentAttach  className="b"/>
        </Link>
        <Link
          to="/notifications"
          className="mr-4 text-black hover:text-violet-600"
        >
        <IoIosNotifications className="a" />
        </Link>
        <button
          onClick={handleLogout}
          className=" mr-4 text-black hover:text-violet-600"
        >
       <IoLogOut className="a" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
