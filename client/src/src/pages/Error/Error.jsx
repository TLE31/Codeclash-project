import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import error from '../../assets/error.png';
import './Error.css';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const Error = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  const goBack = () => {
    navigate(-1);
  };
  
  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    if (countdown === 0) {
      navigate('/');
    }
    
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div className="error-page">
      <Helmet>
        <title>CodeClash | Page Not Found</title>
      </Helmet>
      
      <div className="error-container">
        <motion.div 
          className="error-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="error-image-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img src={error} alt="Error 404" className="error-image" />
          </motion.div>
          
          <motion.h1 
            className="error-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="gradient-text">404</span> Page Not Found
          </motion.h1>
          
          <motion.p 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.p 
            className="error-redirect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Redirecting to home page in <span className="countdown">{countdown}</span> seconds...
          </motion.p>
          
          <motion.div 
            className="error-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button 
              className="back-button"
              onClick={goBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft /> Go Back
            </motion.button>
            
            <Link to="/">
              <motion.button 
                className="home-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome /> Home Page
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Error;
