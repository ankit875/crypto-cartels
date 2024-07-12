import React from "react";
import "./boxTypes.scss";

export const GoBox = ({ name }) => (
  <div className="go-box">
    <div className="box-text">
      Collect <br /> $200 Salary <br /> as you pass{" "}
      <div className="go-text">{name}</div>
    </div>
  </div>
);
