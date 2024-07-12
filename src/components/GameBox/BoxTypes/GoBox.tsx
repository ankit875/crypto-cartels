import "./boxTypes.scss";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GoBox = ({ name }: { name: any }) => (
  <div className="go-box">
    <div className="box-text">
      Collect <br /> $200 Salary <br /> as you pass{" "}
      <div className="go-text">{name}</div>
    </div>
  </div>
);
