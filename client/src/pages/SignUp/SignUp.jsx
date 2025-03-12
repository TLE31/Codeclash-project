import React, { useState } from "react";
import "./SignUp.css";
import { Helmet } from "react-helmet";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLock, FaEnvelope, FaCode, FaUser, FaImage, FaArrowLeft } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";

const SignUp = () => {
  const [show, setshow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleClick = () => setshow(!show);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword || !password || !name) {
      toast.error("Passwords do not match!", {
        autoClose: 1000,
      });
      return;
    } else {
      try {
        const config = {
          headers: {
            "content-type": "application/json",
          },
        };
        setLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/signup`,
          {
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            photo: pic,
          },
          config
        );
        toast.success("Signup Successful, Please Login to continue", {
          autoClose: 1000,
        });
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        toast.error(JSON.parse(error.request.response).message, {
          autoClose: 1000,
        });
      }
    }
  };

  const postDetails = (pics) => {
    if (!pics) {
      toast.error("Please select an image", {
        autoClose: 1000,
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dkgrvhkxb");
      setPicLoading(true);
      fetch("https://api.cloudinary.com/v1_1/dkgrvhkxb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an image", {
        autoClose: 1000,
      });
      return;
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
    <div className="signup-page-container">
      <Helmet>
        <title>CodeClash | Sign Up</title>
      </Helmet>
      
      <motion.div 
        className="signup-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="signup-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <FaCode className="signup-logo-icon" />
          <h1 className="signup-title">
            <span className="gradient-text">Join</span> CodeClash
          </h1>
          <p className="signup-subtitle">Create your account to get started</p>
        </motion.div>
        
        <motion.form 
          className="signup-form"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={submitHandler}
        >
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="name">Username</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="name"
                placeholder="Enter your username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </motion.div>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="confirm-password">Confirm Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={show ? "text" : "password"}
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </motion.div>
          
          <motion.div className="form-group" variants={itemVariants}>
            <label htmlFor="profile-pic">Profile Picture</label>
            <div className="file-input-container">
              <FaImage className="file-icon" />
              <input
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
              <span className="file-input-label">
                {picLoading ? "Uploading..." : "Choose an image"}
              </span>
            </div>
            {pic && (
              <div className="image-preview">
                <img src={pic} alt="Profile preview" />
              </div>
            )}
          </motion.div>
          
          <motion.button 
            type="submit"
            className="signup-button"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading || picLoading}
          >
            {loading ? <BeatLoader color="#fff" size={8} /> : "Sign Up"}
          </motion.button>
        </motion.form>
        
        <motion.div 
          className="signup-footer"
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p>Already have an account?</p>
          <Link to="/login">
            <motion.button 
              className="login-link-button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaArrowLeft className="mr-2" /> Back to Login
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

export default SignUp;
