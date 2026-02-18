import { useEffect, useState } from "react";
import { API_URL } from "./config";
import "./UsersList.css";

function UsersList({ token, onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  }, [token]);

  return (
    <div className="users-list">
      <h4>New Chat</h4>

      {users.length === 0 && (
        <p className="empty-text">No users found</p>
      )}

      {users.map(user => (
        <div
          key={user.id}
          className="user-item"
          onClick={() => onSelectUser(user)}
        >
          👤 {user.name}
        </div>
      ))}
    </div>
  );
}

export default UsersList;
