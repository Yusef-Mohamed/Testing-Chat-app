import { createContext, useContext, useEffect, useRef, useState } from "react";
import axiosIntance from "../config/axios.config";
import ChatHeader from "./ChatHeader";
import MessageSender from "./MessageSender";
import { SocketContext } from "../App";
import { useParams } from "react-router-dom";
import MessageCard from "./MessageCard/MessageCard";
export const ChatContext = createContext();
const ChatBox = ({ setIsMenuOpen }) => {
  const chatId = useParams().id;
  const socket = useContext(SocketContext);
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState({});
  const [sendMessage, setSendMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [replayToMessage, setReplayToMessage] = useState(null);
  const [messageToEdit, setMessageToEdit] = useState(null);
  const messagesContainerRef = useRef(null);
  // Get the chat in chat section
  useEffect(() => {
    axiosIntance
      .get(`/chat/${chatId}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setChatDetails(res.data.data);
      })
      .catch((err) => console.log(err));
    axiosIntance
      .get(`/message/${chatId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => console.log(err));
  }, [chatId]);
  useEffect(() => {
    if (socket) {
      socket.emit("new-user-in-chat", {
        user: myId,
        chat: chatId,
      });
      socket.on("get-users", (users) => {
        setOnlineUsers(users);
      });
      return () => {
        socket.off("get-users");

        socket.emit("user-leave-chat", {
          user: myId,
          chat: chatId,
        });
      };
    }
  }, [chatId, socket]);
  useEffect(() => {
    if (chatDetails?.isGroupChat && socket) {
      socket.emit("create-group-chat", {
        chatId,
        members: chatDetails?.participants?.map(
          (participant) => participant?.userId?._id
        ),
      });
    }
  }, [chatDetails, socket]);
  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null && socket) {
      console.log("sending", sendMessage);
      socket.emit("send-message", sendMessage);
    }
  }, [sendMessage, socket]);
  // Get the message from socket server
  useEffect(() => {
    if (socket) {
      socket.on("receive-message", (data) => {
        console.log("receive", data);
        if (data.type === "edit") {
          setMessages((prev) =>
            prev.map((message) =>
              message._id === data.message._id ? data.message : message
            )
          );
        } else {
          setMessages((prev) => [...prev, data.message]);
        }
      });
      socket.on("deleted-message", (data) => {
        console.log("delete", data);
        setMessages((prev) =>
          prev.filter((message) => message._id !== data.messageId)
        );
      });
    }
    return () => {
      if (socket) {
        socket.off("receive-message");
        socket.off("deleted-message");
      }
    };
  }, [socket]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };
  return (
    <ChatContext.Provider
      value={{
        chatData: chatDetails,
        setSendMessage,
        setMessages,
        replayToMessage,
        setReplayToMessage,
        messageToEdit,
        setMessageToEdit,
      }}
    >
      <div className="w-full bg-slate-900 p-6 rounded-xl flex flex-col gap-4 max-h-screen">
        <ChatHeader setIsMenuOpen={setIsMenuOpen} />
        <div
          className="h-full space-y-4 overflow-auto"
          ref={messagesContainerRef}
        >
          {messages.map((message) => (
            <MessageCard key={message._id} message={message} />
          ))}
        </div>
        <MessageSender />
      </div>
    </ChatContext.Provider>
  );
};

export default ChatBox;
