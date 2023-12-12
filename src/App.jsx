import { Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import { Toaster } from "react-hot-toast";
import Chats from "./page/Chats";
import Chat from "./page/Chat";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
// export const BASE_URL = "http://localhost:8000/api/v1";
export const BASE_URL = "https://gp-f2nx.onrender.com/api/v1";
export const SocketContext = createContext();
function App() {
  const token = localStorage.getItem("token");
  const myId = JSON.parse(localStorage.getItem("user"))._id;

  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (token) {
      const data = io("ws://localhost:8000", {
        // const data = io("https://gp-f2nx.onrender.com", {
        query: {
          token: localStorage.getItem("token"),
        },
      });
      setSocket(data);
      return () => {
        data.disconnect();
      };
    }
  }, [token]);
  useEffect(() => {
    if (socket) {
      socket.emit("new-user-add", myId);
    }
  }, [socket]);
  return (
    <>
      <SocketContext.Provider value={socket}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </SocketContext.Provider>
    </>
  );
}

export default App;
