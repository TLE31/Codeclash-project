import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import "./AcessChat.css";

import axios from "axios";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../../../context/ChatLogics";
const AccessChat = ({ messages, setMessages }) => {
  //   const [messages, setMessages] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const fetchMessages = async () => {
    // console.log()
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/message/${
          selectedChat._id
        }`,
        config
      );
      setMessages(data);
      // console.log("------------selected chats-----------");
      // console.log(selectedChat);
      //   console.log(data[0].content);
      //   console.log(data[1].content);
      //   setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
      }}
      className="chatBox"
    >
      {messages ? (
        messages.map((m, i) => (
          <div
            className="right chatBox"
            style={{ display: "flex" }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user.data.user._id) ||
              isLastMessage(messages, i, user.data.user._id)) && (
              <div className="profile-pic-2">
                <img src={m.sender.photo} alt="sender-image" />
              </div>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.data.user._id ? "#fff" : "#e85231"
                }`,
                color: `${
                  m.sender._id === user.data.user._id ? "#e85231" : "#fff"
                }`,
                borderRadius: "20px",
                padding: "10px 20px",
                width: "300px",
                border: "solid 1px #e85231",
                display: "flex",
                height: "auto",
                flexWrap: "wrap",
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user.data.user._id
                ),
                marginTop: isSameUser(messages, m, i, user.data.user._id)
                  ? 3
                  : 10,
              }}
            >
              <p>{m.content}</p>
            </span>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AccessChat;
