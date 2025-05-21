import React, { useEffect, useState, useRef } from "react";
import ReactHowler from "react-howler";

interface Props {
  choices: string[];
  correctIsSelected: boolean;
  setCorrectIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
  roundComplete: boolean;
}

interface choice {
  className: string;
  text: string;
  isCorrect: boolean;
  isSelected: boolean;
}

const AnswerList = ({
  choices,
  correctIsSelected,
  setCorrectIsSelected,
  roundComplete,
}: Props) => {
  const [choiceObjects, setChoiceObjects] = useState<choice[]>();

  function shuffle(array: string[]): string[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  useEffect(() => {
    let shuffledChoices = shuffle(choices);
    let shuffledChoiceObjects = shuffledChoices.map(
      (choice) =>
        ({
          className: "list-group-item",
          text: choice,
          isCorrect: choice == choices[0],
          isSelected: false,
        } as choice)
    );
    setChoiceObjects(shuffledChoiceObjects);
  }, []);

  useEffect(() => {
    if (roundComplete) {
      setChoiceObjects((prev) =>
        prev?.map((item, index) => {
          if (item.text == choices[0]) {
            return {
              ...item,
              className:
                "list-group-item list-group-item-action list-group-item-success",
            };
          } else if (item.isSelected) {
            return {
              ...item,
              className:
                "list-group-item list-group-item-action list-group-item-danger",
            };
          } else {
            return { ...item };
          }
        })
      );
    }
  }, [roundComplete]);

  return (
    <div className="box-shadow">
      <ReactHowler
        src="\sounds\correct-choice-43861.mp3"
        playing={roundComplete && correctIsSelected}
        volume={0.375}
      />
      <ReactHowler
        src="\sounds\wrong-47985.mp3"
        playing={roundComplete && !correctIsSelected}
        volume={0.375}
      />
      <ul
        className="list-group"
        style={{
          minWidth: "45vw",
          textAlign: "center",
          fontSize: "1.75rem",
        }}
      >
        {choiceObjects?.map((item, index) => (
          <li
            className={item.className}
            onClick={() => {
              let newState = choiceObjects.map((c, i) => {
                if (index == i) {
                  return {
                    ...c,
                    className: "list-group-item active",
                    isSelected: true,
                  };
                } else if (c.isSelected) {
                  return {
                    ...c,
                    className: "list-group-item",
                    isSelected: false,
                  };
                } else {
                  return c;
                }
              });
              setChoiceObjects(newState);
              if (item.text == choices[0]) {
                setCorrectIsSelected(true);
              } else {
                setCorrectIsSelected(false);
              }
            }}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnswerList;
