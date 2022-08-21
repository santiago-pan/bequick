import mosquito from "./../../assets/images/mosquito.png";

export default function Mosquito(props: {
  x: number;
  y: number;
  select: () => void;
}) {
  return (
    <img
      alt="click-item"
      onClick={() => props.select()}
      style={{
        position: "relative",
        top: `${props.y}%`,
        left: `${props.x}%`,
        marginLeft: "-25px",
        marginTop: "-25px",
        height: 50,
      }}
      src={mosquito}
    ></img>
  );
}
