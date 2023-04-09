import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Chat.css'

function Chat() {
  const chats = [
    {
      name: "chat1",
      avatarUrl: "url",
      status: "active",
      messages: [
        {
          isMine: "mine",
          text: "Ce mai faci?",
          timestamp: "11393922"
        },
        {
          isMine: "other",
          text: "Bine tu?",
          timestamp: "11393922"
        }
      ]
    },
    {
      name: "chat2",
      avatarUrl: "url",
      status: "active",
      messages: [
        {
          isMine: true,
          text: "Ce mai faci?",
          timestamp: "11393922"
        },
        {
          isMine: false,
          text: "Bine tu?",
          timestamp: "11393922"
        }
      ]
    }
  ]

  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const activeChat = chats[activeChatIndex];
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleTabClick = (index) => {
    setActiveChatIndex(index);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const message = {
      text: newMessage,
      isMine: true, // set to false if the message is from the other person
      timestamp: new Date().getTime(),
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-header-left">
          <img className="avatar" src={activeChat.avatarUrl} alt="Avatar" />
          <div>
            <div className="chat-name">{activeChat.name}</div>
            <div className="chat-status">{activeChat.status}</div>
          </div>
        </div>
        <div className="chat-header-right">
          <i className="fas fa-search"></i>
          <i className="fas fa-ellipsis-v"></i>
        </div>
      </div>
      <div className="chat-tabs">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`chat-tab ${index === activeChatIndex ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {chat.name}
          </div>
        ))}
      </div>
      <div className="chat-body">
        {activeChat.messages.map((message, index) => (
          <div key={index} className={`message ${message.isMine ? 'mine' : 'other'}`}>
            <div className="message-text">{message.text}</div>
            <div className="message-timestamp">{message.timestamp}</div>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <form onSubmit={handleSendMessage}>
          <input type="text" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
          <button type="submit">
            <i className="far fa-paper-plane">aaa</i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
