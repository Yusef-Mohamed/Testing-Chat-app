import axios from "axios";

const axiosIntance = axios.create({
  // baseURL: "http://localhost:8000/api/v1",
  baseURL: "https://gp-f2nx.onrender.com/api/v1",
});
export default axiosIntance;
