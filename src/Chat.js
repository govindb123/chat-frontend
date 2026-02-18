import { useEffect, useRef, useState } from "react";
import { createConsumer } from "@rails/actioncable";
import { getUserIdFromToken } from "./utils/jwt";
import { API_URL, WS_URL } from "./config";
import "./Chat.css";

function Chat({ token, conversationId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  const currentUserId = Number(getUserIdFromToken(token));

  // ✅ 1️⃣ Load messages + mark as READ
  useEffect(() => {
    if (!conversationId) return;

    setMessages([]);

    fetch(`${API_URL}/messages/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setMessages(data));

    fetch(`${API_URL}/messages/${conversationId}/read`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }, [conversationId, token]);

  // ✅ 2️⃣ WebSocket (messages + typing + read)
  useEffect(() => {
    if (!conversationId) return;

    const consumer = createConsumer(
      `${WS_URL}/cable?token=${token}`
    );

    const subscription = consumer.subscriptions.create(
      { channel: "ChatChannel", conversation_id: conversationId },
      {
        received(data) {
          if (data.message) {
            setMessages(prev => [...prev, data.message]);
          }

          if (data.type === "typing" && data.user_id !== currentUserId) {
            setTypingUsers(prev =>
              data.is_typing
                ? [...new Set([...prev, data.user_id])]
                : prev.filter(id => id !== data.user_id)
            );
          }

          if (data.type === "read") {
            setMessages(prev =>
              prev.map(m =>
                m.sender_id === currentUserId
                  ? { ...m, status: "read" }
                  : m
              )
            );
          }
        }
      }
    );

    subscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [token, conversationId, currentUserId]);

  // ✅ Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        message: {
          conversation_id: conversationId,
          content: text
        }
      })
    });

    setText("");
    subscriptionRef.current?.perform("typing", { is_typing: false });
  };

  // ✅ Handle typing
  const handleTyping = e => {
    setText(e.target.value);

    subscriptionRef.current?.perform("typing", { is_typing: true });

    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      subscriptionRef.current?.perform("typing", { is_typing: false });
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-arrow" onClick={onBack}>←</span>
        <span className="chat-title">Chat</span>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              m.sender_id === currentUserId ? "sent" : "received"
            }`}
          >
            <span>{m.content}</span>

            {m.sender_id === currentUserId && (
              <span className={`message-status ${m.status}`}>
                {m.status === "sent" && "✓"}
                {m.status === "delivered" && "✓✓"}
                {m.status === "read" && "✓✓"}
              </span>
            )}
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="typing-indicator">typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={handleTyping}
          placeholder="Type a message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
