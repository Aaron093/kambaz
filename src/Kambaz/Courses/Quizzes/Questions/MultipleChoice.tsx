import { useDispatch, useSelector } from "react-redux";
import { setAnswer } from "../Attempt/attempt";

export default function MultipleChoice({
  questionIndex,
  question,
  handleAnswerChange,
  isDisabled,
}: {
  questionIndex: number;
  question: any;
  handleAnswerChange?: (questionIndex: number, answer: any) => void;
  isDisabled: boolean;
}) {
  const { attempt } = useSelector((state: any) => state.attemptReducer ?? []);
  const dispatch = useDispatch();

  if (!attempt) {
    return <></>;
  }

  return (
    <div>
      {question.content.text}
      {question.content.choices.map((choice: string) => {
        return (
          <>
            <br />
            <label>
              <input
                name={`MC#${questionIndex}`}
                type="radio"
                value={choice}
                checked={choice === attempt.answers[questionIndex]}
                onChange={(e) => {
                  if (e.target.checked) {
                    dispatch(setAnswer({ questionIndex, answer: choice }));
                    if (handleAnswerChange) {
                      handleAnswerChange(questionIndex, choice);
                    }
                  }
                }}
                disabled={isDisabled}
              />
              {choice}
            </label>
          </>
        );
      })}
    </div>
  );
}
