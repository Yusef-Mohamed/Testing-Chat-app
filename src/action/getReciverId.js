export const getReceiverId = (chatData) => {
  const receiverId = chatData?.participants?.find(
    (participant) =>
      participant.userId._id !== JSON.parse(localStorage.getItem("user"))._id
  )?.userId._id;
  console.log(chatData);
  console.log(receiverId);
  return receiverId;
};
