import React, { useEffect, useState } from "react";
import "./Leaderboard.css";
import { Link, NavLink, redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrophy, FaMedal, FaAward, FaCrown, FaChevronUp } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';

const Leaderboard = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highlightedUser, setHighlightedUser] = useState(null);
  
  const pageLoad = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/ctf/leaderboard`,
        config
      );
      console.log(data);
      setRanking(data.users);
      setLoading(false);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    pageLoad();
  }, []);
  
  // Function to get rank icon based on position
  const getRankIcon = (index) => {
    switch(index) {
      case 0:
        return <FaCrown className="text-yellow-500 text-xl" />;
      case 1:
        return <FaMedal className="text-gray-400 text-lg" />;
      case 2:
        return <FaMedal className="text-amber-700 text-lg" />;
      default:
        return <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>;
    }
  };
  
  const handleUserHover = (index) => {
    setHighlightedUser(index);
    if (index === 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
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
    <div className="leaderboard-container">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <BeatLoader color="#e85231" size={10} />
        </div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {ranking.length > 0 ? (
            ranking.map((user, index) => (
              <motion.div 
                key={user._id || index}
                className={`leaderboard-card ${index < 3 ? 'border-l-4 ' + (
                  index === 0 ? 'border-yellow-500' : 
                  index === 1 ? 'border-gray-400' : 
                  'border-amber-700'
                ) : ''} ${highlightedUser === index ? 'highlighted' : ''}`}
                variants={itemVariants}
                whileHover={{ 
                  x: 10, 
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onHoverStart={() => handleUserHover(index)}
                onHoverEnd={() => setHighlightedUser(null)}
              >
                <div className="flex items-center">
                  <div className="rank-indicator mr-3">
                    {getRankIcon(index)}
                  </div>
                  <div className="flex items-center">
                    <motion.img 
                      src={user.photo} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <Link 
                      to={`/profile/${user.name}`} 
                      className="ml-3 font-medium text-gray-800 hover:text-primary transition-colors"
                    >
                      {user.name}
                      {index === 0 && (
                        <motion.span 
                          className="ml-2 text-yellow-500 inline-block"
                          animate={{ rotate: [0, 10, 0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          👑
                        </motion.span>
                      )}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  <motion.div 
                    className={`rounded-full px-3 py-1 text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-amber-700' : 
                      'bg-primary-light'
                    } text-white`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {user.totalCtfs} CTFs
                    {index < 3 && (
                      <motion.span 
                        className="ml-1"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <FaChevronUp />
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No data available</div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Leaderboard;
