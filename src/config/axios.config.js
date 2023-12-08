import axios from "axios";

const axiosIntance = axios.create({
  baseURL: "https://gp-f2nx.onrender.com/api/v1",
});
export default axiosIntance;
