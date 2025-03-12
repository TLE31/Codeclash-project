import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axios from "axios";
import "./Settings.css";
import { motion } from "framer-motion";

const Settings = () => {
  const { isUserLoggedIn } = ChatState();
  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    language: "en",
    privacy: "public"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user settings
    const loadSettings = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${isUserLoggedIn.current.token}`,
          },
        };
        const { data } = await axios.get(
          `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/settings`,
          config
        );
        if (data.status === "success") {
          setSettings(data.data.settings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    if (isUserLoggedIn.current) {
      loadSettings();
    }
  }, [isUserLoggedIn]);

  const handleSettingChange = async (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${isUserLoggedIn.current.token}`,
        },
      };
      
      const { data } = await axios.patch(
        `${import.meta.env.VITE_PUBLIC_SERVER_URL}/api/v1/users/update-preferences`,
        { [setting]: value },
        config
      );

      if (data.status === "success") {
        toast.success("Settings updated successfully", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings", {
        autoClose: 2000,
      });
      // Revert the setting if update failed
      setSettings(prev => ({ ...prev, [setting]: !value }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <Helmet>
        <title>CodeClash | Settings</title>
      </Helmet>
      
      <motion.div 
        className="settings-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Settings</h1>
        
        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>Theme</label>
            <select 
              value={settings.theme}
              onChange={(e) => handleSettingChange("theme", e.target.value)}
              disabled={loading}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => handleSettingChange("notifications", e.target.checked)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Language</h2>
          <div className="setting-item">
            <label>Preferred Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              disabled={loading}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Privacy</h2>
          <div className="setting-item">
            <label>Profile Visibility</label>
            <select
              value={settings.privacy}
              onChange={(e) => handleSettingChange("privacy", e.target.value)}
              disabled={loading}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 