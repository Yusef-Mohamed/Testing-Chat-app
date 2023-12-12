import { useContext, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axiosIntance from "../../config/axios.config";
import { ChatContext } from "../ChatBox";
import { SocketContext } from "../../App";
import { useParams } from "react-router-dom";
import { getReceiverId } from "../../action/getReciverId";
const DeleteMessage = ({ id }) => {
  const { setMessages, chatData } = useContext(ChatContext);
  const socket = useContext(SocketContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const receiverId = getReceiverId(chatData);
  const chatId = useParams().id;

  const onDelete = () => {
    axiosIntance
      .delete(`/message/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMessages((prev) => prev.filter((message) => message._id !== id));
        setMenuOpen(false);
        updateOnSocket();
      })
      .catch((err) => console.log(err));
  };
  const updateOnSocket = () => {
    socket.emit("delete-message", {
      senderId: JSON.parse(localStorage.getItem("user"))._id,
      receiverId: chatData?.isGroupChat ? chatId : receiverId,
      chatType: chatData?.isGroupChat ? "group" : "user",
      chatId: chatId,
      messageId: id,
      test: "suiiiiii",
    });
  };
  return (
    <>
      {menuOpen && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("fixed")) setMenuOpen(false);
          }}
          className="cursor-pointer fixed z-10 w-full h-full flex items-center justify-center top-0 right-0 backdrop-blur-sm"
        >
          <div className="bg-slate-800 rounded-xl p-6">
            <h1 className="font-semibold text-xl text-white">
              Do you want to delete this message
            </h1>
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                className="w-[100px] bg-rose-600 text-white font-semibold py-2 items-center rounded-md"
                onClick={onDelete}
              >
                yes
              </button>
              <button
                className="w-[100px] bg-green-600 text-white font-semibold py-2 items-center rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                no
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => {
          setMenuOpen(true);
        }}
      >
        <FaTrashAlt className="text-xl text-rose-600 opacity-50 hover:opacity-100 transition-all" />
      </button>
    </>
  );
};

export default DeleteMessage;
