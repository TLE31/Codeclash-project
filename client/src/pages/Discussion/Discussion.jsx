import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import "./Discussion.css";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscussionCard from "../../components/DiscussionCard/DiscussionCard";
import { BiBot } from "react-icons/bi";
import { IoCloseOutline, IoSend } from "react-icons/io5";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import Profile from "../../components/profile/profile";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPlus, FaSearch, FaComments } from "react-icons/fa";

const Discussion = () => {
  const { user, setUser, isUserLoggedIn } = ChatState();

  const [newDiscussion, setNewDiscussion] = useState("");
  const [discussion, setDiscussion] = useState([]);
  const [discussionName, setDiscussionName] = useState("");
  const [discription, setDiscription] = useState("");
  const [isChatOn, setIsChatOn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);

  const [message, setMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Content[]

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    setMessageLoading(true);
    try {
      setChatHistory((prevMsg) => [
        ...prevMsg,
        { role: "user", parts: [{ text: message }] },
      ]);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/chat/bot`,
        { message: message, history: chatHistory },
        config
      );

      console.log({ data });

      if (data.success && data.text) {
        setChatHistory((prevMsg) => [
          ...prevMsg,
          { role: "model", parts: [{ text: data.text }] },
        ]);
      } else {
        console.log("Error response:", data);
        toast.error(data.message || "Failed to get response from AI", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Extract the error message from the response if available
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to connect to the AI service";
      
      toast.error(errorMessage, {
        autoClose: 3000,
      });
      
      // Add a system message to the chat to inform the user
      setChatHistory((prevMsg) => [
        ...prevMsg,
        { 
          role: "model", 
          parts: [{ 
            text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later or contact support if the problem persists." 
          }] 
        },
      ]);
    } finally {
      setMessageLoading(false);
      setMessage("");
    }
  };

  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const handleClick = async () => {
    if (!discussionName) {
      toast.error("Enter discussion Name", {
        autoClose: 1000,
      });
    } else {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("userInfo")).token
            }`,
          },
        };
        const { data } = await axios.post(
          `${
            import.meta.env.VITE_PUBLIC_SERVER_URL
          }/api/v1/chat/create-discussion`,
          {
            chatName: discussionName,
            discription: discription,
            code: code,
          },
          config
        );
        toast.success("New discussion added", {
          autoClose: 1000,
        });
        setNewDiscussion(data);

        // console.log(data);
        setCode("");
        setDiscription("");
        setDiscussionName("");
        setShowNewDiscussion(false);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || "Failed to create discussion", {
          autoClose: 1000,
        });
      }
    }
  };
  const pageLoad = async () => {
    // console.log("inside page load");
    // console.log(user);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/chat/discussion`,
        config
      );
      setDiscussion(data);
      //   console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // window.addEventListener("beforeunload", pageLoad);

  useEffect(() => {
    if (!isUserLoggedIn.current) {
      console.log(isUserLoggedIn.current);
      navigate("/login");
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    pageLoad();
    // console.log("working");
  }, []);

  useEffect(() => {
    setDiscussion([...discussion, newDiscussion]);
  }, [newDiscussion]);

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

  // Filter discussions based on search term
  const filteredDiscussions = discussion.filter(
    (item) => 
      item && (
        (item.chatName && item.chatName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (item.discription && item.discription.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  );

  return (
    <div className="discussion-page">
      <Helmet>
        <title>CodeClash | Discussion</title>
      </Helmet>
      
      <motion.div 
        className="discussion-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="discussion-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="discussion-title">
            <FaComments className="discussion-icon" />
            <h1>Discussions</h1>
          </div>
          
          <div className="discussion-actions">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <motion.button 
              className="new-discussion-btn"
              onClick={() => setShowNewDiscussion(!showNewDiscussion)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus /> {showNewDiscussion ? "Cancel" : "New Discussion"}
            </motion.button>
          </div>
        </motion.div>
        
        {showNewDiscussion && (
          <motion.div 
            className="new-discussion-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Create New Discussion</h3>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="Enter discussion title"
                value={discussionName}
                onChange={(e) => setDiscussionName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter discussion description"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
                rows={4}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="code">Code (Optional)</label>
              <textarea
                id="code"
                placeholder="Enter code if any"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={4}
              ></textarea>
            </div>
            <motion.button 
              className="create-discussion-btn"
              onClick={handleClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Discussion
            </motion.button>
          </motion.div>
        )}
        
        <div className="discussions-list-container">
          {!discussion || discussion.length === 0 ? (
            <div className="no-discussions">
              <p>No discussions found. Start a new one!</p>
            </div>
          ) : (
            <motion.div 
              className="discussions-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredDiscussions.map((item) => (
                <DiscussionCard item={item} key={item?._id ? item._id : ""} />
              ))}
            </motion.div>
          )}
        </div>
        
        <div className="chatbox-container">
          {isChatOn ? (
            <div className="chat-body">
              <div className="chat-heading">
                <BiBot /> CodeClash AI{" "}
                <button
                  className="chatbot-close-btn"
                  onClick={() => setIsChatOn((pre) => !pre)}
                >
                  <IoCloseOutline size={30} />
                </button>
              </div>
              <div className="chatbot-chat-body">
                <div className="chatbot-chat-area">
                  <div className="chatbot-chat-text-bot">
                    <p>Hi, I am CodeClash AI. How can I help you?</p>
                  </div>
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`chatbot-chat-text-${
                        msg.role === "user" ? "user" : "bot"
                      }`}
                    >
                      <pre>{msg.parts[0].text}</pre>
                    </div>
                  ))}
                  {messageLoading && (
                    <div className={`chatbot-chat-text-bot-loading`}>
                      <div className="loading">
                        <BeatLoader color="#fff" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <form
                onSubmit={(e) => sendMessage(e)}
                className="chatbot-bottom-area"
              >
                <input
                  disabled={messageLoading}
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  required
                  className="chatbot-input-text"
                  placeholder="Type Something..."
                  type="text"
                />
                <button disabled={messageLoading} type="submit">
                  <IoSend />
                </button>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsChatOn((pre) => !pre)}
              className="chatbot-btn"
            >
              <BiBot />
            </button>
          )}
        </div>
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

export default Discussion;
