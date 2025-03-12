import React from 'react';
import { Helmet } from 'react-helmet';
import './Bookmarks.css';

const Bookmarks = () => {
  return (
    <div className="bookmarks-container">
      <Helmet>
        <title>CodeClash | Bookmarks</title>
      </Helmet>
      <div className="bookmarks-content">
        <h1>Your Bookmarks</h1>
        <div className="bookmarks-list">
          {/* Add your bookmarks content here */}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks; 