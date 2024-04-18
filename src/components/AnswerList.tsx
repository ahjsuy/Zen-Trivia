import React, { useEffect, useState, useRef } from "react";

interface Props {
  newQuestion: number;
  correct: string;
  answers: string[];
  onSelect: (item: boolean) => void;
}

const AnswerList = ({ newQuestion, correct, answers, onSelect }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [newQuestion]);

  return (
    <div>
      <ul className="list-group">
        {answers.map((answer, index) => (
          <li
            key={index}
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            style={{ textAlign: "center" }}
            onClick={() => {
              setSelectedIndex(index);
              onSelect(correct === answer ? true : false);
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
