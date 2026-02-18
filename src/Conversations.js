import { useEffect, useState } from "react";
import "./Conversations.css";

function Conversations({ token, setActiveConversation , refreshKey}) {
  const [conversations, setConversations] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // 🔹 Fetch conversations
  useEffect(() => {
    fetch("http://localhost:3000/conversations", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setConversations(Array.isArray(data) ? data : []));
  }, [token, refreshKey]);

  // 🔹 Fetch online users
  useEffect(() => {
    const fetchPresence = () => {
      fetch("http://localhost:3000/presence", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data =>
          setOnlineUsers(
            Array.isArray(data.online_user_ids) ? data.online_user_ids : []
          )
        );
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="conversation-list">
      <h3>Chats</h3>

      {conversations.length === 0 && (
        <p className="empty-text">No conversations found</p>
      )}

      {conversations.map(c => (
        <div
          key={c.id}
          className="conversation-item"
          onClick={() => setActiveConversation(c.id)}
        >
          {/* Left */}
          <strong>{c.user_name}</strong>

          {/* Right */}
          <div className="conversation-right">
            <span
              className="online-dot"
              style={{
                backgroundColor: onlineUsers.includes(c.user_id)
                  ? "#25d366"
                  : "#ccc"
              }}
            />

            {c.unread_count > 0 && (
              <span className="unread-badge">{c.unread_count}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Conversations;
