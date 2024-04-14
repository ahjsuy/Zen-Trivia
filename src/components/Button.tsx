import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
  colors: string[];
  onClick: () => void;
}

const Button = ({ children, colors, onClick }: Props) => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button
        type="button"
        className={colors[counter % 3]}
        onClick={() => {
          onClick();
          setCounter(counter + 1);
        }}
      >
        {children}
        {counter}
      </button>
    </div>
  );
};

export default Button;
