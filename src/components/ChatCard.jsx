import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";

const ChatCard = ({ data }) => {
  // const recevierUser = null;

  // if (data?.participants?.length !== 0) {
  //   recevierUser = data?.participants?.filter(
  //     (participant) =>
  //       // participant?.userId._id !== JSON.parse(localStorage.getItem("user"))._id
  //       participant.userId !== JSON.parse(localStorage.getItem("user"))._id
  //   )[0];
  // }
  return (
    <Link
      to={`/chat/${data._id}`}
      className="p-4 border border-gray-600 rounded-md flex items-center gap-4"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-slate-600 rounded-full">
        <FaUser />
      </div>
      <div>
        {/* <h1 className="font-semibold">{recevierUser?.userId?.name}</h1>
        <p className="text-gray-400">{recevierUser?.userId?.email}</p> */}
      </div>
    </Link>
  );
};

export default ChatCard;
