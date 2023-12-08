// ChatBox.js

import { useEffect, useRef, useState } from "react";
import axiosIntance from "../config/axios.config";
import ChatHeader from "./ChatHeader";
import MessageCard from "./MessageCard";
import MessageSender from "./MessageSender";
import { io } from "socket.io-client";
import { BASE_URL } from "../App";
import { useParams } from "react-router-dom";

const ChatBox = () => {
  const chatId = useParams().id;
  const socket = useRef();
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const [messages, setMessages] = useState([]);
  const [chatDetails, setChatDetails] = useState({});
  const [sendMessage, setSendMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
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

  // Connect to Socket.io

  useEffect(() => {
    socket.current = io("https://gp-f2nx.onrender.com", {
      query: {
        token: localStorage.getItem("token"),
      },
    });
    socket.current.emit("new-user-add", myId);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [chatId]);
  useEffect(() => {
    if (chatDetails?.isGroupChat) {
      console.log("create group chat");
      socket.current.emit("create-group-chat", {
        chatId,
        members: chatDetails?.participants?.map(
          (participant) => participant.userId._id
        ),
      });
    }
  }, [chatDetails]);
  // Send Message to socket server

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Get the message from socket server

  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, data.text]);
    });
    socket.current.on("receive-group-message", (data) => {
      console.log("Received message:", data);
      setMessages((prev) => [...prev, data.text]);
    });
  }, []);

  return (
    <div className="w-full bg-slate-900 p-6 rounded-xl flex flex-col gap-8">
      <ChatHeader chatDetails={chatDetails} />
      <div className="h-full space-y-4">
        {messages.map((message) => (
          <MessageCard key={message._id} data={message} />
        ))}
      </div>
      <MessageSender
        setMessages={setMessages}
        chatData={chatDetails}
        setSendMessage={setSendMessage}
      />
    </div>
  );
};

export default ChatBox;
