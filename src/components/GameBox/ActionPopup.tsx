import React from "react";

export const ActionPopup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="popup-container">
      <div className="popup-content">{children}</div>
    </div>
  );
};
