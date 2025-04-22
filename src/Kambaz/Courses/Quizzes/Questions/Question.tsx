import React from "react";
import { QuizQuestion } from "../client";
import QuestionHeader from "./QuestionHeader";

interface QuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  point: number;
  isDisabled?: boolean;
}

const Question: React.FC<QuestionProps> = ({
  question,
  questionNumber,
  point,
  isDisabled = false
}) => {
  const renderQuestionContent = () => {
    if (!question.content) return null;

    switch (question.type) {
      case "TRUEFALSE":
        return (
          <div>
            <p className="mb-2">{question.content.text}</p>
            <div className="ms-3">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  disabled={isDisabled}
                  checked={question.content.answer === true}
                  readOnly
                />
                <label className="form-check-label">True</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  disabled={isDisabled}
                  checked={question.content.answer === false}
                  readOnly
                />
                <label className="form-check-label">False</label>
              </div>
            </div>
          </div>
        );

      case "MULTIPLECHOICE":
        return (
          <div>
            <p className="mb-2">{question.content.text}</p>
            <div className="ms-3">
              {question.content.choices.map((choice, index) => (
                <div key={index} className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    disabled={isDisabled}
                    checked={question.content.answer === choice}
                    readOnly
                  />
                  <label className="form-check-label">{choice}</label>
                </div>
              ))}
            </div>
          </div>
        );

      case "FILLINTHEBLANK":
        return (
          <div>
            <p className="mb-2">{question.content.text}</p>
            <div className="ms-3">
              {question.content.blanks.map((blank, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Blank ${index + 1}`}
                    value={blank}
                    disabled={isDisabled}
                    readOnly
                  />
                  <small className="text-muted">
                    Correct answer(s): {question.content.answer[index]?.join(" OR ")}
                  </small>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">
          Question {questionNumber} <span className="float-end">{point} points</span>
        </h5>
        <div className="card-text">{renderQuestionContent()}</div>
      </div>
    </div>
  );
};

export default Question;
