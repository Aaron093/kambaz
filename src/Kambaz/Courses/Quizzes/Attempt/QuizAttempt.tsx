import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import * as quizClient from "../client";
import * as answerClient from "./client";
import { setQuestions } from "../Questions/reducer";
import { FaHistory } from "react-icons/fa";
import { addAttempt, updateAttempt } from "./reducer";
import { Badge, Button, Card, Col, Container, ListGroup, Row, Table } from "react-bootstrap";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

export default function QuizAttempt() {
  const { cid, qid } = useParams();
  const [quiz, setQuiz] = useState<any>({});
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { questions } = useSelector((state: any) => state.questionsReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { attempts } = useSelector((state: any) => state.attemptsReducer);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [attemptHistory, setAttemptHistory] = useState<any[]>([]);
  const [remainingAttempts, setRemainingAttempts] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchQuiz = async () => {
    if (qid) {
      const fetchedQuiz = await quizClient.findQuizById(qid);
      setQuiz(fetchedQuiz);
      return fetchedQuiz;
    }
    return null;
  };

  const fetchQuestions = async () => {
    if (qid) {
      const questions = await quizClient.findQuestionsForQuiz(qid);
      dispatch(setQuestions(questions));
    }
  };

  const fetchUserAttempts = async () => {
    if (currentUser && qid) {
      const userAttempts = await answerClient.fetchAttemptForUser(currentUser._id);
      const quizAttempts = userAttempts.filter((attempt: any) => 
        attempt.quiz === qid && attempt.user === currentUser._id
      );
      setAttemptHistory(quizAttempts);
      return quizAttempts;
    }
    return [];
  };

  const calculateRemainingAttempts = (fetchedQuiz: any, userAttempts: any[]) => {
    if (!fetchedQuiz) return 0;
    
    if (!fetchedQuiz.multiple_attempts) {
      return userAttempts.length === 0 ? 1 : 0;
    }
    
    const maxAttempts = fetchedQuiz.attempts || 1;
    const usedAttempts = userAttempts.length;
    return Math.max(0, maxAttempts - usedAttempts);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answer: any
  ) => {
    setAnswers((prevAnswers) => {
      const question = questions[questionIndex];
      if (!question) return prevAnswers;

      const questionId = question._id;
      let isCorrect = false;
      if (question.type === "Multiple Choice" || question.type === "MULTIPLECHOICE") {
        isCorrect = question.correctAnswer === answer || question.content?.answer === answer;
      } else if (question.type === "TRUEFALSE" || question.type === "True/False") {
        const booleanAnswer = answer === "true" ? true : false;
        isCorrect = (question.content?.answer === booleanAnswer);
      } else if (question.type === "Fill in the Blank" || question.type === "FILLINTHEBLANK") {
        if (Array.isArray(answer) && Array.isArray(question.content?.answer)) {
          isCorrect = answer.every((ans, index) => {
            const possibleAnswers = question.content.answer[index];
            return Array.isArray(possibleAnswers) && 
              possibleAnswers.some(correctAns => 
                String(ans).toLowerCase() === String(correctAns).toLowerCase()
              );
          });
        } else if (typeof answer === 'string' && question.content?.answer) {
          if (Array.isArray(question.content.answer[0])) {
            isCorrect = question.content.answer[0].some(
              (correctAns: string) => String(answer).toLowerCase() === String(correctAns).toLowerCase()
            );
          } else {
            const expectedAnswer = question.answer || question.content?.answer;
            isCorrect = String(expectedAnswer).toLowerCase() === String(answer).toLowerCase();
          }
        }
      }

      const points = isCorrect ? (question.content?.point || 0) : 0;

      const existing = prevAnswers.find((ans) => ans.questionId === questionId);
      if (existing) {
        return prevAnswers.map((ans) =>
          ans.questionId === questionId
            ? { ...ans, answer, isCorrect, points }
            : ans
        );
      } else {
        return [...prevAnswers, { 
          questionId, 
          answer, 
          isCorrect, 
          points
        }];
      }
    });
  };

  const submitQuiz = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const userQuizAttempts = attemptHistory.filter(a => a.quiz === qid);
      const attemptNumber = userQuizAttempts.length + 1;
      
      const attemptData = {
        quiz: qid,
        user: currentUser._id,
        answers: answers,
        attempt: attemptNumber,
        submittedAt: new Date().toISOString(),
        score: calculateScore(answers)
      };

      const result = await answerClient.createAttempt(
        attemptData,
        qid as string,
        currentUser._id
      );
      

      dispatch(addAttempt(result));
      
      setAttemptHistory([...attemptHistory, result]);
      setShowResults(true);
      setRemainingAttempts(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScore = (answersList: any[]) => {
    return answersList.reduce((total, answer) => {
      return total + (answer.isCorrect ? (answer.points || 0) : 0);
    }, 0);
  };

  const getTotalPoints = () => {
    return questions.reduce((total: number, q: any) => {
      return total + (q.content?.point || 0);
    }, 0);
  };

  const startNewAttempt = () => {
    setAnswers([]);
    setShowResults(false);
    setShowHistory(false);
    setCurrentQuestionIndex(0);
  };

  const viewHistory = () => {
    setShowResults(false);
    setShowHistory(true);
  };

  const renderQuestionComponent = (
    questionIndex: number,
    question: any
  ) => {
    if (!question) return null;
    
    const currentAnswer = answers.find(a => a.questionId === question._id)?.answer;
    
    const questionForComponent = {
      _id: question._id,
      questionIndex,
      points: question.content?.point || 0,
      title: question.content?.text || "",
      question: question.content?.text || "",
      type: question.type,
      content: question.content || {},
      choices: question.content?.choices || [],
      userAnswer: currentAnswer,
      answer: question.content?.answer || question.answer || ""
    };
    
    if (question.type === "TRUEFALSE" || question.type === "True/False") {
      const isTrueSelected = currentAnswer === true || currentAnswer === "true";
      const isFalseSelected = currentAnswer === false || currentAnswer === "false";
      
      return (
        <div className="card mb-3">
          <div className="card-header">
            <span>True/False Question</span>
            <span className="float-end badge bg-primary">{questionForComponent.points} points</span>
          </div>
          <div className="card-body">
            <h5 className="card-title">{questionForComponent.title}</h5>
            <div className="mt-3">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${questionForComponent._id}`}
                  id={`true-${questionForComponent._id}`}
                  value="true"
                  checked={isTrueSelected}
                  onChange={() => handleAnswerChange(questionIndex, "true")}
                  disabled={showResults || showHistory}
                />
                <label className="form-check-label" htmlFor={`true-${questionForComponent._id}`}>
                  True
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${questionForComponent._id}`}
                  id={`false-${questionForComponent._id}`}
                  value="false"
                  checked={isFalseSelected}
                  onChange={() => handleAnswerChange(questionIndex, "false")}
                  disabled={showResults || showHistory}
                />
                <label className="form-check-label" htmlFor={`false-${questionForComponent._id}`}>
                  False
                </label>
              </div>
              {showResults && (
                <div className={`mt-2 text-${answers.find(a => a.questionId === question._id)?.isCorrect ? 'success' : 'danger'}`}>
                  {answers.find(a => a.questionId === question._id)?.isCorrect ? 
                    <span><BsCheckCircleFill className="me-1" /> Correct</span> : 
                    <span><BsXCircleFill className="me-1" /> Incorrect</span>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else if (question.type === "Fill in the Blank" || question.type === "FILLINTHEBLANK") {
      const blanks = question.content?.blanks || [];
      
      const handleBlankChange = (index: number, value: string) => {
        let newAnswers;
        if (Array.isArray(currentAnswer)) {
          newAnswers = [...currentAnswer];
          newAnswers[index] = value;
        } else {
          newAnswers = new Array(blanks.length).fill("");
          newAnswers[index] = value;
        }
        handleAnswerChange(questionIndex, newAnswers);
      };
      
      if (blanks.length > 0) {
        return (
          <div className="card mb-3">
            <div className="card-header">
              <span>Fill in the Blank</span>
              <span className="float-end badge bg-primary">{questionForComponent.points} points</span>
            </div>
            <div className="card-body">
              <h5 className="card-title">{questionForComponent.title}</h5>
              <div className="mt-3">
                {blanks.map((prompt, idx) => (
                  <div key={idx} className="mb-3">
                    <label className="form-label">{prompt}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Enter answer for ${prompt}...`}
                      value={Array.isArray(currentAnswer) ? (currentAnswer[idx] || "") : ""}
                      onChange={(e) => handleBlankChange(idx, e.target.value)}
                      disabled={showResults || showHistory}
                    />
                  </div>
                ))}
                {showResults && (
                  <div className={`mt-2 text-${answers.find(a => a.questionId === question._id)?.isCorrect ? 'success' : 'danger'}`}>
                    {answers.find(a => a.questionId === question._id)?.isCorrect ? 
                      <span><BsCheckCircleFill className="me-1" /> Correct</span> : 
                      <span><BsXCircleFill className="me-1" /> Incorrect</span>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="card mb-3">
            <div className="card-header">
              <span>Fill in the Blank</span>
              <span className="float-end badge bg-primary">{questionForComponent.points} points</span>
            </div>
            <div className="card-body">
              <h5 className="card-title">{questionForComponent.title}</h5>
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your answer..."
                  value={typeof currentAnswer === 'string' ? currentAnswer : ""}
                  onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                  disabled={showResults || showHistory}
                />
                {showResults && (
                  <div className={`mt-2 text-${answers.find(a => a.questionId === question._id)?.isCorrect ? 'success' : 'danger'}`}>
                    {answers.find(a => a.questionId === question._id)?.isCorrect ? 
                      <span><BsCheckCircleFill className="me-1" /> Correct</span> : 
                      <span><BsXCircleFill className="me-1" /> Incorrect</span>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    } else if (question.type === "Multiple Choice" || question.type === "MULTIPLECHOICE") {
      const choices = question.content?.choices || [];
      
      return (
        <div className="card mb-3">
          <div className="card-header">
            <span>Multiple Choice</span>
            <span className="float-end badge bg-primary">{questionForComponent.points} points</span>
          </div>
          <div className="card-body">
            <h5 className="card-title">{questionForComponent.title}</h5>
            <div className="mt-3">
              {choices.map((choice: string, idx: number) => (
                <div key={idx} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name={`question-${questionForComponent._id}`}
                    id={`choice-${questionForComponent._id}-${idx}`}
                    value={choice}
                    checked={currentAnswer === choice}
                    onChange={() => handleAnswerChange(questionIndex, choice)}
                    disabled={showResults || showHistory}
                  />
                  <label className="form-check-label" htmlFor={`choice-${questionForComponent._id}-${idx}`}>
                    {choice}
                  </label>
                </div>
              ))}
              {showResults && (
                <div className={`mt-2 text-${answers.find(a => a.questionId === question._id)?.isCorrect ? 'success' : 'danger'}`}>
                  {answers.find(a => a.questionId === question._id)?.isCorrect ? 
                    <span><BsCheckCircleFill className="me-1" /> Correct</span> : 
                    <span><BsXCircleFill className="me-1" /> Incorrect</span>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="alert alert-warning">
          Unknown question type: {question.type}
        </div>
      );
    }
  };

  useEffect(() => {
    const initializeComponent = async () => {
      const fetchedQuiz = await fetchQuiz();
      await fetchQuestions();
      const userAttempts = await fetchUserAttempts();
      
      if (fetchedQuiz) {
        const remaining = calculateRemainingAttempts(fetchedQuiz, userAttempts);
        setRemainingAttempts(remaining);
      
        if (userAttempts.length > 0 && remaining === 0) {
          const lastAttempt = userAttempts[userAttempts.length - 1];
          setAnswers(lastAttempt.answers || []);
          setShowResults(true);
        }
      }
    };
    
    initializeComponent();
  }, [qid, currentUser._id]);

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
  
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const renderQuestionsList = () => {
    return (
      <ListGroup horizontal className="mb-3 flex-wrap">
        {questions.map((q: any, index: number) => {
          const answered = answers.some(a => a.questionId === q._id);
          const correct = answers.some(a => a.questionId === q._id && a.isCorrect);
          
          let variant = "light";
          if (showResults || showHistory) {
            variant = correct ? "success" : answered ? "danger" : "light";
          } else {
            variant = answered ? "info" : "light";
          }
          
          return (
            <ListGroup.Item 
              key={q._id}
              action
              variant={variant}
              active={index === currentQuestionIndex}
              onClick={() => jumpToQuestion(index)}
              className="mb-2 me-2"
            >
              Question {index + 1}
              {(showResults || showHistory) && (
                correct ? <BsCheckCircleFill className="ms-2 text-success" /> : 
                answered ? <BsXCircleFill className="ms-2 text-danger" /> : null
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    );
  };

  const renderResults = () => {
    const totalPoints = getTotalPoints();
    const score = calculateScore(answers);
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <Card className="mb-4">
        <Card.Header as="h5">Quiz Results</Card.Header>
        <Card.Body>
          <Card.Title>
            Score: {score} / {totalPoints} ({percentage}%)
          </Card.Title>
          <Table striped bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question: any, index: number) => {
                const answer = answers.find(a => a.questionId === question._id);
                return (
                  <tr key={question._id}>
                    <td>{index + 1}</td>
                    <td>{question.content?.text}</td>
                    <td>{answer?.answer || "Not answered"}</td>
                    <td>
                      {answer?.isCorrect ? 
                        <BsCheckCircleFill className="text-success" /> : 
                        <BsXCircleFill className="text-danger" />
                      }
                    </td>
                    <td>{answer?.isCorrect ? answer.points : 0} / {question.content?.point}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-between mt-3">
            {remainingAttempts > 0 && (
              <Button variant="primary" onClick={startNewAttempt}>
                Take Quiz Again ({remainingAttempts} attempts remaining)
              </Button>
            )}
            <Button variant="info" onClick={viewHistory}>
              <FaHistory className="me-2" />
              View Attempt History
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderAttemptHistory = () => {
    return (
      <Card className="mb-4">
        <Card.Header as="h5">Attempt History</Card.Header>
        <Card.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Attempt #</th>
                <th>Date</th>
                <th>Score</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attemptHistory.map((attempt: any, index: number) => {
                const score = calculateScore(attempt.answers || []);
                const totalPoints = getTotalPoints();
                const percentage = Math.round((score / totalPoints) * 100);
                
                return (
                  <tr key={attempt._id || index}>
                    <td>{attempt.attempt || index + 1}</td>
                    <td>{new Date(attempt.submittedAt).toLocaleString()}</td>
                    <td>{score} / {totalPoints}</td>
                    <td>{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          
          <div className="d-flex justify-content-between mt-3">
            {remainingAttempts > 0 && (
              <Button variant="primary" onClick={startNewAttempt}>
                Take Quiz Again ({remainingAttempts} attempts remaining)
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowHistory(false)}>
              Back to Results
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  return (
    <Container className="mt-4">
      <h2>{quiz.title}</h2>
      
      {quiz.desc && <p>{quiz.desc}</p>}
      
      <div className="d-flex justify-content-between mb-3">
        <div>
          <Badge bg="info">Points: {quiz.points}</Badge>
          {quiz.due && (
            <Badge bg="warning" className="ms-2">Due: {quiz.due}</Badge>
          )}
        </div>
        
        {quiz.multiple_attempts && (
          <Badge bg="primary">
            Attempts: {attemptHistory.length} / {quiz.attempts || "Unlimited"}
          </Badge>
        )}
      </div>

      {showHistory ? (
        renderAttemptHistory()
      ) : showResults ? (
        renderResults()
      ) : (
        <div>
          {renderQuestionsList()}
          
          <Card className="mb-4">
            <Card.Header>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Card.Header>
            <Card.Body>
              {questions.length > 0 && renderQuestionComponent(
                currentQuestionIndex,
                questions[currentQuestionIndex]
              )}
            </Card.Body>
          </Card>
          
          <Row>
            <Col>
              <Button 
                variant="secondary" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex <= 0}
              >
                Previous
              </Button>
            </Col>
            <Col className="d-flex justify-content-center">
              {currentQuestionIndex === questions.length - 1 && (
                <Button 
                  variant="primary" 
                  onClick={submitQuiz}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              )}
            </Col>
            <Col className="text-end">
              <Button 
                variant="secondary" 
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex >= questions.length - 1}
              >
                Next
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
} 