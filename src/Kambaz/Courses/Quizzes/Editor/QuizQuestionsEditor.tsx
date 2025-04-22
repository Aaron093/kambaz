import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import * as quizClient from "../client";
import Question from "../Questions/Question";
import { updateQuiz } from "../reducer";
import { setQuestions, addQuestion, deleteQuestion, updateQuestion } from "../Questions/reducer";
import { QuizQuestion, Quiz } from "../client";
import FillInTheBlankContent from "./FillInTheBlankContent";
import MultipleChoiceContent from "./MultipleChoiceContent";
import TrueFalseContent from "./TrueFalseContent";

interface RootState {
  quizzesReducer: {
    quizzes: Quiz[];
  };
  questionsReducer: {
    questions: QuizQuestion[];
  };
}

export declare type TrueFalseQuestionContent = {
  text: string;
  answer: boolean;
  point: number;
};

export declare type TrueFalseQuestion = {
  _id: number;
  type: "TRUEFALSE";
  content: TrueFalseQuestionContent;
};

export declare type MultipleChoiceQuestionContent = {
  text: string;
  choices: Array<string>;
  answer: string;
  point: number;
};

export declare type MultipleChoiceQuestion = {
  _id: number;
  type: "MULTIPLECHOICE";
  content: MultipleChoiceQuestionContent;
};

export declare type FillInTheBlankQuestionContent = {
  text: string;
  blanks: string[];
  answer: string[][];
  point: number;
};

export declare type FillInTheBlankQuestion = {
  _id: number;
  type: "FILLINTHEBLANK";
  content: FillInTheBlankQuestionContent;
};

export declare type QuizQuestionType =
  | TrueFalseQuestion
  | MultipleChoiceQuestion
  | FillInTheBlankQuestion;

export declare type QuizQuestionContent =
  | TrueFalseQuestionContent
  | MultipleChoiceQuestionContent
  | FillInTheBlankQuestionContent;

export default function Questions() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const quiz = useSelector((state: RootState) =>
    state.quizzesReducer.quizzes.find((q) => q._id === qid)
  );
  
  const questions = useSelector((state: RootState) => state.questionsReducer.questions);

  const [points, setPoints] = useState(0);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questionPoint, setQuestionPoint] = useState(10);
  const [editingQuestionNumber, setEditingQuestionNumber] = useState<number | null>(null);

  const tfDefault = { text: "", answer: true, point: 0 };
  const mcDefault = { text: "", choices: [], answer: "", point: 0 };
  const fitbDefault = { text: "", blanks: [], answer: [], point: 0 };

  const [tfContent, setTfContent] = useState<TrueFalseQuestionContent>({
    ...tfDefault,
  });
  const [mcContent, setMcContent] = useState<MultipleChoiceQuestionContent>({
    ...mcDefault,
  });
  const [fitbContent, setFitbContent] = useState<FillInTheBlankQuestionContent>(
    { ...fitbDefault }
  );

  const resetQuestions = () => {
    setTfContent({ ...tfDefault });
    setMcContent({ ...mcDefault });
    setFitbContent({ ...fitbDefault });
  };

  useEffect(() => {
    const totalPoints = questions.reduce((sum: number, q: QuizQuestion) => {
      if (!q || !q.content || typeof q.content.point !== 'number') {
        return sum;
      }
      return sum + q.content.point;
    }, 0);
    setPoints(totalPoints);
    if (questions.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [questions]);

  useEffect(() => {
    const fetchData = async () => {
      if (qid && qid !== "New") {
        try {
          setIsLoading(true);
          setErrorMessage(null);
          
          const fetchedQuiz = await quizClient.findQuizById(qid);
          if (fetchedQuiz) {
            dispatch(updateQuiz(fetchedQuiz));
          }
          
          const fetchedQuestions = await quizClient.findQuestionsForQuiz(qid);
          if (fetchedQuestions) {
            dispatch(setQuestions(fetchedQuestions));
            setPoints(fetchedQuestions.reduce((sum: number, q: QuizQuestion) => sum + q.content.point, 0));
          }
          
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setErrorMessage("Error fetching quiz data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchData();
  }, [qid, dispatch]);

  const handleAddQuestion = () => {
    setEditingQuestionNumber(null);
    setQuestionPoint(10);
    setSelectedType(null);
    resetQuestions();
    setShowTypeModal(true);
  };

  const handleDelete = async (question: QuizQuestion) => {
    if (!question) {
      setErrorMessage("Invalid question data");
      return;
    }

    try {
      const questionId = typeof question._id === 'string' ? question._id : question._id?.toString();
      
      if (!questionId) {
        console.error("Question ID is missing:", question);
        setErrorMessage("Failed to delete question: Missing ID");
        return;
      }

      await quizClient.deleteQuestion(questionId);
      dispatch(deleteQuestion(question._id));
      
      if (qid) {
        const updatedQuestions = await quizClient.findQuestionsForQuiz(qid);
        dispatch(setQuestions(updatedQuestions));
      }
      
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error("Error deleting question:", error);
      setErrorMessage("Failed to delete question. Please try again.");
    }
  };

  const handleEdit = (questionNumber: number) => {
    const thisQuestion = questions[questionNumber];
    if (!thisQuestion || !thisQuestion.content) {
      setErrorMessage("Invalid question data");
      return;
    }

    setEditingQuestionNumber(questionNumber);
    setQuestionPoint(thisQuestion.content.point || 0);
    setSelectedType(thisQuestion.type);

    switch (thisQuestion.type) {
      case "TRUEFALSE":
        setTfContent({
          text: thisQuestion.content.text || "",
          answer: Boolean(thisQuestion.content.answer),
          point: Number(thisQuestion.content.point) || 0
        });
        break;
      case "MULTIPLECHOICE":
        setMcContent({
          text: thisQuestion.content.text || "",
          choices: Array.isArray(thisQuestion.content.choices) ? thisQuestion.content.choices : [],
          answer: String(thisQuestion.content.answer || ""),
          point: Number(thisQuestion.content.point) || 0
        });
        break;
      case "FILLINTHEBLANK":
        setFitbContent({
          text: thisQuestion.content.text || "",
          blanks: Array.isArray(thisQuestion.content.blanks) ? thisQuestion.content.blanks : [],
          answer: Array.isArray(thisQuestion.content.answer) ? thisQuestion.content.answer : [[]],
          point: Number(thisQuestion.content.point) || 0
        });
        break;
    }
    setShowTypeModal(true);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowTypeModal(false);
    setShowConfigModal(true);
  };

  const addNewQuestion = async () => {
    if (!selectedType || !qid) {
      setErrorMessage("Invalid question type or quiz ID");
      return;
    }

    const questionData = {
      quiz: qid,
      type: selectedType,
      content: selectedType === "TRUEFALSE" 
        ? { ...tfContent, point: questionPoint }
        : selectedType === "MULTIPLECHOICE"
        ? { ...mcContent, point: questionPoint }
        : { ...fitbContent, point: questionPoint }
    };

    try {
      if (editingQuestionNumber !== null) {
        const existingQuestion = questions[editingQuestionNumber];
        if (!existingQuestion || !existingQuestion._id) {
          setErrorMessage("Invalid question data for update");
          return;
        }

        const questionId = existingQuestion._id?.toString();
        if (!questionId) {
          setErrorMessage("Invalid question ID");
          return;
        }

        const updatedQuestion = await quizClient.updateQuestion(
          questionId,
          questionData
        );
        dispatch(updateQuestion(updatedQuestion));
      } else {
        const createdQuestion = await quizClient.createQuestion(qid, questionData);
        dispatch(addQuestion(createdQuestion));
      }
      
      const updatedQuestions = await quizClient.findQuestionsForQuiz(qid);
      dispatch(setQuestions(updatedQuestions));
      
      resetQuestions();
      setShowConfigModal(false);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error("Error saving question:", error);
      setErrorMessage("Failed to save question. Please try again.");
    }
  };

  const saveQuizQuestions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      if (!quiz) {
        setErrorMessage("Quiz not found");
        return;
      }
      
      const updatedQuiz = {
        ...quiz,
        points: points
      };
      
      const savedQuiz = await quizClient.updateQuiz(updatedQuiz);
      dispatch(updateQuiz(savedQuiz));
      setHasUnsavedChanges(false);
    
      setTimeout(() => {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor/Details`);
      }, 100);
      
    } catch (err) {
      console.error("Save failed:", err);
      setErrorMessage("Failed to save quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor/Details`);
      }
    } else {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor/Details`);
    }
  };

  if (isLoading) {
    return <div className="alert alert-info mt-4">Loading quiz data...</div>;
  }

  return (
    <div className="container mt-4">
      {errorMessage && (
        <div className="alert alert-danger mb-3">
          {errorMessage}
          <button 
            className="btn btn-sm btn-outline-danger ms-3" 
            onClick={() => setErrorMessage(null)}
          >
            Close
          </button>
        </div>
      )}
      
      <h4>Total Points: {points}</h4>

      <div>
        {questions.length === 0 ? (
          <p>No questions added yet. Click "New Question" to add one.</p>
        ) : (
          <div>
            {questions.map((q: QuizQuestion, n: number) => {
              if (!q || !q.content) {
                return null;
              }
              
              return (
                <div key={n}>
                  <Question
                    question={q}
                    questionNumber={n + 1}
                    point={q.content.point || 0}
                    isDisabled={true}
                  />
                  <div
                    style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(n)}
                    >
                      Edit Question {n + 1}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(q)}
                    >
                      Delete Question {n + 1}
                    </button>
                  </div>
                  <br />
                  <br />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button onClick={handleAddQuestion} className="btn btn-primary">
          New Question
        </button>
      </div>

      <hr className="my-4" />

      <div className="d-flex justify-content-center mt-2">
        <button onClick={handleCancel} className="btn btn-secondary me-3">
          Cancel
        </button>
        <button onClick={saveQuizQuestions} className="btn btn-danger">
          Save
        </button>
      </div>

      <Modal show={showTypeModal} onHide={() => setShowTypeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Question Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>
            pts:
            <input
              type="number"
              min={0}
              value={questionPoint}
              onChange={(e) => setQuestionPoint(parseInt(e.target.value))}
            />
          </label>
          <br></br>
          <br></br>
          <p>Choose a Question type:</p>
          <select
            className="form-control"
            onChange={(e) => setSelectedType(e.target.value)}
            defaultValue={selectedType || ""}
            aria-label="Question Type"
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="MULTIPLECHOICE">Multiple Choice</option>
            <option value="TRUEFALSE">True/False</option>
            <option value="FILLINTHEBLANK">Fill in the Blank</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTypeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleTypeSelect(selectedType!)}
          >
            Next
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfigModal} onHide={() => setShowConfigModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Configure{" "}
            {
              {
                MULTIPLECHOICE: "Multiple Choice",
                TRUEFALSE: "True/False",
                FILLINTHEBLANK: "Fill in the Blank",
              }[selectedType || ""]
            }{" "}
            Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType === "MULTIPLECHOICE" && (
            <MultipleChoiceContent
              content={mcContent}
              setContent={setMcContent}
            />
          )}
          {selectedType === "TRUEFALSE" && (
            <TrueFalseContent content={tfContent} setContent={setTfContent} />
          )}
          {selectedType === "FILLINTHEBLANK" && (
            <FillInTheBlankContent
              content={fitbContent}
              setContent={setFitbContent}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfigModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addNewQuestion}>
            Save Question
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
