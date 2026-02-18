import { useEffect, useState } from "react";
import Login from "./Login";
import Chat from "./Chat";
import Conversations from "./Conversations";
import UsersList from "./UsersList";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 🔥 NEW

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setActiveConversation(null);
    setShowUsers(false);
  };

  // 🔹 Persist login
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  if (!token) return <Login setToken={setToken} />;

  // 🔹 Open conversation (clears unread)
  const openConversation = id => {
    setActiveConversation(id);
    setRefreshKey(prev => prev + 1); // 🔥 refresh conversations
  };

  // 🔹 Start new chat from UsersList
  const startChat = user => {
    fetch("http://localhost:3000/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        conversation: { receiver_id: user.id }
      })
    })
      .then(res => res.json())
      .then(conversation => {
        openConversation(conversation.id); // 🔥 important
        setShowUsers(false);
      });
  };

  return (
    <div className={`app-layout ${activeConversation ? "chat-open" : ""}`}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Chats</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowUsers(!showUsers)}>＋</button>

            <span
              className="logout-btn"
              onClick={logout}
              title="Logout"
            >
              logout
            </span>
          </div>
        </div>

        {showUsers ? (
          <UsersList token={token} onSelectUser={startChat} />
        ) : (
          <Conversations
            token={token}
            setActiveConversation={openConversation}
            refreshKey={refreshKey} // 🔥 PASS THIS
          />
        )}
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">
        {activeConversation ? (
          <Chat
            token={token}
            conversationId={activeConversation}
            onBack={() => setActiveConversation(null)}
          />
        ) : (
          <div className="empty-chat">Select a chat</div>
        )}
      </div>
    </div>
  );
}

export default App;
