export const getChatName = (chatDetails, name) => {
  if (chatDetails?.isGroupChat) {
    return chatDetails?.groupName;
  }
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const anthorUser = chatDetails?.participants?.find(
    (participant) => participant?.userId !== myId
  );
  if (name === "header") {
    return anthorUser?.userId?.username;
  }
  return anthorUser?.username;
};
