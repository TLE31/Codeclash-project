import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlagCard from "../../components/FlagCard/FlagCard";
import "./Home.css";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import { IoIosFlag, IoIosRocket, IoIosAdd, IoIosCreate } from "react-icons/io";
import { FaTrophy, FaLock, FaUnlock, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const { isUserLoggedIn } = ChatState();
  const [capture, setCapture] = useState([]);
  const [heading, setHeading] = useState("");
  const [loading, setLoading] = useState(false);
  const [discription, setDiscription] = useState("");
  const [hint, setHint] = useState("");
  const [flag, setFlag] = useState("");
  const [link, setLink] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const pageLoad = async () => {
    setPageLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/ctf`,
        config
      );
      console.log(data.data);
      setCapture(data.data);
      setPageLoading(false);
    } catch (error) {
      console.error(error);
      setPageLoading(false);
    }
  };

  const handleClick = async () => {
    if (!discription || !heading || !hint || !flag || !link) {
      toast.error("Enter all the fields", {
        autoClose: 1000,
      });
    } else {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${isUserLoggedIn.current.token}`,
          },
        };
        console.log(isUserLoggedIn.current.token);
        const { data } = await axios.post(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/ctf/createCtf`,
          {
            description: discription,
            heading,
            hint,
            flag,
            link,
          },
          config
        );
        toast.success("New CTF added", {
          autoClose: 1000,
        });
        setLoading(false);
        console.log(data);
        setCapture([...capture, data.data]);
        setDiscription("");
        setHeading("");
        setHint("");
        setFlag("");
        setLink("");
        setShowCreateForm(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
        toast.error(error.response.data.message, {
          autoClose: 1000,
        });
      }
    }
  };
  
  useEffect(() => {
    if (!isUserLoggedIn.current) {
      navigate("/login");
    }
    pageLoad();
  }, []);

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
    <motion.div 
      className="container-custom py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>CodeClash | Home</title>
      </Helmet>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - CTFs */}
        <div className="lg:col-span-2">
          <motion.div 
            className="mb-8"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <span className="gradient-text mr-2">Community Challenges</span>
              <IoIosRocket className="text-primary" />
            </h1>
            <p className="text-gray-600">Capture the flags and climb the leaderboard!</p>
          </motion.div>
          
          {/* CTF List */}
          {pageLoading ? (
            <div className="flex justify-center items-center py-20">
              <BeatLoader color="#e85231" size={15} />
            </div>
          ) : (
            <motion.div 
              className="mb-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-secondary flex items-center">
                  <IoIosFlag className="mr-2 text-primary" /> Available Challenges
                </h2>
                <span className="bg-primary-light text-white px-3 py-1 rounded-full text-sm font-bold">
                  {capture?.length || 0} CTFs
                </span>
              </div>
              
              {capture?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {capture.map((object, index) => (
                    <motion.div 
                      key={object._id} 
                      className="transform transition-all duration-300 hover:scale-105"
                      variants={itemVariants}
                    >
                      <FlagCard object={object} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                  <IoIosFlag className="text-5xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No challenges available yet.</p>
                  <p className="text-gray-500">Be the first to create one!</p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Create CTF Form */}
          <motion.div 
            className="bg-white rounded-lg shadow-card overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="bg-primary text-white p-4 flex justify-between items-center cursor-pointer"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <div className="flex items-center">
                <IoIosCreate className="text-2xl mr-2" />
                <h2 className="text-xl font-semibold">Create New Challenge</h2>
              </div>
              <FaChevronDown className={`transition-transform duration-300 ${showCreateForm ? 'rotate-180' : ''}`} />
            </div>
            
            {showCreateForm && (
              <motion.div 
                className="p-6 space-y-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TextField
                  id="filled-basic"
                  label="Challenge Title"
                  variant="outlined"
                  fullWidth
                  className="input-field"
                  value={heading}
                  onChange={(e) => {
                    setHeading(e.target.value);
                  }}
                />
                <TextField
                  id="filled-basic"
                  label="Challenge Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  value={discription}
                  className="input-field"
                  onChange={(e) => {
                    setDiscription(e.target.value);
                  }}
                />
                <TextField
                  id="filled-multiline-static"
                  label="Challenge URL"
                  variant="outlined"
                  fullWidth
                  value={link}
                  className="input-field"
                  onChange={(e) => {
                    setLink(e.target.value);
                  }}
                />
                <TextField
                  id="filled-multiline-static"
                  label="Hint for Challenge"
                  variant="outlined"
                  fullWidth
                  value={hint}
                  className="input-field"
                  onChange={(e) => {
                    setHint(e.target.value);
                  }}
                />
                <div className="relative">
                  <TextField
                    id="filled-multiline-static"
                    label="Flag for Challenge"
                    variant="outlined"
                    fullWidth
                    value={flag}
                    className="input-field"
                    type="password"
                    onChange={(e) => {
                      setFlag(e.target.value);
                    }}
                    InputProps={{
                      endAdornment: flag ? <FaLock className="text-primary" /> : <FaUnlock className="text-gray-400" />,
                    }}
                  />
                </div>
                <motion.button 
                  className="btn-cta-blue w-full py-3 text-lg font-medium"
                  onClick={handleClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {!loading ? (
                    <>
                      <IoIosAdd className="mr-2 text-xl" /> Create Challenge
                    </>
                  ) : (
                    <BeatLoader color="#fff" size={10} />
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Leaderboard */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-card p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center">
              <FaTrophy className="mr-2 text-yellow-500" /> Leaderboard
            </h2>
            <Leaderboard />
          </div>
        </motion.div>
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

export default Home;
