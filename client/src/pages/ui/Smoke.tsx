import ko from "./../../assets/images/ko.png";

export default function Smoke(props: { x: number; y: number }) {
  return (
    <img
      alt="item-clicked"
      style={{
        position: "relative",
        top: `${props.y}%`,
        left: `${props.x}%`,
        marginLeft: "-27.5px",
        marginTop: "-25px",
        height: 50,
      }}
      src={ko}
    ></img>
  );
}
