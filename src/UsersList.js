import { useEffect, useState } from "react";
import "./UsersList.css";

function UsersList({ token, onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [token]);

  return (
    <div className="users-list">
      <h4>New Chat</h4>

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
