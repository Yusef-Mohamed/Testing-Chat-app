import { useContext, useState } from "react";
import AddEmojiToMessage from "./AddEmojiToMessage";
import ReplayToMessage from "./ReplayToMessage";
import DeleteMessage from "./DeleteMessage";
import EditMessage from "./EditMessage";
import { LuCheckCheck } from "react-icons/lu";
import { ChatContext } from "../ChatBox";

const MessageCard = ({ message, isLaseMessage }) => {
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const isMine = myId === message?.senderId?._id;
  const [emojiMenuOpen, setEmojiMenuOpen] = useState(false);
  const replayToMessage = message?.repliedTo ? message.repliedTo : null;
  let isReplayedMine = false;
  if (replayToMessage) {
    isReplayedMine = replayToMessage?.senderId?._id === myId;
  }

  const { chatData } = useContext(ChatContext);
  let isSeen = false;
  const length = message?.seendBy?.filter((id) => id != myId)?.length;
  if (chatData?.isGroupChat) {
    if (length === chatData?.participants?.length - 1) isSeen = true;
  } else {
    if (length === 1) isSeen = true;
  }
  return (
    <>
      <div
        id={message?._id}
        className={`w-fit flex ${
          isMine ? "" : "ml-auto flex-row-reverse"
        } message_card items-center group `}
      >
        <div className={`w-[40vw] sm:w-[30vw] relative `}>
          <div
            className={`p-4 rounded-xl font-semibold text-white max-w-full overflow-hidden ${
              isMine ? "bg-sky-600" : "bg-slate-600 order-2"
            }`}
          >
            {replayToMessage && (
              <div
                onClick={() => {
                  const message = document.getElementById(replayToMessage._id);
                  message?.classList?.add("scrolled_to");
                  message?.scrollIntoView({ behavior: "smooth" });
                  setTimeout(() => {
                    message?.classList?.remove("scrolled_to");
                  }, 2000);
                }}
                className={`p-2 bg-white cursor-pointer bg-opacity-20 rounded-md text-sm overflow-hidden line-clamp-2 border-l-[6px] ${
                  isReplayedMine ? " border-l-slate-800" : "border-l-sky-800"
                }`}
              >
                <div>
                  {isReplayedMine ? (
                    "you"
                  ) : (
                    <span className="inline-block">
                      {replayToMessage.senderId.username}
                    </span>
                  )}
                </div>
                <p>{replayToMessage.text}</p>
              </div>
            )}

            <p>{message.text}</p>
          </div>
          {isLaseMessage && isMine && (
            <LuCheckCheck
              className={`ml-auto mr-2 my-2 ${
                isSeen ? "text-sky-600" : "text-slate-600"
              } text-xl`}
            />
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
    </>
  );
};

export default MessageCard;
