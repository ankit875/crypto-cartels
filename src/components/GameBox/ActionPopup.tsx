import React from "react";

export const ActionPopup = ({ children }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">{children}</div>
    </div>
  );
};
