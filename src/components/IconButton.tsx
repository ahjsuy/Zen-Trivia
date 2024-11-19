interface Props {
  name: string;
  fontSize: number;
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
  if (selected && setSelected) {
    return (
      <div>
        {selected == name ? (
          <button
            style={{ backgroundColor: "lightBlue", borderStyle: "hidden" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: fontSize }}
            >
              {name}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              setSelected(name);
            }}
            style={{ backgroundColor: "white", borderStyle: "hidden" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: fontSize }}
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
        style={{ backgroundColor: "white", borderStyle: "hidden" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: fontSize }}
        >
          {name}
        </span>
      </button>
    );
  }
};

export default IconButton;
