import { useState } from "react";
import { useParams } from "react-router-dom";
import axiosIntance from "../config/axios.config";
import { FaSpinner } from "react-icons/fa6";

const MessageSender = ({ chatData, setSendMessage, setMessages }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatId = useParams().id;
  const receiverId = chatData?.participants?.find(
    (participant) =>
      participant.userId._id !== JSON.parse(localStorage.getItem("user"))._id
  ).userId._id;
  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axiosIntance
      .post(
        `/message/${chatId}`,
        { text: message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setMessage("");
        const messageData = {};
        setSendMessage({
          // receiverId: chatId,
          senderId: JSON.parse(localStorage.getItem("user"))._id,
          receiverId: chatData?.isGroupChat ? chatId : receiverId,
          chatType: chatData?.isGroupChat ? "group" : "user",
          message: { text: res.data },
        });
        setMessages((prev) => [...prev, res.data]);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center absolute bg-black bg-opacity-50 rounded-xl">
          <FaSpinner className="animate-spin text-white text-2xl" />
        </div>
      )}
      <input
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        disabled={isLoading}
        value={message}
        placeholder="Your message"
        className="w-full py-3 px-6 rounded-xl bg-slate-800 text-white"
      />
    </form>
  );
};

export default MessageSender;
