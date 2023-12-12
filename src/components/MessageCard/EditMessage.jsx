import { useContext } from "react";
import { MdEdit } from "react-icons/md";
import { ChatContext } from "../ChatBox";

const EditMessage = ({ message }) => {
  const { setMessageToEdit } = useContext(ChatContext);
  return (
    <button onClick={() => setMessageToEdit(message)}>
      <MdEdit className="opacity-50 hover:opacity-100 transition-all text-xl text-white" />
    </button>
  );
};

export default EditMessage;
