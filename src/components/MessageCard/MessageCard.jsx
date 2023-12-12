import { useState } from "react";
import AddEmojiToMessage from "./AddEmojiToMessage";
import ReplayToMessage from "./ReplayToMessage";
import DeleteMessage from "./DeleteMessage";
import EditMessage from "./EditMessage";
import { IoCloseOutline } from "react-icons/io5";
const MessageCard = ({ message }) => {
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const isMine = myId === message?.senderId;
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false);
  const [repaliesOpen, setRepaliesOpen] = useState(false);
  return (
    <>
      <div
        className={`w-fit flex ${
          isMine ? "" : "ml-auto flex-row-reverse"
        } message_card items-center group `}
      >
        <div className={`w-[40vw] sm:w-[30vw] relative `}>
          <p
            className={`p-4 rounded-xl font-semibold text-white ${
              isMine ? "bg-sky-600" : "bg-slate-600 order-2"
            }`}
          >
            {message.text}
          </p>
          {message?.repliedTo && (
            <button
              className="text-gray-400 mx-2 text-sm cursor-pointer"
              onClick={() => {
                setRepaliesOpen(true);
              }}
            >
              Replayed message{" "}
            </button>
          )}

          <div className="absolute flex gap-4 items-center -bottom-4">
            {message?.reactions?.map((reaction) => (
              <span
                key={reaction._id}
                className=" bg-slate-800  flex w-6 h-6  items-center justify-center rounded-full"
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
        </div>
        <div
          className={`gap-4 mx-4  items-center order-1  group-hover:flex ${
            emojiMenuOpen ? "flex" : "hidden"
          }`}
        >
          <AddEmojiToMessage
            id={message?._id}
            setEmojiMenuOpen={setEmojiMenuOpen}
            emojiMenuOpen={emojiMenuOpen}
          />
          <ReplayToMessage message={message} />
          {isMine && (
            <>
              <DeleteMessage id={message?._id} />
              <EditMessage message={message} />
            </>
          )}
        </div>
      </div>
      {repaliesOpen && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("fixed")) setRepaliesOpen(false);
          }}
          style={{ marginTop: "0" }}
          className="fixed z-10 w-full h-full flex items-center justify-center top-0 right-0 backdrop-blur-sm cursor-pointer"
        >
          <div className="bg-slate-800 rounded-xl p-10 relative">
            <p
              className={`p-4 min-w-[40vw] rounded-xl font-semibold text-white ${
                isMine ? "bg-sky-600" : "bg-slate-600 order-2"
              }`}
            >
              {message?.repliedTo?.text}
            </p>
            <button
              className=" absolute top-4 right-4 w-6 h-6 flex items-center justify-center border rounded-full "
              onClick={() => {
                setRepaliesOpen(false);
              }}
            >
              <IoCloseOutline className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageCard;
