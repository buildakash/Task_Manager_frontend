import axios from 'axios';

const instance = axios.create({
  baseURL:  'https://task-management-backend-4xw2.onrender.com',
});

export default instance;
