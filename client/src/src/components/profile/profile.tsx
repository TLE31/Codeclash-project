import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import "./profile.css";

const Profile = () => {
  const { user } = ChatState();
  console.log(user?.data?.user);
  const item = user?.data?.user;
  return (
    <div className="friends-card">
      {/* <p>Requested By:</p> */}
      <div className="friends-pic">
        <img src={item ? item?.photo : ""} alt="user-image" />
      </div>
      <h3>{item ? item?.name : ""}</h3>
      <div style={{ display: "flex" }}>
        <p style={{ marginRight: "10px" }}>
          friends {item ? item?.friends?.length : 0}{" "}
        </p>
        <p> friendsRequest {item ? item?.friendsRequest?.length : 0}</p>
      </div>
      <p>{item ? item?.email : ""}</p>
    </div>
  );
};

export default Profile;
