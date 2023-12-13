import { IoCloseOutline } from "react-icons/io5";

const Modal = ({ onClose, isOpen, children }) => {
  if (isOpen)
    return (
      <div
        onClick={(e) => {
          if (e.target.classList.contains("fixed")) onClose();
        }}
        style={{ marginTop: "0" }}
        className="fixed z-30 w-full h-full flex items-center justify-center top-0 right-0 backdrop-blur-sm cursor-pointer"
      >
        <div className="bg-slate-800 rounded-xl p-10 relative">
          {children}
          <button
            className=" absolute top-4 right-4 w-6 h-6 flex items-center justify-center border rounded-full "
            onClick={onClose}
          >
            <IoCloseOutline className="text-white" />
          </button>
        </div>
      </div>
    );
  else return null;
};

export default Modal;
