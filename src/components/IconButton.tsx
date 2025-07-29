interface Props {
  name: string;
  fontSize: string;
  onClick?: () => void;
  selected?: string;
  setSelected?: (selected: string) => void;
}

const IconButton = ({
  name,
  fontSize,
  onClick,
  selected,
  setSelected,
}: Props) => {
  if (setSelected) {
    return (
      <div>
        {selected == name ? (
          <button
            style={{
              border: "1",
              borderStyle: "solid",
              borderColor: "gray",
              borderRadius: "50%",
              height: `${fontSize + 0.25}rem`,
              width: `${fontSize + 0.25}rem`,
              padding: "0.35rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: fontSize, margin: "auto" }}
            >
              {name}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              setSelected(name);
            }}
            style={{
              backgroundColor: "white",
              borderStyle: "hidden",
              borderRadius: "50%",
              height: `${fontSize + 0.25}rem`,
              width: `${fontSize + 0.25}rem`,
              padding: "0.35rem",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: fontSize, margin: "auto" }}
            >
              {name}
            </span>
          </button>
        )}
      </div>
    );
  } else {
    return (
      <button
        onClick={onClick}
        style={{
          backgroundColor: "white",
          borderStyle: "hidden",
          borderRadius: "50%",
          height: `${fontSize + 0.25}rem`,
          width: `${fontSize + 0.25}rem`,
          padding: "0.35rem",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: fontSize, margin: "auto" }}
        >
          {name}
        </span>
      </button>
    );
  }
};

export default IconButton;
