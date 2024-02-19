import axios from "axios";

const axiosIntance = axios.create({
  // baseURL: "http://localhost:8000/api/v1",
  baseURL: "http://20.199.94.164:8000/api/v1",
});
export default axiosIntance;
