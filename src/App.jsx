import { Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import { Toaster } from "react-hot-toast";
import Chats from "./page/Chats";
import Chat from "./page/Chat";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
// export const BASE_URL = "http://localhost:8000/api/v1";
export const BASE_URL = "https://gp-f2nx.onrender.com/api/v1";
function App() {
  const socket = useRef();
  const token = localStorage.getItem("token");
  const myId = JSON.parse(localStorage.getItem("user"))._id;

  useEffect(() => {
    if (token) {
      socket.current = io("ws://localhost:8000", {
        query: {
          token: localStorage.getItem("token"),
        },
      });
      socket.current.emit("new-user-add", myId);
    }
  }, [token]);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:id" element={<Chat />} />
      </Routes>
    </>
  );
}

export default App;
