import React from "react";
import ReactDOM from "react-dom";
import { Toast } from "../components/Toast/Toast";

export const showToast = (toastMessage: string) => {
  const toastContainer = document.getElementById("toast");
  if (toastContainer) {
    if (toastContainer) {
      ReactDOM.render(React.createElement(Toast, { message: toastMessage }), toastContainer);
    }
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(toastContainer);
    }, 5000);
  }
};
