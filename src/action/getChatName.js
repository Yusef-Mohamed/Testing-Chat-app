export const getChatName = (chatDetails) => {
  if (chatDetails?.isGroupChat) {
    return chatDetails?.groupName;
  }
  const myId = JSON.parse(localStorage.getItem("user"))._id;
  const anthorUser = chatDetails?.participants?.find(
    (participant) => participant?.userId !== myId
  );
  console.log(anthorUser);
  return anthorUser?.username;
};
