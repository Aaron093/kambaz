import { Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { MultipleChoiceQuestionContent } from "./QuizQuestionsEditor";

export default function MultipleChoiceContent({
  content,
  setContent,
}: {
  content: MultipleChoiceQuestionContent;
  setContent: (content: MultipleChoiceQuestionContent) => void;
}) {
  if (!content.choices.includes(content.answer) && content.choices.length > 0) {
    setContent({
      ...content,
      answer: content.choices[0],
    });
  }

  const addChoice = () => {
    setContent({
      ...content,
      choices: [...content.choices, `Answer${content.choices.length + 1}`],
    });
  };

  const deleteChoice = (index: number) => {
    setContent({
      ...content,
      choices: content.choices.filter((_, i) => i !== index),
    });
  };

  const setAnswer = (ans: string) => {
    setContent({
      ...content,
      answer: ans,
    });
  };

  const handleChoiceChange = (index: number, value: string) => {
    setContent({
      ...content,
      choices: content.choices.map((oldValue, i) =>
        i === index ? value : oldValue
      ),
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
      <br></br>
      <h6>Answers</h6>
      {content.choices.map((choice, i) => (
        <div className="py-1">
          <label>
            Possible Answer
            <input
              type="text"
              value={choice}
              onChange={(e) => handleChoiceChange(i, e.target.value)}
              placeholder={`Answer${i + 1}`}
            />
          </label>
          {content.answer === choice ? (
            <Button variant="success">Correct</Button>
          ) : (
            <Button
              variant="danger"
              onClick={() => {
                setAnswer(choice);
              }}
            >
              Set as correct
            </Button>
          )}
          <FaTrash
            className="float-end wd-clickable"
            onClick={() => {
              deleteChoice(i);
            }}
          />
        </div>
      ))}
      <br></br>
      <Button variant="primary" onClick={addChoice}>
        +Add Another Answer
      </Button>
    </div>
  );
}
