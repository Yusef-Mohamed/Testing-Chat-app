import { useContext, useState } from "react";
import Modal from "./Modal";
import { FaSpinner } from "react-icons/fa6";
import axiosIntance from "../../config/axios.config";
import toast from "react-hot-toast";
import { ChatContext } from "../ChatBox";
const AddUserToGroupModal = () => {
  const [addUserModal, setAddUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { chatData, setChatDetails } = useContext(ChatContext);

  const onSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    axiosIntance
      .put(
        `/chat/${chatData._id}/addParticipant`,
        {
          userId,
          isAdmin: isAdmin === "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setChatDetails(res.data.data);
        toast.success("Login Success");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
        setAddUserModal(false);
      });
  };
  return (
    <>
      <button
        onClick={() => setAddUserModal(true)}
        className="text-white bg-sky-600 rounded-md py-2 px-6 block w-fit mx-auto my-4"
      >
        Click here to add user
      </button>
      <Modal onClose={() => setAddUserModal(false)} isOpen={addUserModal}>
        <form className="space-y-4 text-white" onSubmit={onSubmit}>
          <h1 className=" font-semibold text-2xl text-center">
            Add user to group
          </h1>
          <div className="space-y-2">
            <label>User id</label>
            <input
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-slate-900"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label>Role</label>
            <select
              onChange={(e) => setIsAdmin(e.target.value)}
              className="w-full px-4 py-2 rounded-md text-slate-900"
            >
              <option value="" selected>
                user
              </option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button
            disabled={isLoading}
            className="px-6 block w-fit mx-auto bg-green-600 font-semibold py-2 rounded-md disabled:bg-gray-600"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </Modal>
    </>
  );
};

export default AddUserToGroupModal;
