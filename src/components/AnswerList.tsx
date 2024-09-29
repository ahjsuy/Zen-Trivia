import React, { useEffect, useState, useRef } from "react";
import ReactHowler from "react-howler";

interface Props {
  newQuestion: number;
  correct: string;
  answers: string[];
  result: boolean;
  onSelect: (item: boolean) => void;
}

const AnswerList = ({
  newQuestion,
  correct,
  answers,
  result,
  onSelect,
}: Props) => {
  const defaultStatus = [
    "list-group-item list-group-item-action",
    "list-group-item list-group-item-action",
    "list-group-item list-group-item-action",
    "list-group-item list-group-item-action",
  ];

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [answerStatuses, setAnswerStatuses] = useState(defaultStatus);
  const [correctFX, setCorrectFX] = useState(false);
  const [incorrectFX, setIncorrectFX] = useState(false);

  useEffect(() => {
    setSelectedIndex(-1); // initially, the player has not selected anything yet
    setAnswerStatuses(defaultStatus);
  }, [newQuestion]); // clear the selected answer once a new question renders

  useEffect(() => {
    let newAnswerStatuses = defaultStatus;
    newAnswerStatuses[selectedIndex] =
      "list-group-item list-group-item-action active";
    setAnswerStatuses(newAnswerStatuses);
  }, [selectedIndex]);

  useEffect(() => {
    if (result) {
      let newAnswerStatuses = defaultStatus;
      let incorrectAnswer = true;

      for (let i = 0; i < 4; i++) {
        if (i == selectedIndex && answers[i] == correct) {
          newAnswerStatuses[i] = "list-group-item list-group-item-success";
          setCorrectFX(true);
          incorrectAnswer = false;
          console.log("TRIGGERED CORRECT FX");
        }
        if (i == selectedIndex) {
          newAnswerStatuses[i] = "list-group-item list-group-item-danger";
        }
        if (answers[i] == correct) {
          newAnswerStatuses[i] = "list-group-item list-group-item-success";
        }
      }
      if (incorrectAnswer) {
        setIncorrectFX(true);
        console.log("TRIGGERED INCORRECT FX");
      }
      setAnswerStatuses(newAnswerStatuses);
    }
  }, [result]);

  return (
    <div>
      <ReactHowler
        src="public\sounds\correct-choice-43861.mp3"
        playing={correctFX}
        onEnd={() => {
          setCorrectFX(false);
        }}
        volume={0.375}
      />
      <ReactHowler
        src="public\sounds\wrong-47985.mp3"
        playing={incorrectFX}
        onEnd={() => {
          setIncorrectFX(false);
        }}
        volume={0.375}
      />
      <ul className="list-group">
        {answers.map((answer, index) => (
          <li // ordered list of answers
            key={index} // index was decided on pre sort passed down
            className={
              answerStatuses[index]
              // selectedIndex === index  // if the answer is selected, change the styling to active
              //   ? "list-group-item list-group-item-action active"
              //   : "list-group-item list-group-item-action"
            }
            style={{
              textAlign: "center",
              width: "50vw",
            }}
            onClick={() => {
              // whenever an answer is clicked, change selected answer
              setSelectedIndex(index);
              onSelect(correct === answer ? true : false); // if selection equals correct answer, change the global correct boolean state
            }}
          >
            {answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnswerList;
