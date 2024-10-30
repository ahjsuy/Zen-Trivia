import { Link } from "react-router-dom";

interface Props {
  title: string;
  picture: string;
  description: string;
  link: string;
}

const GamemodeCard = ({ title, picture, description, link }: Props) => {
  return (
    <div
      className="card flex-column roboto-slab-default"
      style={{
        placeItems: "center",
        textAlign: "center",
        width: "50vw",
        borderRadius: "2vw",
        padding: "2vw",
      }}
    >
      <Link
        to={link}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <div>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "90px" }}
          >
            {picture}
          </span>
        </div>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>{title}</div>
        <div style={{ textAlign: "center" }}>{description}</div>
      </Link>
    </div>
  );
};

export default GamemodeCard;
