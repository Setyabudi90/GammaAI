import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Notification() {
  return (
    <div className="notification">
      <ToastContainer position="top-right" autoClose={5000} theme="dark" />
    </div>
  );
}
