import { Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

import { FillInTheBlankQuestionContent } from "./QuizQuestionsEditor";
export default function FillInTheBlankContent({
  content,
  setContent,
}: {
  content: FillInTheBlankQuestionContent;
  setContent: (content: FillInTheBlankQuestionContent) => void;
}) {
  const addChoice = () => {
    setContent({
      ...content,
      answer: [...content.answer, [`Answer${content.blanks.length + 1}`]],
      blanks: [...content.blanks, `Prompt${content.blanks.length + 1}`],
    });
  };

  const setPrompt = (index: number, prompt: string) => {
    setContent({
      ...content,
      blanks: content.blanks.map((oldValue, i) =>
        i === index ? prompt : oldValue
      ),
    });
  };

  const setAnswerOption = (index: number, subindex: number, ans: string) => {
    const newOptions = [...content.answer[index]];
    newOptions[subindex] = ans;
    const newAnswer = [...content.answer];
    newAnswer[index] = newOptions;
    setContent({
      ...content,
      answer: newAnswer,
    });
  };

  const addOption = (index: number) => {
    const newOption = [...content.answer[index], "option"];
    const newAnswer = [...content.answer];
    newAnswer[index] = newOption;
    setContent({
      ...content,
      answer: newAnswer,
    });
  };

  const removeOption = (index: number, subindex: number) => {
    const newOption = [...content.answer[index]];
    if (newOption.length <= 1) {
      const newAnswer = [...content.answer];
      const newBlanks = [...content.blanks];
      newAnswer.splice(index, 1);
      newBlanks.splice(index, 1);
      setContent({
        ...content,
        answer: newAnswer,
        blanks: newBlanks
      })
      return;
    }
    newOption.splice(subindex, 1);
    const newAnswer = [...content.answer];
    newAnswer[index] = newOption;
    setContent({
      ...content,
      answer: newAnswer
    })
  }

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
      {content.blanks.map((prompt, index) => (
        <div className="d-flex pb-1">
          <div>
            {content.answer[index].map((option: string, subindex: number) => {
              return (
                <div className="d-flex">
                  {subindex === 0 ? <input
                    className="form-control"
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(index, e.target.value);
                    }}
                    placeholder={`Prompt${index + 1}`}
                  /> : <div className="w-100"></div>}
                  <input
                    className="form-control"
                    value={content.answer[index][subindex]}
                    onChange={(e) => {
                      setAnswerOption(index, subindex, e.target.value);
                    }}
                    placeholder={`Answer${index + 1}`}
                  />
                  <FaTrash className="fs-3 wd-clickable m-2" onClick={() => {
                    removeOption(index, subindex);
                  }}></FaTrash>
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              addOption(index);
            }}
          >
            +
          </button>
        </div>
      ))}
      <br></br>
      <Button variant="primary" onClick={addChoice}>
        +Add Another Blank
      </Button>
    </div>
  );
}
