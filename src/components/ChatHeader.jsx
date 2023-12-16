import { FaBars } from "react-icons/fa6";
import { getChatName } from "../action/getChatName";
import { useContext, useState } from "react";
import { ChatContext } from "./ChatBox";
import AddUserToGroupModal from "./Modal/AddUserToGroupModal";
import { IoCloseOutline } from "react-icons/io5";

const ChatHeader = ({ setIsMenuOpen }) => {
  const { chatData } = useContext(ChatContext);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  console.log(getChatName(chatData));
  return (
    <>
      <div>
        <h2 className="text-xl font-semibold text-white flex justify-between items-center ">
          <span>Chat with {getChatName(chatData)}</span>
          <div className="flex items-center gap-2">
            <button
              className="w-6 h-6 flex items-center justify-center bg-sky-600 rounded-full hover:bg-sky-700 transition-all"
              onClick={() => setIsDetailsOpen(true)}
            >
              !
            </button>
            <button className="sm:hidden" onClick={() => setIsMenuOpen(true)}>
              <FaBars />
            </button>
          </div>
        </h2>
      </div>
      <div
        className={`absolute p-12 w-full h-full bg-slate-900 top-0 right-0 transition-all z-20 rounded-xl ${
          isDetailsOpen ? "translate-x-0" : "translate-x-[100%]"
        }`}
      >
        <button
          className=" absolute top-4 right-4 w-6 h-6 flex items-center justify-center border rounded-full "
          onClick={() => setIsDetailsOpen(false)}
        >
          <IoCloseOutline className="text-white" />
        </button>
        <h1 className="font-semibold mb-6 text-3xl text-white text-center">
          Chat Details
        </h1>
        <h2 className="font-semibold text-2xl text-white text-center">
          {getChatName(chatData)}
        </h2>
        {chatData?.isGroupChat && (
          <>
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              <h3 className="font-semibold text-xl text-white">Members :</h3>
              {chatData?.participants?.map((member, ind) => (
                <p
                  key={member?._id}
                  className="font-semibold text-white text-lg"
                >
                  {ind != 0 && "-"} {member?.userId?.username}
                </p>
              ))}
            </div>
            <AddUserToGroupModal />
          </>
        )}
      </div>
    </>
  );
};

export default ChatHeader;
