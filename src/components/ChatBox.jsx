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
  const markAsSeen = () => {
    axiosIntance
      .put(`/chat/${chatId}/markasread`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
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
    markAsSeen();
  }, [chatId]);

  useEffect(() => {
    if (socket) {
      console.log("joining");
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
      socket.on("see-from", (data) => {
        console.log("seeeing");
        setMessages((prev) =>
          prev.map((message, ind) => {
            if (ind === prev.length - 1) {
              return {
                ...message,
                seendBy: [...message.seendBy.filter((e) => e != data), data],
              };
            }
            return message;
          })
        );
      });

      socket.on("receive-message", (data) => {
        if (data.type === "edit") {
          setMessages((prev) =>
            prev.map((message) =>
              message._id === data.message._id ? data.message : message
            )
          );
        } else {
          markAsSeen();
          setMessages((prev) => [...prev, data.message]);
          socket.emit("see-message", {
            receiverId: data.message.senderId._id,
            chatId: data.message.chatId,
            senderId: myId,
          });
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
        socket.off("see-from");
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
        setChatDetails,
        chatData: chatDetails,
        setSendMessage,
        setMessages,
        replayToMessage,
        setReplayToMessage,
        messageToEdit,
        setMessageToEdit,
      }}
    >
      <div className="w-full bg-slate-900 p-6 rounded-xl flex flex-col gap-4 max-h-screen relative">
        <ChatHeader setIsMenuOpen={setIsMenuOpen} />
        <div
          className="h-full space-y-4 overflow-auto"
          ref={messagesContainerRef}
        >
          {messages.map((message, ind) => (
            <MessageCard
              key={message._id}
              isLaseMessage={ind == messages.length - 1}
              message={message}
            />
          ))}
        </div>
        <MessageSender />
      </div>
    </ChatContext.Provider>
  );
};

export default ChatBox;
