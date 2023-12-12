import { FaBars } from "react-icons/fa6";
import { getChatName } from "../action/getChatName";
import { useContext } from "react";
import { ChatContext } from "./ChatBox";

const ChatHeader = ({ setIsMenuOpen }) => {
  const { chatData } = useContext(ChatContext);
  return (
    <div>
      <h2 className="text-xl font-semibold text-white flex justify-between items-center sm:text-center sm:block">
        <span>Chat with {getChatName(chatData)}</span>
        <button className="sm:hidden" onClick={() => setIsMenuOpen(true)}>
          <FaBars />
        </button>
      </h2>
    </div>
  );
};

export default ChatHeader;
