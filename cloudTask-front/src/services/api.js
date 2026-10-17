import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

export const getTasks = async () => {
    const response = await axios.get(API_BASE_URL);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post(API_BASE_URL, taskData);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, taskData);
    return response.data;
};

export const getTasksByPriority = async (priority) => {
    const response = await axios.get(`${API_BASE_URL}/priority/${priority}`);
    return response.data;
};

export const getTasksByCompletedStatus = async (status) => {
    const response = await axios.get(`${API_BASE_URL}/completed/${status}`);
    return response.data;
};

// Récupérer tous les membres/utilisateurs
export const getUsers = async () => {
    const response = await axios.get('http://localhost:8080/api/users');
    return response.data;
};

// Récupérer les tâches attribuées à un utilisateur précis par son ID
export const getTasksByUser = async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
    return response.data;
};

// NOUVELLE FONCTION : Rechercher les tâches par nom d'utilisateur (partiel / insensibilité à la casse)
export const getTasksByUsername = async (username) => {
    const response = await axios.get(`${API_BASE_URL}/search/user?username=${username}`);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post('http://localhost:8080/api/users/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post('http://localhost:8080/api/users', userData);
    return response.data;
};

export const getTasksSortedByDate = async () => {
    const response = await axios.get(`${API_BASE_URL}/sorted/date`);
    return response.data;
};