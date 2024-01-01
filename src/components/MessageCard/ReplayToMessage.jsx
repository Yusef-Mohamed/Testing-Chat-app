import { useContext } from "react";
import { IoReturnUpBack } from "react-icons/io5";
import { ChatContext } from "../ChatBox";

const ReplayToMessage = ({ message }) => {
  const { setReplayToMessage, setMessageToEdit } = useContext(ChatContext);
  return (
    <button
      onClick={() => {
        setReplayToMessage(message);
        setMessageToEdit(null);
      }}
    >
      <IoReturnUpBack className="text-xl text-white opacity-50 hover:opacity-100 transition-all" />
    </button>
  );
};

export default ReplayToMessage;
