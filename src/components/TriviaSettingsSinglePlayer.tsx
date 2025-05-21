import { SetStateAction, Dispatch } from "react";

interface Props {
  categories: {
    music: boolean;
    sports_and_leisure: boolean;
    film_and_tv: boolean;
    arts_and_literature: boolean;
    history: boolean;
    society_and_culture: boolean;
    science: boolean;
    geography: boolean;
    food_and_drink: boolean;
    general_knowledge: boolean;
  };
  difficulties: {
    easy: boolean;
    medium: boolean;
    hard: boolean;
  };
  timerDuration: number;
  setCategories: Dispatch<
    SetStateAction<{
      music: boolean;
      sports_and_leisure: boolean;
      film_and_tv: boolean;
      arts_and_literature: boolean;
      history: boolean;
      society_and_culture: boolean;
      science: boolean;
      geography: boolean;
      food_and_drink: boolean;
      general_knowledge: boolean;
    }>
  >;
  setDifficulties: Dispatch<
    SetStateAction<{ easy: boolean; medium: boolean; hard: boolean }>
  >;
  setTimerDuration: (timerDuration: number) => void;
  setShowSettings: (showSettings: boolean) => void;
}

const TriviaSettings = ({
  categories,
  difficulties,
  setCategories,
  setDifficulties,
  timerDuration,
  setTimerDuration,
  setShowSettings,
}: Props) => {
  const handleTimerDuration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const duration = Number(event.target.value);
    if (duration < 5) {
      setTimerDuration(5);
    } else if (duration > 30) {
      setTimerDuration(30);
    } else {
      setTimerDuration(duration);
    }
  };

  return (
    <div
      className="settings flex-column roboto-slab-default box-shadow"
      style={{ textAlign: "left" }}
    >
      {
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
          }}
        >
          <button
            style={{ borderStyle: "hidden", backgroundColor: "white" }}
            onClick={() => {
              setShowSettings(false);
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ color: "gray", fontSize: "3rem" }}
            >
              close
            </span>
          </button>
        </div>
      }
      <div className="flex-row">
        <div className="flex-column">
          <div style={{ width: "100%", padding: "1rem" }}>
            <h2 style={{}}>
              <b>Categories</b>
            </h2>
            {Object.entries(categories).map((item) => (
              <div className="flex-row" style={{}}>
                <div style={{ marginRight: ".5rem" }}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    onChange={() => {
                      setCategories((prev) => ({
                        ...prev,
                        [item[0]]: !item[1],
                      }));
                    }}
                    checked={item[1]}
                  />
                </div>
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  {item[0]
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </label>
              </div>
            ))}
          </div>
          <div className="flex-column">
            <div style={{ padding: "1rem" }}>
              <h2>
                <b>Difficulties</b>
              </h2>
              {Object.entries(difficulties).map((item) => (
                <div className="flex-row">
                  <div style={{ marginRight: "0.5rem" }}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      onChange={() => {
                        setDifficulties((prev) => ({
                          ...prev,
                          [item[0]]: !item[1],
                        }));
                      }}
                      checked={item[1]}
                    />
                  </div>
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    {item[0].charAt(0).toUpperCase() + item[0].slice(1)}
                  </label>
                </div>
              ))}
            </div>
            <div style={{ padding: "1rem" }}>
              <h2>Timer Duration</h2>
              <input
                type="number"
                id="timerDurationInput"
                className="form-control"
                min="5"
                max="30"
                placeholder="15"
                style={{ width: "75px" }}
                onChange={handleTimerDuration}
              />
              <div id="timerDurationInput" className="form-text">
                Please input a number between 5 - 30 seconds.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaSettings;
