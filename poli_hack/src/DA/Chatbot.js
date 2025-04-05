 
import React, { useState } from 'react';
import { formatBioGPTResponse } from './formatBioGPTResponse';
import './Chatbot.css';
function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! Ask me something about your gene.' }
  ]);
  const [input, setInput] = useState('');
  const handleSend = async () => {
    if (!input.trim()) return;
  
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
  
    try {
      const res = await fetch("http://localhost:8080/api/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer local-key",
        },
        body: JSON.stringify({
          model: "akhilanilkumar_-_biogpt-baseline",
          prompt: input,
          max_tokens: 512,
          temperature: 0.7,
        }),
      });
  
      const data = await res.json();
      const rawText = data.choices?.[0]?.text || "No answer found.";
      const formatted = formatBioGPTResponse(rawText);
  
      const botMessage = { sender: 'bot', text: formatted, formatted: true };
      setMessages(prev => [...prev, botMessage]);
  
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Error fetching response." }]);
    }
  };
  
  return (
    <>
      <button className="chatbot-button" onClick={() => setOpen(!open)}><img src="/chatbot-icon.png" alt="Chat Icon" /></button>
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
          <span className="chatbot-title">Shifty</span>
          <button className="chatbot-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
                <div
                key={idx}
                className={`chat-message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
                >
                        {msg.formatted ? (
                        <div
                            className="msg-text bot formatted"
                            dangerouslySetInnerHTML={{ __html: msg.text }}
                        />
                        ) : (
                        <p className={`msg-text ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                            {msg.text}
                        </p>
                        )}

                </div>
            ))}
            </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
export default Chatbot;
 
 
 