export default function FillInTheBlank({
  questionIndex,
  question,
  handleAnswerChange,
  isDisabled,
}: {
  questionIndex: number;
  question: any;
  handleAnswerChange?: (questionIndex: number, answer: string) => void;
  isDisabled: boolean;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (handleAnswerChange) {
      handleAnswerChange(questionIndex, e.target.value);
    }
  };

  const isCorrect = question.userAnswer === question.answer;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="card rounded-3 shadow-sm" style={{ width: "500px" }}>
        <div className="card-header d-flex justify-content-between">
          <h5 className="card-title mb-0">{question.title}</h5>
          <span>{question.points} pts</span>
          {!isDisabled && (
            <span className={`text-${isCorrect ? "success" : "danger"}`}>
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          )}
        </div>

        <div className="card-body">
          <div className="text-center mt-2 mb-5">
            <p className="h5">{question.question}</p>
          </div>

          <div className="text-center mt-2 mb-5">
            <input
              type="text"
              className="form-control d-inline w-auto"
              style={{ width: "120px", display: "inline" }}
              defaultValue={isDisabled ? "" : question.userAnswer || ""}
              onChange={handleInputChange}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
