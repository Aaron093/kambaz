import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import * as quizClient from "../client";
import * as answerClient from "../Attempt/client";
import { setQuestions } from "../Questions/reducer";
import MultipleChoiceQuestion from "../Questions/MultipleChoice";
import FillInBlankQuestion from "../Questions/FillInTheBlank";
import { FaPencil } from "react-icons/fa6";
import { addAttempt } from "../Attempt/reducer";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  console.log("Quiz ID", qid);
  const [quiz, setQuiz] = useState<any>({});
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questions } = useSelector((state: any) => state.questionsReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { attempts } = useSelector((state: any) => state.attemptsReducer);
  const [answers, setAnswers] = useState<any[]>([]);
  const [taking, setTaking] = useState(true); 
  const [isRetaking, setIsRetaking] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    if (qid) {
      const questions = await quizClient.findQuestionsForQuiz(qid);
      dispatch(setQuestions(questions));
    }
  };

  const handleAnswerChange = (
    questionId: number,
    answer: string,
    points?: number
  ) => {
    setAnswers((prevAnswers) => {
      const question = questions.find((q: any) => q._id === questionId);
      const isCorrect = question ? question.answer === answer : false; 

      const existing = prevAnswers.find((ans) => ans.questionId === questionId);
      if (existing) {
        return prevAnswers.map((ans) =>
          ans.questionId === questionId
            ? { ...ans, answer, isCorrect, points }
            : ans
        );
      } else {
        return [...prevAnswers, { questionId, answer, isCorrect, points }];
      }
    });
  };

  const submit = async () => {
    try {
      const userAttempt = attempts.find(
        (attempt: any) =>
          attempt.quiz === qid && attempt.user === currentUser._id
      );

      if (userAttempt) {
        const updatedAttempt = {
          ...userAttempt,
          answers,
          attempt: userAttempt.attempt + 1,
        };
        await answerClient.updateAttempt(updatedAttempt);
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      } else {
        const attempt = {
          answers,
        };
        await answerClient.createAttempt(
          attempt,
          qid as string,
          currentUser._id as string
        );
        dispatch(addAttempt(attempt));
        navigate(`/Kambaz/Courses/${cid}/Quizzes`);
      }
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
    try {
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const renderQuestionComponent = (
    questionIndex: number,
    question: any,
    userAnswer: string
  ) => {
    if (question.type === "Fill in the Blank") {
      return (
        <FillInBlankQuestion
          questionIndex={questionIndex}
          question={question}
          handleAnswerChange={handleAnswerChange}
          isDisabled={!taking}
        />
      );
    } else {
      return (
        <MultipleChoiceQuestion
          questionIndex={questionIndex}
          question={question}
          handleAnswerChange={handleAnswerChange}
          isDisabled={!taking}
        />
      );
    }
  };

  useEffect(() => {
    if (quizzes.length > 0) {
      const quiz = quizzes.find((quiz: any) => quiz._id === qid);
      setQuiz(quiz);

      fetchQuestions();

      if (attempts && Array.isArray(attempts)) {
        const userAttempt = attempts.find(
          (attempt: any) =>
            attempt.quiz === qid && attempt.user === currentUser._id
        );

        if (userAttempt && !isRetaking) {
          setAnswers(userAttempt.answers || []);
          setTaking(false); 
        } else {
          setTaking(true); 
        }
      } else {
        setTaking(true); 
      }
    }
  }, [quizzes, attempts, qid, currentUser._id, isRetaking]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionTitleClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const takeAgain = () => {
    setIsRetaking(true);
    setAnswers([]); 
    setCurrentQuestionIndex(0); 
    setTaking(true); 
  };

  const canTakeAgain =
    currentUser.role === "FACULTY" || 
    (!taking &&
      attempts.find(
        (attempt: any) =>
          attempt.quiz === qid && attempt.user === currentUser._id
      )?.attempt < quiz.attempts);

  return (
    <div className="container">
      <h1>{quiz.title}</h1>
      {questions.length > 0 &&
        renderQuestionComponent(
          currentQuestionIndex,
          questions[currentQuestionIndex],
          answers.find(
            (ans) => ans.questionId === questions[currentQuestionIndex]._id
          )?.answer || ""
        )}
      <div className="mt-4">
        <button
          className="btn btn-secondary mx-3 float-start"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex <= 0} 
        >
          Previous
        </button>
        <button
          className="btn btn-danger mx-3 float-end"
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex >= questions.length - 1} 
        >
          Next
        </button>
      </div>
      <br />
      <div className="border border-dark m-5 row">
        <div className="col-12">
          {taking ? (
            <button
              className="btn btn-secondary mx-2 my-3 float-end "
              onClick={submit}
            >
              Submit
            </button>
          ) : canTakeAgain ? (
            <button
              className="btn btn-secondary mx-2 my-3 float-end "
              onClick={takeAgain}
            >
              Take Again
            </button>
          ) : null}
        </div>
      </div>
      {currentUser.role === "FACULTY" && (
        <div className="mt-4">
          <button
            className="btn btn-secondary w-100"
            onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`)}
          >
            <FaPencil className="mx-1" />
            Keep Editing This Quiz
          </button>
        </div>
      )}
      <br />
      <br />
      <div>
        <h3>Questions</h3>
        <ul className="list-group mx-5">
          {questions.map((question: any, index: number) => {
            const userAnswer = answers.find(
              (ans) => ans.questionId === question._id
            );
            const isCorrect = userAnswer?.isCorrect;
            const listItemClass = !taking
              ? isCorrect === true
                ? "text-success"
                : isCorrect === false
                ? "text-danger"
                : ""
              : currentQuestionIndex === index
              ? "text-primary"
              : "";

            return (
              <li
                key={question._id}
                className={`d-flex justify-content-between align-items-center ${listItemClass}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleQuestionTitleClick(index)}
              >
                {question.title}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
