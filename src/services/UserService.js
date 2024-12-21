import axios from "axios";

const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const getToken = () => localStorage.getItem('token');


const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    api.defaults.headers['Authorization'] = `${token}`;
  }
};
const isAuthenticated = () => {
  const token = getToken();
  return token !== null;
};

class UserService {
  async list() {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    setAuthHeader(); 
    try {
      const response = await api.get('/users');
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : 'Error de conexión';
    }
  }

  async get(id) {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    setAuthHeader();
    const response = await api.get(`/users/${parseInt(id)}`);
    return response.data;
  }


  async create(data) {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    setAuthHeader(); 
    try {
      const response = await api.post('/users', data);
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : 'Error de conexión';
    }
  }

  async delete(id) {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    setAuthHeader(); 
    try {
      const response = await api.delete(`/users/${parseInt(id)}`);
      return response.data; 
    } catch (error) {
      throw error.response ? error.response.data : 'Error de conexión';
    }
  }

  async update(id, data) {
    if (!isAuthenticated()) {
      throw new Error('Usuario no autenticado');
    }
    setAuthHeader();
    try {
      const response = await api.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : 'Error de conexión';
    }
  }
}
export const signIn = async (email, password) => {
  try {
    const response = await api.post('/auth', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data.token;
  } catch (error) {
    console.error('Error completo de la solicitud:', error);
    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    throw error.response ? error.response.data : 'Error de conexión';
  }
};

export default new UserService();
