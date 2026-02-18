import { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function UserProfile({ token }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, [token]);

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="avatar">
        {user.name?.charAt(0).toUpperCase()}
      </div>

      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
      </div>
    </div>
  );
}

export default UserProfile;
