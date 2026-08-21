import axios from "axios";

const API = axios.create({
  baseURL: "https://portfolio-fullstack-ahz1.onrender.com/api/",
  // baseURL: "http://127.0.0.1:8000/api/",
  
});

export default API; 