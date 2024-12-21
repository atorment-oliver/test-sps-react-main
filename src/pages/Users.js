import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService"; 

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (userId) => {
    try {
      await UserService.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError("No se pudo eliminar el usuario");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await UserService.list();
        setUsers(usersData); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <h1>Usuarios</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div>
          <h2>Lista de usuarios</h2>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} ({user.email}) 
                <button onClick={() => handleDelete(user.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Users;
