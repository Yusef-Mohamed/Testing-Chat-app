import { Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import { Toaster } from "react-hot-toast";
import Chats from "./page/Chats";
import Chat from "./page/Chat";
export const BASE_URL = "http://localhost:8000/api/v1";
function App() {
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
