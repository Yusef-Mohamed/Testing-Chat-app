import { useParams } from "react-router-dom";
import axiosIntance from "../../config/axios.config";
import { ChatContext } from "../ChatBox";
import { useContext } from "react";
import { getReceiverId } from "../../action/getReciverId";

const AddEmojiToMessage = ({ id, setEmojiMenuOpen, emojiMenuOpen }) => {
  const emojies = ["😂", "❤", "😢", "👍", "😡"];
  const { setMessages, setSendMessage, chatData } = useContext(ChatContext);
  const chatId = useParams().id;
  const receiverId = getReceiverId(chatData);
  const addEmoji = (emoji) => {
    axiosIntance
      .post(
        `/message/${id}/reactions`,
        {
          emoji,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setMessages((prev) =>
          prev.map((message) => {
            if (message._id === res.data._id) {
              return res.data;
            }
            return message;
          })
        );
        setSendMessage({
          senderId: JSON.parse(localStorage.getItem("user"))._id,
          receiverId: chatData?.isGroupChat ? chatId : receiverId,
          chatType: chatData?.isGroupChat ? "group" : "user",
          chatId: chatId,
          message: res.data,
          type: "edit",
        });
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="relative">
      <button
        className=" text-xl opacity-50 hover:opacity-100 transition-all "
        onClick={() => setEmojiMenuOpen(true)}
      >
        😁
      </button>
      {emojiMenuOpen && (
        <div className="absolute flex items-center gap-4 text-xl right-[50%] translate-x-[50%] py-2 px-8 bg-gray-800 rounded-xl bottom-8">
          {emojies.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setEmojiMenuOpen(false);
                addEmoji(emoji);
              }}
              className="opacity-80 hover:opacity-100 transition-all"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddEmojiToMessage;
