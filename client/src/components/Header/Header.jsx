import React, { Fragment, useState, useEffect } from "react";
import user from "../../assets/default.jpg";
import { Link, NavLink, redirect, useNavigate, useLocation } from "react-router-dom";
import userpic from "../../assets/default.jpg";
import { ChatState } from "../../context/ChatProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosPaper, IoMdChatboxes, IoIosRocket } from "react-icons/io";
import { BsChatRightDotsFill } from "react-icons/bs";
import { RiGroupFill } from "react-icons/ri";
import { FaChessKing, FaSignOutAlt } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion } from "framer-motion";

import "./Header.css";
// import "./tempheader.css";
// import { IoNewspaper } from "react-icons/io5";

const Menu = ({ isMobile, closeMobileMenu }) => {
  const location = useLocation();
  
  return (
    <div className={`menu ${isMobile ? 'mobile-menu' : ''}`}>
      <NavLink 
        to="/" 
        className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        <IoIosRocket className="text-lg" />
        <span>CTFs</span>
      </NavLink>
      <NavLink 
        to="discussion" 
        className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        <IoMdChatboxes className="text-lg" />
        <span>Discussion</span>
      </NavLink>
      <NavLink 
        to="chat" 
        className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        <BsChatRightDotsFill className="text-lg" />
        <span>Chat</span>
      </NavLink>
      <NavLink 
        to="social" 
        className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
        onClick={closeMobileMenu}
      >
        <RiGroupFill className="text-lg" />
        <span>Social</span>
      </NavLink>
      {/* <NavLink to="future-scope" className="menu-link">
        <FaChessKing />
        Contests
      </NavLink> */}
    </div>
  );
};

const Header = () => {
  const { user, setOpenProfile, openProfile, isUserLoggedIn } = ChatState();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    isUserLoggedIn.current = null;
    navigate("/login");
    toast.error("You have been logged out", {
      autoClose: 1000,
    });
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={`header shadow-md transition-all duration-300 ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-main container-custom">
        <Link to="/" className="logo">
          <span className="gradient-text">Code</span>Clash
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:block">
          <Menu />
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-primary text-2xl focus:outline-none transition-transform duration-300 hover:scale-110"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <HiX className="text-primary-hover" /> : <HiMenu />}
        </button>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-menu-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Menu isMobile={true} closeMobileMenu={closeMobileMenu} />
          </motion.div>
        )}
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center">
              <Link
                onClick={() => {
                  setOpenProfile(!openProfile);
                  closeMobileMenu();
                }}
                to={`profile/${
                  JSON.parse(localStorage.getItem("userInfo"))
                    ? JSON.parse(localStorage.getItem("userInfo")).data.user.name
                    : ""
                }`}
                className="user group"
              >
                <div className="name font-medium group-hover:text-primary-hover transition-colors duration-300">
                  {user.data.user.name}
                </div>
                <div className="relative">
                  <img
                    src={user.data.user.photo}
                    alt="user"
                    className="user-img group-hover:border-primary-hover transition-colors duration-300"
                  />
                  <div className="absolute inset-0 bg-primary-light/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
              {isUserLoggedIn.current && (
                <button 
                  onClick={handleLogout} 
                  className="text-primary hover:text-primary-hover font-medium transition-colors duration-300 ml-4 flex items-center"
                  aria-label="Logout"
                >
                  <FaSignOutAlt className="mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          ) : (
            <Link 
              className="btn-cta-blue py-2 px-4" 
              to="/login"
            >
              Login
            </Link>
          )}
        </div>
        
        <ToastContainer
          position="bottom-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default Header;
