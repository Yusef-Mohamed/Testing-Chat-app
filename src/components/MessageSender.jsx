import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axiosIntance from "../config/axios.config";
import { FaSpinner } from "react-icons/fa6";
import InputEmojiWithRef from "react-input-emoji";
import { ChatContext } from "./ChatBox";
import { getReceiverId } from "../action/getReciverId";

const MessageSender = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const chatId = useParams().id;
  const {
    chatData,
    setSendMessage,
    setMessages,
    setReplayToMessage,
    replayToMessage,
    messageToEdit,
    setMessageToEdit,
  } = useContext(ChatContext);
  const receiverId = getReceiverId(chatData);
  const onSubmit = () => {
    if (message !== "") {
      if (messageToEdit) {
        setIsLoading(true);
        console.log(messageToEdit._id);
        axiosIntance
          .put(
            `/message/${messageToEdit._id}`,
            { text: message },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            setMessage("");
            setMessageToEdit(null);
            setSendMessage({
              senderId: JSON.parse(localStorage.getItem("user"))._id,
              receiverId: chatData?.isGroupChat ? chatId : receiverId,
              chatType: chatData?.isGroupChat ? "group" : "user",
              chatId: chatId,
              message: res.data,
              type: "edit",
            });
            setMessages((prev) =>
              prev.map((message) =>
                message._id === res.data._id ? res.data : message
              )
            );
          })
          .catch((err) => console.log(err))
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(true);
        axiosIntance
          .post(
            `${
              replayToMessage
                ? `/message/${replayToMessage._id}/reply`
                : `/message/${chatId}`
            }`,
            { text: message },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          .then((res) => {
            setMessage("");
            setReplayToMessage(null);
            setSendMessage({
              senderId: JSON.parse(localStorage.getItem("user"))._id,
              receiverId: chatData?.isGroupChat ? chatId : receiverId,
              chatType: chatData?.isGroupChat ? "group" : "user",
              chatId: chatId,
              message: res.data,
              type: "new",
            });
            setMessages((prev) => [...prev, res.data]);

            setSearchParams({ newMessage: JSON.stringify(res.data) });
          })
          .catch((err) => console.log(err))
          .finally(() => setIsLoading(false));
      }
    }
  };
  useEffect(() => {
    if (messageToEdit) {
      setMessage(messageToEdit.text);
    }
  }, [messageToEdit]);

  return (
    <>
      <div className="relative">
        {messageToEdit && (
          <p className="text-white relative mx-2 font-semibold bg-slate-600 rounded-xl p-3 flex justify-between items-center">
            {messageToEdit.text}
            <span className="absolute top-2 right-10 text-xs font-semibold">
              Editing
            </span>
            <button
              onClick={() => {
                setMessageToEdit(null);
              }}
              className="text-rose-500 absolute top-2 right-2 text-xs font-semibold"
            >
              close
            </button>
          </p>
        )}
        {replayToMessage && (
          <p className="text-white relative mx-2 font-semibold bg-slate-600 rounded-xl p-3 flex justify-between items-center">
            {replayToMessage.text}
            <span className="absolute top-2 right-10 text-xs font-semibold">
              Replay to
            </span>
            <button
              onClick={() => {
                setReplayToMessage(null);
              }}
              className="text-rose-500 absolute top-2 right-2 text-xs font-semibold"
            >
              close
            </button>
          </p>
        )}
        {isLoading && (
          <div className="w-full z-50 h-full flex justify-center items-center absolute top-0 bg-black bg-opacity-75  rounded-xl">
            <FaSpinner className="animate-spin text-white text-2xl" />
          </div>
        )}
        <InputEmojiWithRef
          value={message}
          onChange={setMessage}
          cleanOnEnter
          onEnter={onSubmit}
          placeholder="Type a message"
        />
      </div>
    </>
  );
};

export default MessageSender;
