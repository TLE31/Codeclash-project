import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import axios from "axios";
import "./Discussion.css";
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

const Discussion = () => {
  const { user, setUser, isUserLoggedIn } = ChatState();

  const [newDiscussion, setNewDiscussion] = useState("");
  const [discussion, setDiscussion] = useState([]);
  const [discussionName, setDiscussionName] = useState("");
  const [discription, setDiscription] = useState("");
  const [isChatOn, setIsChatOn] = useState(false);

  const [message, setMessage] = useState("");
  const [messageLoading, setMessageLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Content[]

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(message);
    setMessageLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("userInfo")).token
        }`,
      },
    };

    try {
      setChatHistory((prevMsg) => [
        ...prevMsg,
        { role: "user", parts: [{ text: message }] },
      ]);

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
        console.log(data.error);
        if (data.error) {
          toast.error("something went wrong : (", {
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.log(error);
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
            Authorization: `Bearer ${user.token}`,
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
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
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

  return (
    <div className="discussion-page">
      <Helmet>
        <title>CodeClash | Discussion</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <div
          style={{
            marginLeft: "350px",
          }}
        >
          {/* <Profile /> */}
        </div>
        <div
          className="discussion-page"
          style={{ width: "100%", marginTop: "-10px" }}
        >
          <div className="discussion-Ask">
            <div className="discussion-question">
              <TextField
                id="filled-basic"
                label="Create New Discussion / Ask new question"
                variant="outlined"
                className="discussion-question-input"
                value={discussionName}
                onChange={(e) => {
                  setDiscussionName(e.target.value);
                }}
              />
              <TextField
                id="filled-basic"
                label="Add description of question"
                variant="outlined"
                multiline
                value={discription}
                className="discussion-question-input"
                onChange={(e) => {
                  setDiscription(e.target.value);
                }}
              />
              <TextField
                id="filled-multiline-static"
                label="Code"
                multiline
                variant="filled"
                value={code}
                className="discussion-question-input"
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <a className="btn-cta-blue" onClick={handleClick}>
                Create Discussion
              </a>
            </div>
          </div>
          <div className="discussion">
            {discussion ? (
              discussion.map((item) => (
                <DiscussionCard item={item} key={item._id ? item._id : ""} />
              ))
            ) : (
              <p>Loading...</p>
            )}
            {/* <DiscussionCard/> */}
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
        </div>
        <div
          style={{
            marginRight: "30px",
          }}
        >
          <Leaderboard />
        </div>
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
  );
};
export default Discussion;
