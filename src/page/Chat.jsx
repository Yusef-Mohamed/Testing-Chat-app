import { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/SideBar";

const Chat = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-700 ">
      <div className=" flex gap-1">
        <div
          className={`${
            isMenuOpen ? "translate-x-0" : "-translate-x-[100%]"
          } transition-all sm:w-[300px] md:w-[400px] duration-300 sm:static sm:translate-x-0 fixed w-[80%] h-screen top-0 left-0 z-10`}
        >
          <SideBar setIsMenuOpen={setIsMenuOpen} />
        </div>
        <ChatBox setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
};

export default Chat;
