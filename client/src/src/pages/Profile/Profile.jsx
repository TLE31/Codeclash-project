import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, Link, useParams } from "react-router-dom";
import userpic from "../../assets/default.jpg";
import FriendCard from "../../components/FriendCard/FriendCard";
import FriendRequest from "../../components/FriendRequest/FriendRequest";
import { ChatState } from "../../context/ChatProvider";
import { FaUserFriends, FaCode, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { AiTwotoneEdit, AiOutlineMail } from "react-icons/ai";
import { BsCalendarDate, BsTrophy } from "react-icons/bs";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

const Me = () => {
  const { slug } = useParams();
  const { user, isUserLoggedIn, openProfile } = ChatState();
  const [viewUser, setViewUser] = useState();
  const [isTrue, setIsTrue] = useState(false);
  const [request, setRequest] = useState(false);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [click, setClick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [friendRequests, setFriendRequests] = useState([]);

  const pageLoad = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/${slug}`,
        config
      );
      setViewUser(data.user[0]);
      
      // Check if already friends
      for (let i = 0; i < data.user[0].friends.length; i++) {
        if (
          data.user[0].friends[i]._id ===
          JSON.parse(localStorage.getItem("userInfo")).data.user._id
        ) {
          setAlreadyFriend(true);
        }
      }

      // Check if friend request already sent
      for (let i = 0; i < data.user[0].friendsRequest.length; i++) {
        if (
          data.user[0].friendsRequest[i]._id ===
          JSON.parse(localStorage.getItem("userInfo")).data.user._id
        ) {
          setRequest(true);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Failed to load profile", {
        autoClose: 1000,
      });
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/friend-requests`,
        config
      );
      
      if (data.status === 'success') {
        setFriendRequests(data.data.friendRequests);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch friend requests", {
        autoClose: 1000,
      });
    }
  };

  useEffect(() => {
    pageLoad();
    
    // Only fetch friend requests if viewing own profile
    if (isUserLoggedIn.current && slug === isUserLoggedIn.current.data.user.name) {
      fetchFriendRequests();
    }
  }, [slug]);

  const handleFriendRequest = async () => {
    try {
      setClick(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/make-friend`,
        { friendId: viewUser._id },
        config
      );
      
      if (data.status === 'success') {
        if (data.message === 'Friend request sent successfully') {
          setRequest(true);
          toast.success(data.message, {
            autoClose: 1000,
          });
        } else if (data.message === 'Friend request accepted') {
          setAlreadyFriend(true);
          setRequest(false);
          toast.success(data.message, {
            autoClose: 1000,
          });
        } else if (data.message === 'Friend removed successfully') {
          setAlreadyFriend(false);
          toast.info(data.message, {
            autoClose: 1000,
          });
        }
        // Refresh user data
        pageLoad();
      }
      
      setClick(false);
    } catch (error) {
      console.log(error);
      setClick(false);
      toast.error(error.response?.data?.message || "Failed to process friend request", {
        autoClose: 1000,
      });
    }
  };

  const handleFriendRequestResponse = async (friendId, accept) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      
      const { data } = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/accept-request`,
        { 
          friendId: friendId,
          accept: accept 
        },
        config
      );
      
      if (data.status === 'success') {
        if (accept) {
          toast.success("Friend request accepted", {
            autoClose: 1000,
          });
        } else {
          toast.info("Friend request rejected", {
            autoClose: 1000,
          });
        }
        // Refresh user data
        pageLoad();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to process friend request", {
        autoClose: 1000,
      });
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
    <div className="profile-page">
      <Helmet>
        <title>CodeClash | {viewUser ? viewUser.name : "Profile"}</title>
      </Helmet>
      
      {loading ? (
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      ) : viewUser ? (
        <motion.div 
          className="profile-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-header">
            <div className="profile-cover-photo">
              <div className="profile-avatar-container">
                <motion.img 
                  src={viewUser.photo || userpic} 
                  alt={viewUser.name}
                  className="profile-avatar"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
              </div>
            </div>
            
            <motion.div 
              className="profile-info"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="profile-name-section" variants={itemVariants}>
                <h1 className="profile-name">{viewUser.name}</h1>
                {viewUser._id === JSON.parse(localStorage.getItem("userInfo")).data.user._id ? (
                  <Link to="/editprofile" className="edit-profile-btn">
                    <AiTwotoneEdit /> Edit Profile
                  </Link>
                ) : alreadyFriend ? (
                  <span className="friend-status">
                    <FaUserFriends /> Friends
                  </span>
                ) : request ? (
                  <span className="request-sent">Request Sent</span>
                ) : (
                  <motion.button 
                    className="add-friend-btn"
                    onClick={handleFriendRequest}
                    disabled={click}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {click ? "Sending..." : "Add Friend"}
                  </motion.button>
                )}
              </motion.div>
              
              <motion.div className="profile-stats" variants={itemVariants}>
                <div className="stat-item">
                  <span className="stat-value">{viewUser.friends.length}</span>
                  <span className="stat-label">Friends</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{viewUser.challenges?.length || 0}</span>
                  <span className="stat-label">Challenges</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{viewUser.points || 0}</span>
                  <span className="stat-label">Points</span>
                </div>
              </motion.div>
              
              <motion.div className="profile-bio" variants={itemVariants}>
                <p>{viewUser.bio || "No bio available"}</p>
              </motion.div>
              
              <motion.div className="profile-contact" variants={itemVariants}>
                <a href={`mailto:${viewUser.email}`} className="contact-item">
                  <AiOutlineMail /> {viewUser.email}
                </a>
                {viewUser.social?.github && (
                  <a href={viewUser.social.github} target="_blank" rel="noopener noreferrer" className="contact-item">
                    <FaGithub /> GitHub
                  </a>
                )}
                {viewUser.social?.linkedin && (
                  <a href={viewUser.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
                {viewUser.social?.twitter && (
                  <a href={viewUser.social.twitter} target="_blank" rel="noopener noreferrer" className="contact-item">
                    <FaTwitter /> Twitter
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
          
          <div className="profile-content">
            <div className="profile-tabs">
              <button 
                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              <button 
                className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button 
                className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveTab('achievements')}
              >
                Achievements
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              {activeTab === 'about' && (
                <motion.div 
                  key="about"
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="about-section">
                    <h3 className="section-title">
                      <FaCode /> Tech Stack
                    </h3>
                    <div className="tech-stack-container">
                      {viewUser.techStack && viewUser.techStack.length > 0 ? (
                        <div className="tech-stack-list">
                          {viewUser.techStack.map((tech, index) => (
                            <span key={index} className="tech-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="no-data">No tech stack listed</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="about-section">
                    <h3 className="section-title">
                      <BsCalendarDate /> Joined
                    </h3>
                    <p>{new Date(viewUser.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'friends' && (
                <motion.div 
                  key="friends"
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="profile-tab-content">
                    {/* Friend requests section - only show on own profile */}
                    {isUserLoggedIn.current && slug === isUserLoggedIn.current.data.user.name && friendRequests.length > 0 && (
                      <motion.div 
                        className="friend-requests-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h3>Friend Requests ({friendRequests.length})</h3>
                        <div className="friend-requests-list">
                          {friendRequests.map((request) => (
                            <div key={request._id} className="friend-request-card">
                              <div className="friend-request-user">
                                <img 
                                  src={request.photo || userpic} 
                                  alt={request.name} 
                                  className="friend-request-avatar"
                                />
                                <div className="friend-request-info">
                                  <h4>{request.name}</h4>
                                  <p>{request.email}</p>
                                </div>
                              </div>
                              <div className="friend-request-actions">
                                <button 
                                  className="accept-btn"
                                  onClick={() => handleFriendRequestResponse(request._id, true)}
                                >
                                  Accept
                                </button>
                                <button 
                                  className="reject-btn"
                                  onClick={() => handleFriendRequestResponse(request._id, false)}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Friends list */}
                    <motion.div 
                      className="friends-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h3>Friends ({viewUser?.friends?.length || 0})</h3>
                      {viewUser?.friends?.length > 0 ? (
                        <div className="friends-grid">
                          {viewUser.friends.map((friend) => (
                            <FriendCard key={friend._id} friend={friend} />
                          ))}
                        </div>
                      ) : (
                        <p className="no-friends-message">No friends yet</p>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'achievements' && (
                <motion.div 
                  key="achievements"
                  className="tab-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="achievements-section">
                    <h3 className="section-title">
                      <BsTrophy /> Achievements
                    </h3>
                    
                    {viewUser.achievements && viewUser.achievements.length > 0 ? (
                      <div className="achievements-grid">
                        {viewUser.achievements.map((achievement, index) => (
                          <div key={index} className="achievement-card">
                            <div className="achievement-icon">🏆</div>
                            <div className="achievement-info">
                              <h4>{achievement.title}</h4>
                              <p>{achievement.description}</p>
                              <span className="achievement-date">
                                {new Date(achievement.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No achievements yet</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <div className="profile-error">
          <h2>User not found</h2>
          <Link to="/" className="back-home-btn">Back to Home</Link>
        </div>
      )}
      
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

export default Me;
