import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { getChatName } from "../action/getChatName";

const ChatCard = ({ data }) => {
  return (
    <Link
      to={`/chat/${data._id}`}
      className="p-4 border border-gray-600 rounded-md flex items-center gap-4"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-slate-600 rounded-full">
        <FaUser />
      </div>
      <div>
        <h1 className="font-semibold">{getChatName(data)}</h1>
        {/* 
        <p className="text-gray-400">{recevierUser?.userId?.email}</p> */}
      </div>
    </Link>
  );
};

export default ChatCard;
