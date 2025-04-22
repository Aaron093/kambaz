import { TrueFalseQuestionContent } from "./QuizQuestionsEditor";


export default function TrueFalseContent({
  content,
  setContent,
}: {
  content: TrueFalseQuestionContent;
  setContent: (content: TrueFalseQuestionContent) => void;
}) {
  const handleAnswerChange = (value: boolean) => {
    setContent({
      ...content,
      answer: value,
    });
  };

  const questionTextHandler = (e: any) => {
    setContent({
      ...content,
      text: e.target.value,
    });
  };

  return (
    <div>
      <h6>Question</h6>
      <input
        className="form-control"
        value={content.text}
        onChange={questionTextHandler}
        placeholder="Question Text"
      />
      <br></br>
      <h6>Answer</h6>
      <div className="d-flex align-items-center">
        <label>
          <input
            className="me-1"
            type="radio"
            name="truefalse"
            checked={content.answer === true}
            onChange={() => handleAnswerChange(true)}
          />
          True
        </label>
      </div>
      <div className="d-flex align-items-center">
        <label>
          <input
            className="me-1"
            type="radio"
            name="truefalse"
            checked={content.answer === false}
            onChange={() => handleAnswerChange(false)}
          />
          False
        </label>
      </div>
    </div>
  );
}
