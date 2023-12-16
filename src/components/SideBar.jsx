import { useContext, useEffect, useState } from "react";
import axiosIntance from "../config/axios.config";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatCard from "./ChatCard";
import { IoCloseSharp } from "react-icons/io5";
import { SocketContext } from "../App";

const SideBar = ({ setIsMenuOpen }) => {
  const socket = useContext(SocketContext);
  const [createChatTo, setCreateChatTo] = useState("");
  const [myChats, setMyChats] = useState([]);
  const nav = useNavigate();
  const myData = JSON.parse(localStorage.getItem("user"));
  const [searchParams, setSearchParams] = useSearchParams();

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
  const updateChat = (data) => {
    if (data.type === "new") {
      const thisChatId = data.message.chatId;
      let thisChat = myChats.find((chat) => chat._id === thisChatId);
      thisChat = { ...thisChat, lastMessage: data.message };
      setMyChats((prev) => [
        thisChat,
        ...prev.filter((chat) => chat._id !== thisChatId),
      ]);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("update-chat", (data) => {
        console.log("chats", data);

        updateChat(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("update-chat");
      }
    };
  }, [socket, myChats]);
  useEffect(() => {
    if (searchParams.get("newMessage")) {
      const newMessage = JSON.parse(searchParams.get("newMessage"));
      updateChat({ message: newMessage, type: "new" });
      setSearchParams({});
    }
  }, [searchParams]);
  return (
    <div className="space-y-8 p-8 bg-slate-800 h-full sm:bg-slate-900 text-white rounded-xl w-full sm:w-[300px] md:w-[400px] max-h-screen overflow-auto">
      <h1 className="font-semibold text-2xl sm:text-center sm:block flex justify-between items-center">
        <span>Chats</span>
        <button onClick={() => setIsMenuOpen(false)} className="sm:hidden">
          <IoCloseSharp />
        </button>
      </h1>
      <div>
        <span className="font-semibold">my name : </span>
        <span>{myData?.username}</span>
      </div>
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
      <div className="space-y-4 ">
        {myChats.map((chat) => (
          <ChatCard key={chat._id} data={chat} />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
