import { useEffect, useState } from "react";
import axiosIntance from "../config/axios.config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChatCard from "./ChatCard";

const SideBar = () => {
  const [createChatTo, setCreateChatTo] = useState("");
  const [myChats, setMyChats] = useState([]);
  const nav = useNavigate();
  const myData = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    getMyChats();
  }, []);
  const createChat = (e) => {
    e.preventDefault();
    axiosIntance
      .post(`/chat/${createChatTo}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCreateChatTo("");
        nav(`/chat/${res.data.data._id}`);
      })
      .catch((err) => console.log(err));
  };
  const getMyChats = () => {
    axiosIntance
      .get("/chat/myChats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.data.length === 0) return;
        setMyChats(res.data.data);
      });
  };
  return (
    <div className="space-y-8 p-8 bg-slate-900 text-white rounded-xl w-[400px]">
      <h1 className="font-semibold text-2xl text-center">Chats</h1>
      <div>
        <span className="font-semibold">my id : </span>
        <span
          className="cursor-pointer underline"
          onClick={() => {
            navigator.clipboard.writeText(myData?._id);
            toast.success("copied");
          }}
        >
          {myData?._id}
        </span>
      </div>
      <form onSubmit={createChat}>
        <input
          type="text"
          className="py-2 px-4 rounded-md text-slate-900 w-full"
          onChange={(e) => setCreateChatTo(e.target.value)}
          placeholder="user id"
          value={createChatTo}
        />
      </form>
      <div className="space-y-4 max-h-[50vh] overflow-auto">
        {myChats.map((chat) => (
          <ChatCard key={chat._id} data={chat} />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
