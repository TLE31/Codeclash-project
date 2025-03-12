import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import axios from "axios";
import "./Bookmarks.css";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BsBookmarkFill, BsSearch } from "react-icons/bs";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [user, navigate]);

  const fetchBookmarks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/bookmarks', config);
      setBookmarks(data.data.bookmarks);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch bookmarks');
      setLoading(false);
    }
  };

  const removeBookmark = async (chatId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post('/api/bookmarks/remove', { chatId }, config);
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== chatId));
      toast.success('Bookmark removed successfully');
    } catch (error) {
      toast.error('Failed to remove bookmark');
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => 
    bookmark.chatName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.users?.some(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bookmarks-page">
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bookmarks-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Helmet>
        <title>Bookmarks | CodeClash</title>
      </Helmet>

      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <div className="title-section">
            <BsBookmarkFill className="bookmark-icon" />
            <h1>Your Bookmarks</h1>
          </div>
          
          <div className="search-container">
            <BsSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search bookmarks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredBookmarks.length === 0 ? (
          <div className="no-bookmarks">
            <h2>No bookmarks found</h2>
            <p>You haven't bookmarked any discussions yet.</p>
            <Link to="/discussions" className="browse-link">
              Browse Discussions
            </Link>
          </div>
        ) : (
          <motion.div 
            className="bookmarks-grid"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredBookmarks.map((bookmark) => (
              <motion.div
                key={bookmark._id}
                className="bookmark-card"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="bookmark-content">
                  <Link 
                    to={`/chat/${bookmark._id}`} 
                    className="bookmark-title"
                  >
                    {bookmark.chatName || 'Untitled Discussion'}
                  </Link>
                  <p className="bookmark-description">
                    {bookmark.latestMessage?.content || 'No messages yet'}
                  </p>
                  <div className="bookmark-meta">
                    <span className="bookmark-date">
                      {formatDate(bookmark.updatedAt)}
                    </span>
                    <button
                      className="remove-bookmark-btn"
                      onClick={() => removeBookmark(bookmark._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Bookmarks; 