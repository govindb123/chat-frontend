import { useState } from "react";
import Conversations from "./Conversations";
import UsersList from "./UsersList";
import { API_URL } from "./config";
import "./Sidebar.css";

function Sidebar({ token, setActiveConversation }) {
  const [showUsers, setShowUsers] = useState(false);

  // 🔹 Start chat with selected user
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
        setActiveConversation(conversation.id);
        setShowUsers(false);
      });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Chats</h3>
        <button onClick={() => setShowUsers(!showUsers)}>＋</button>
      </div>

      {showUsers ? (
        <UsersList token={token} onSelectUser={startChat} />
      ) : (
        <Conversations
          token={token}
          setActiveConversation={setActiveConversation}
        />
      )}
    </div>
  );
}

export default Sidebar;
