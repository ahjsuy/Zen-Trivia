interface Props {
  question: string;
}

const Question = ({ question }: Props) => {
  return (
    <div>
      {" "}
      <h1 style={{ textAlign: "center" }}>{question}</h1>
    </div>
  );
};

export default Question;
