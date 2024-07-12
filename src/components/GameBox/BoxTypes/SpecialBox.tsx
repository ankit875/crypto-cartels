/* eslint-disable @typescript-eslint/no-explicit-any */
import chanceIcon from "../../../assets/question.png";
import communityIcon from "../../../assets/chest.png";
import railRoadIcon from "../../../assets/rail.png";
import taxIcon from "../../../assets/tax.png";
import { BOX_TYPES } from "../../../Constants";
import "./boxTypes.scss";

export const SpecialBox = ({
  type,
  name,
  price,
  pricetext,
}: {
  type: any;
  name?: any;
  price?: any;
  pricetext?: any;
}) => {
  const getBoxImage = () => {
    if (type === BOX_TYPES.CHANCE)
      return <img src={chanceIcon} alt={`${type} Icon`} />;
    if (type === BOX_TYPES.COMMUNITY)
      return <img src={communityIcon} alt={`${type} Icon`} />;
    if (type === BOX_TYPES.RAILROADS)
      return <img src={railRoadIcon} alt={`${type} Icon`} />;
    if (type === BOX_TYPES.TAX)
      return <img src={taxIcon} alt={`${type} Icon`} />;
  };

  const getBoxText = () => {
    if (type === BOX_TYPES.CHANCE) return "Chance";
    if (type === BOX_TYPES.COMMUNITY) return "Community";
    return name;
  };
  return (
    <div className="chance-box">
      <div className="box-text">{getBoxText()}</div>
      <div className="box-image">{getBoxImage()}</div>
      {price && <div className="box-price">{`$${price}`}</div>}
      {pricetext && !price && <div className="box-price">{`${pricetext}`}</div>}
    </div>
  );
};
