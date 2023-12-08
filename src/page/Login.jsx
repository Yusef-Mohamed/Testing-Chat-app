import { useState } from "react";
import axiosIntance from "../config/axios.config";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const [data, setData] = useState({
    password: "",
    email: "",
  });
  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    axiosIntance
      .post("/auth/login", data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        toast.success("Login Success");
        nav("/chats");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      })
      .finally(() => setIsLoading(false));
  };
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen py-20 bg-slate-700 flex items-center justify-center">
      <form
        className="bg-slate-900 p-6 rounded-xl space-y-4 text-white"
        onSubmit={onSubmit}
      >
        <h1 className=" font-semibold text-2xl ">Login</h1>
        <div className="space-y-2">
          <label>Email</label>
          <input
            onChange={onChange}
            className="w-full px-4 py-2 rounded-md text-slate-900"
            type="email"
            name="email"
            required
          />
        </div>
        <div className="space-y-2">
          <label>Password</label>
          <input
            onChange={onChange}
            className="w-full px-4 py-2 rounded-md text-slate-900"
            type="password"
            name="password"
            required
          />
        </div>
        <button
          disabled={isLoading}
          className="px-6 block w-fit mx-auto bg-green-600 font-semibold py-2 rounded-md disabled:bg-gray-600"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
