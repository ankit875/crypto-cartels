import React from "react";
import "./boxTypes.scss";

export const AvenueBox = ({ name, color, id, price }) => {
  const getOrientation = () => {
    if ((id >= 1 && id <= 11) || (id >= 21 && id <= 31))
      return "orientation-top";
    if (id >= 12 && id <= 20) return "orientation-right";
    return "orientation-left";
  };
  return (
    <div className="avenue-box">
      <div className={getOrientation()}>
        <div className="box-color" style={{ backgroundColor: color }}></div>
        <div className="box-text">
          {name} <br />
        </div>
        <div className="box-price">{`$${price}`}</div>
        <div className="box-price"></div>
      </div>
    </div>
  );
};
