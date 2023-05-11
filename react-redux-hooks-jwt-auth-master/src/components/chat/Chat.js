import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";

import './Chat.css';
import { getAllUsers, getMessages, sendMessage } from '../../services/teacher-service';

function Chat() {
  const [users, setUsers] = useState([]);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState([]);
  const user = useSelector((state) => state.auth.user.rows);

  useEffect(() => {
    async function fetchData(){
      setUsers(await getAllUsers());
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (users.data) setActiveChat(users.data[activeChatIndex]);
  }, [activeChatIndex]);

  useEffect(() => {
    if (users.data) {
      getMessages(user[0].id, activeChat.id).then((response) => {
        setMessages(response);
      });
    }
  }, [activeChat]);

  const handleTabClick = (index) => {
    setActiveChatIndex(index);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = {
      message: newMessage,
      sender_id: user[0].id,
      receiver_id: activeChat.id,
      timestamp: new Date().toString(),
    };
    await sendMessage(message);
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-tabs">
        {users.data &&
          users.data.map((chat, index) => (
            <div
              key={index}
              className={`chat-tab ${index === activeChatIndex ? 'active' : ''}`}
              onClick={() => handleTabClick(index)}
            >
              {chat.name}
            </div>
          ))}
      </div>
      <div className="chat">
        <div className="chat-header">
          <div className="chat-header-left">
            <img src="https://circumicons.com/icon/user" alt="" />
            <div>
              <div className="chat-name">{activeChat && activeChat.name}</div>
            </div>
          </div>
          <div className="chat-header-right">
            <i className="fas fa-search"></i>
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        <div className="chat-body">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender_id === user[0].id ? 'mine' : 'other'}`}
              >
                <div className="message-text">{message.message}</div>
                <div className="message-timestamp">{new Date(message.timestamp).toLocaleString()}</div>

              </div>
            ))}
        </div>
        <div className="chat-footer">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">
            <img src=" https://circumicons.com/icon/paperplane" alt="" />
           
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
