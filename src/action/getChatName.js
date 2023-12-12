export const getChatName = (chatDetails) => {
  if (chatDetails?.isGroupChat) {
    return chatDetails?.groupName;
  }
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const anthorUser = chatDetails?.participants?.find(
    (participant) => participant?._id !== myId
  );
  return anthorUser?.username;
};
