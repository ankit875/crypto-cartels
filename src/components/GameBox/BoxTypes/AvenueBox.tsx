/* eslint-disable @typescript-eslint/no-explicit-any */
import "./boxTypes.scss";
import path from '../../../assets/Die_1.png'

export const AvenueBox = ({
  name,
  color,
  id,
  price,
  imageName,
}: {
  name?: any;
  color?: any;
  id?: any;
  price?: any;
  imageName?:any
}) => {
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
        <br />
        <img src={path.replace("Die_1.png",imageName)} width={20} height={20} />
        <div className="box-text">
          {name} <br />
        </div>
        <div className="box-price">{`$${price}`}</div>
        <div className="box-price"></div>
      </div>
    </div>
  );
};
