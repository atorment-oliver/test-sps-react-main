import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

export async function userLoader({ params }) {
  try {
    const user = await UserService.get(params.userId);
    return { user };
  } catch (error) {
    return { error: "Usuario no encontrado o error en la API" };
  }
}

function EditUser() {
  const { user, error } = useLoaderData();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    email: user ? user.email : "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await UserService.update(user.id, formData);
      navigate("/users");
    } catch (err) {
      alert("Error al actualizar el usuario");
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
