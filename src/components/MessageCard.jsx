const MessageCard = ({ data }) => {
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const isMine = myId === data.senderId;
  return (
    <div className={`flex ${isMine ? "justify-start" : "justify-end"}`}>
      <p
        className={`w-[40%] text-white font-semibold p-4 rounded-xl ${
          isMine ? "bg-sky-600" : "bg-slate-600"
        }`}
      >
        {data.text}
      </p>
    </div>
  );
};

export default MessageCard;
