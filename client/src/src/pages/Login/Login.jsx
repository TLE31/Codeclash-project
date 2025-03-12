import React, { useEffect, useState } from "react";
import "./Login.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsGoogle, BsGithub, BsLinkedin } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaEnvelope, FaCode } from "react-icons/fa";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setshow] = useState(false);
  const [loginstatus, setloginstatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, setUser, isUserLoggedIn } = ChatState();

  const handleClick = () => setshow(!show);
  
  const login = async (e) => {
    e.preventDefault();

    if (!password || !username) {
      toast.error("Enter all the fields", {
        autoClose: 1000,
      });
    } else {
      try {
        const config = {
          headers: {
            "content-type": "application/json",
          },
        };
        setLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/login`,
          { email: username, password: password },
          config
        );
        const fdata = await data.token;
        if (fdata) {
          console.log(data);
          localStorage.setItem("userInfo", JSON.stringify(data));
          isUserLoggedIn.current = data;
          navigate("/discussion");
          toast.success("Logged in successfully!", {
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          setLoading(false);
          throw new Error("Invalid");
        }
      } catch (err) {
        console.log(JSON.parse(err.request.response).message);
        setLoading(false);
        toast.error(JSON.parse(err.request.response).message, {
          autoClose: 1000,
        });
      }
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };
  
  return (
    <div className="login-page-container">
      <Helmet>
        <title>CodeClash | Login</title>
      </Helmet>
      
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="login-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FaCode className="login-logo-icon" />
          <h1 className="login-title">
            <span className="gradient-text">Code</span>Clash
          </h1>
          <p className="login-subtitle">Welcome back, coder!</p>
        </motion.div>
        
        <motion.form 
          className="login-form"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={login}
        >
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </motion.div>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={show ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={handleClick}
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="forgot-password"
            variants={itemVariants}
          >
            <Link to="/forgotpassword">Forgot Password?</Link>
          </motion.div>
          
          <motion.button 
            type="submit"
            className="login-button"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? <BeatLoader color="#fff" size={8} /> : "Login"}
          </motion.button>
        </motion.form>
        
        <motion.div 
          className="login-footer"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Don't have an account?</p>
          <Link to="/signup">
            <motion.button 
              className="signup-button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
      
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
  );
};

export default Login;
