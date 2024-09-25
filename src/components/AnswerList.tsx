import React, { useEffect, useState, useRef } from "react";

interface Props {
  newQuestion: number;
  correct: string;
  answers: string[];
  onSelect: (item: boolean) => void;
}

const AnswerList = ({ newQuestion, correct, answers, onSelect }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hover, setHover] = useState([false, false, false, false]);

  useEffect(() => {
    setSelectedIndex(-1); // initially, the player has not selected anything yet
  }, [newQuestion]); // clear the selected answer once a new question renders

  return (
    <div>
      <ul className="list-group">
        {answers.map((answer, index) => (
          <li // ordered list of answers
            key={index} // index was decided on pre sort passed down
            className={
              selectedIndex === index || hover[index] // if the answer is selected, change the styling to active
                ? "list-group-item list-group-item-action active"
                : "list-group-item list-group-item-action"
            }
            style={{ textAlign: "center" }}
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
