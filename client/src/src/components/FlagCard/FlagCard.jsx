import React, { useState } from "react";
import "./FlagCard.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { ChatState } from "../../context/ChatProvider";
import { FaLink, FaUser, FaLightbulb, FaFlag, FaCheck, FaLock, FaUnlock } from "react-icons/fa";
import { motion } from "framer-motion";

const FlagCard = ({ object }) => {
  const { isUserLoggedIn } = ChatState();
  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const eyeChange = () => {
    setShow(!show);
  };
  
  const submitFlag = async () => {
    if (!flag) {
      toast.error("Please enter a flag", {
        autoClose: 1000,
      });
      return;
    }
    
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const data = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/ctf/submitFlag`,
        { flag: flag, ctfId: object._id },
        config
      );
      console.log(data);
      setLoading(false);
      if (data.data.status === "success") {
        setFlag("");
        setIsSolved(true);
        toast.success(data.data.message, {
          autoClose: 2500,
        });
      } else {
        toast.error(data.data.message, {
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Entered Flag is not correct, Please try again", {
        autoClose: 1000,
      });
      setLoading(false);
      console.error(error);
    }
  };
  
  const isSolvedByUser = object && object.users.includes(isUserLoggedIn.current.data.user._id);
  
  return (
    <motion.div 
      className={`card hover:border-primary transition-all duration-300 ${isSolvedByUser ? 'border-green-300' : ''}`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isSolvedByUser && (
        <motion.div 
          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center absolute -top-3 right-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
        >
          <FaCheck className="mr-1" /> Solved
        </motion.div>
      )}
      
      <h2 className="text-xl font-bold text-primary mb-3 flex items-center justify-between">
        <span>{object ? object.heading : ""}</span>
        <motion.button 
          className="text-primary-light hover:text-primary transition-colors duration-300 focus:outline-none"
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showDetails ? 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg> : 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          }
        </motion.button>
      </h2>
      
      <motion.div 
        className="space-y-3 mb-4"
        animate={{ height: showDetails ? 'auto' : 'auto' }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-gray-700">
          <p className="mb-2">{object ? object.description : ""}</p>
        </div>
        
        <motion.div 
          className="flex items-center text-blue-600"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaLink className="mr-2 text-primary" />
          <a 
            href={object ? object.link : ""} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline overflow-hidden text-ellipsis transition-all duration-300 hover:text-primary"
          >
            {object ? object.link : ""}
          </a>
        </motion.div>
        
        <motion.div 
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaUser className="mr-2 text-primary" />
          <div className="flex items-center">
            {object ? (
              <img 
                src={object.host.photo} 
                alt={object.host.name}
                className="w-6 h-6 rounded-full mr-2 border border-primary object-cover" 
              />
            ) : ""}
            <span className="text-gray-700 font-medium">{object ? object.host.name : ""}</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaLightbulb className="mr-2 text-primary" />
          <span className="text-gray-700">Hint: </span>
          <motion.button 
            onClick={eyeChange} 
            className="ml-2 text-primary hover:text-primary-hover transition-colors focus:outline-none"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {show ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </motion.button>
          {object && object.hint && show && (
            <motion.span 
              className="ml-2 text-gray-700 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {object.hint}
            </motion.span>
          )}
        </motion.div>
      </motion.div>
      
      <div className="mt-4 space-y-3">
        <div className="relative">
          <TextField
            id="filled-multiline-static"
            label="Enter flag"
            variant="outlined"
            fullWidth
            value={flag}
            className="input-field"
            onChange={(e) => {
              setFlag(e.target.value);
            }}
            InputProps={{
              startAdornment: <FaFlag className="mr-2 text-primary" />,
              endAdornment: flag ? <FaLock className="text-primary" /> : <FaUnlock className="text-gray-400" />,
            }}
          />
        </div>
        <motion.button 
          className="btn-cta-blue w-full py-2 flex items-center justify-center"
          onClick={submitFlag}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {!loading ? (
            <>Submit Flag</>
          ) : (
            <BeatLoader color="#fff" size={8} />
          )}
        </motion.button>
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
    </motion.div>
  );
};

export default FlagCard;
