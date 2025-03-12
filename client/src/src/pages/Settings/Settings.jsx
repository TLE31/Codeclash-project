import React from 'react';
import { Helmet } from 'react-helmet';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
      <Helmet>
        <title>CodeClash | Settings</title>
      </Helmet>
      <div className="settings-content">
        <h1>Settings</h1>
        <div className="settings-section">
          <h2>Account Settings</h2>
          {/* Add your settings content here */}
        </div>
      </div>
    </div>
  );
};

export default Settings; 