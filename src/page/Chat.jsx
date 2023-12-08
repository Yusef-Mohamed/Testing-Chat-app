import ChatBox from "../components/ChatBox";
import SideBar from "../components/SideBar";

const Chat = () => {
  return (
    <div className="min-h-screen py-20 bg-slate-700 ">
      <div className="container mx-auto flex gap-8">
        <SideBar />
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
