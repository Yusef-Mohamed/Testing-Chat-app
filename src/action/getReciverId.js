export const getReceiverId = (chatData) => {
  const receiverId = chatData?.participants?.find(
    (participant) =>
      participant.userId !== JSON.parse(localStorage.getItem("user"))._id
  )?.userId;
  return receiverId;
};
