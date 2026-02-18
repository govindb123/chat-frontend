import { useEffect, useState } from "react";
import Login from "./Login";
import Chat from "./Chat";
import Conversations from "./Conversations";
import UsersList from "./UsersList";
import UserProfile from "./UserProfile";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [token, setToken] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔹 Restore login + active chat on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedConversation = localStorage.getItem("activeConversation");

    if (savedToken) {
      setToken(savedToken);

      if (savedConversation) {
        setActiveConversation(Number(savedConversation));
      }
    }
  }, []);

  // 🔹 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeConversation");
    setToken(null);
    setActiveConversation(null);
    setShowUsers(false);
  };

  // 🔹 Open conversation (persist it)
  const openConversation = id => {
    setActiveConversation(id);
    localStorage.setItem("activeConversation", id);
    setRefreshKey(prev => prev + 1);
  };

  // 🔹 Start new chat
  const startChat = user => {
    fetch(`${API_URL}/conversations`, {
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
        openConversation(conversation.id);
        setShowUsers(false);
      });
  };

  if (!token) return <Login setToken={setToken} />;

  return (
    <div className={`app-layout ${activeConversation ? "chat-open" : ""}`}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <UserProfile token={token} />

        <div className="sidebar-header">
          <h3>Chats</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setShowUsers(!showUsers)}>＋</button>

            <span
              className="logout-btn"
              onClick={logout}
              title="Logout"
              style={{ cursor: "pointer" }}
            >
              Logout
            </span>
          </div>
        </div>

        {showUsers ? (
          <UsersList token={token} onSelectUser={startChat} />
        ) : (
          <Conversations
            token={token}
            setActiveConversation={openConversation}
            refreshKey={refreshKey}
          />
        )}
      </div>

      {/* CHAT AREA */}
      <div className="chat-area">
        {activeConversation ? (
          <Chat
            token={token}
            conversationId={activeConversation}
            onBack={() => {
              setActiveConversation(null);
              localStorage.removeItem("activeConversation");
            }}
          />
        ) : (
          <div className="empty-chat">Select a chat</div>
        )}
      </div>
    </div>
  );
}

export default App;
