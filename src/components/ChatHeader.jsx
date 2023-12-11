import { getChatName } from "../action/getChatName";

const ChatHeader = ({ chatDetails }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white text-center">
        Chat with {getChatName(chatDetails)}
      </h2>
    </div>
  );
};

export default ChatHeader;
