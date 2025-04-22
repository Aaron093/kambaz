import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { addQuiz, setQuizzes, updateQuiz } from "../reducer";
import { Link } from "react-router-dom";
import * as coursesClient from "../../client";
import * as quizzClient from "../client";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);
  const [error, setError] = useState<string | null>(null);

  const defaultQuizData = {
    _id: "New",
    title: "",
    description: "",
    points: 0,
    availableDate: "",
    dueDate: "",
    untilDate: "",
    accessCodeBool: false,
    accessCode: "",
    type: "Graded Quiz",
    multipleAttempts: false,
    allowedAttempts: 3,
    shuffleAnswers: true,
    timeLimit: 20,
    assignmentGroup: "Quizzes",
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    oneQuestionPerPage: true,
    showCorrectAnswers: false,
    questions: [],
  };

  const [quiz, setLocalQuiz] = useState(
    quizzes.find((q: any) => q._id === qid) || { ...defaultQuizData }
  );

  const handleSave = async (publish: boolean) => {
    try {
      if (!quiz || !cid) {
        setError("Cannot save quiz: Missing data");
        return;
      }
      
      const toSave = { ...quiz, publish: publish };
      if (!qid || qid === "New") {
        await coursesClient.createQuizzesForCourse(cid as string, toSave);
        dispatch(addQuiz({ ...toSave, course: cid }));
      } else {
        await quizzClient.updateQuiz(toSave);
        dispatch(updateQuiz({ ...toSave, _id: qid, course: cid }));
      }
      setError(null);
      navigate(`/Kambaz/Courses/${cid}/Quizzes`);
    } catch (err) {
      console.error("Failed to save quiz:", err);
      setError("Failed to save quiz. Please try again.");
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setLocalQuiz({ ...quiz, [field]: value });
  };

  const fetchQuiz = async () => {
    try {
      const quizData = await coursesClient.findQuizzesForCourse(cid as string);
      dispatch(setQuizzes(quizData));
      
      const currentQuiz = quizData.find((q: any) => q._id === qid);
      if (currentQuiz) {
        setLocalQuiz(currentQuiz);
        setError(null);
      } else {
        setLocalQuiz({ ...defaultQuizData });
        if (qid !== "New") {
          setError(`Quiz with ID ${qid} not found`);
        }
      }
    } catch (err) {
      console.error("Failed to fetch quiz:", err);
      setError("Failed to fetch quiz data. Please try again.");
    }
  };

  useEffect(() => {
    if (quizzes.length === 0) {
      fetchQuiz();
    } else {
      const foundQuiz = quizzes.find((q: any) => q._id === qid);
      if (foundQuiz) {
        setLocalQuiz(foundQuiz);
        setError(null);
      } else if (qid !== "New") {
        setError(`Quiz with ID ${qid} not found`);
      }
    }
  }, [qid, quizzes.length]);

  const handleTabNavigation = (path: string) => {
    try {
      if (qid === "New") {
        if (!quiz.title) {
          setError("Please enter a quiz title before proceeding");
          return;
        }
        dispatch(addQuiz({...quiz, course: cid}));
      }
      
      dispatch(updateQuiz(quiz));
      setError(null);
      navigate(path);
    } catch (err) {
      console.error("Navigation error:", err);
      setError("Failed to navigate. Please ensure all required fields are filled.");
    }
  };

  return (
    <div id="quiz-editor" className="container mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex mb-4">
        <div
          className="tab"
          onClick={() => handleTabNavigation(`/Kambaz/Courses/${cid}/Quizzes/${qid ?? "New"}/Editor/Details`)}
          style={{
            cursor: "pointer",
            padding: "10px",
            fontWeight: "bold",
            borderBottom: "2px solid black",
          }}
        >
          Details
        </div>
        <div
          className="tab"
          onClick={() => handleTabNavigation(`/Kambaz/Courses/${cid}/Quizzes/${qid ?? "New"}/Editor/Questions`)}
          style={{
            cursor: "pointer",
            padding: "10px",
            fontWeight: "normal",
            borderBottom: "1px solid lightgray",
          }}
        >
          Questions
        </div>
      </div>

      <hr />

      {/* Details Tab Content */}
      <div className="mb-4">
        <input
          type="text"
          id="quiz-title"
          className="form-control"
          value={quiz?.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="quiz-description" className="form-label fw-bold">
          Quiz Instructions
        </label>
        <textarea
          id="quiz-description"
          className="form-control"
          rows={5}
          value={quiz.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <table className="table table-borderless w-100">
        <tbody>
          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-points">Points</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="number"
                    id="quiz-points"
                    className="form-control"
                    value={quiz.points}
                    onChange={(e) =>
                      handleChange("points", Number(e.target.value))
                    }
                    disabled={true}
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-type">Quiz Type</label>
                </div>
                <div className="col-md-10">
                  <select
                    id="quiz-type"
                    className="form-control"
                    value={quiz.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                  </select>
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-assignment-group">
                    Assignment Group
                  </label>
                </div>
                <div className="col-md-10">
                  <select
                    id="quiz-assignment-group"
                    className="form-control"
                    value={quiz.assignmentGroup}
                    onChange={(e) =>
                      handleChange("assignmentGroup", e.target.value)
                    }
                  >
                    <option value="Quizzes">Quizzes</option>
                    <option value="Exams">Exams</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Project">Project</option>
                  </select>
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-time-limit">Time Limit (minutes)</label>
                </div>
                <div className="col-md-10">
                  <input
                    id="quiz-time-limit"
                    min={1}
                    type="number"
                    className="form-control"
                    defaultValue={quiz.timeLimit}
                    onChange={(e) =>
                      handleChange("timeLimit", parseInt(e.target.value))
                    }
                  ></input>
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-shuffle-answers">Shuffle Answers</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="checkbox"
                    id="quiz-shuffle-answers"
                    className="form-check-input ms-2"
                    checked={quiz.shuffleAnswers}
                    onChange={(e) =>
                      handleChange("shuffleAnswers", e.target.checked)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-multiple-attempts">
                    Multiple Attempts
                  </label>
                </div>
                <div className="col-md-10">
                  <input
                    id="quiz-multiple-attempts"
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={quiz.multipleAttempts}
                    onChange={(e) =>
                      handleChange("multipleAttempts", e.target.checked)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          {quiz.multipleAttempts && (
            <tr className="mb-3">
              <td>
                <div className="row align-items-center">
                  <div className="col-md-2 text-end">
                    <label htmlFor="quiz-allowed-attempts">
                      Attempts allowed
                    </label>
                  </div>
                  <div className="col-md-10">
                    <input
                      id="quiz-allowed-attempts"
                      type="number"
                      min={1}
                      className="form-control ms-2"
                      value={quiz.allowedAttempts}
                      onChange={(e) =>
                        handleChange(
                          "allowedAttempts",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </td>
            </tr>
          )}

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-show-correct-answers">
                    Show Correct Answers
                  </label>
                </div>
                <div className="col-md-10">
                  <input
                    id="quiz-show-correct-answers"
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={quiz.showCorrectAnswers}
                    onChange={(e) =>
                      handleChange("showCorrectAnswers", e.target.checked)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-access-code-required">
                    Access Code Required
                  </label>
                </div>
                <div className="col-md-10">
                  <input
                    type="checkbox"
                    id="quiz-access-code-required"
                    className="form-check-input ms-2"
                    checked={quiz.accessCodeBool}
                    onChange={(e) =>
                      handleChange("accessCodeBool", e.target.checked)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          {quiz.accessCodeBool && (
            <tr className="mb-3">
              <td>
                <div className="row align-items-center">
                  <div className="col-md-2 text-end">
                    <label htmlFor="quiz-access-code">Access Code</label>
                  </div>
                  <div className="col-md-10">
                    <input
                      type="text"
                      id="quiz-access-code"
                      className="form-control ms-2"
                      value={quiz.accessCode}
                      onChange={(e) =>
                        handleChange("accessCode", e.target.value)
                      }
                    />
                  </div>
                </div>
              </td>
            </tr>
          )}

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-one-question-per-page">
                    One Question at a Time
                  </label>
                </div>
                <div className="col-md-10">
                  <input
                    id="quiz-one-question-per-page"
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={quiz.oneQuestionPerPage}
                    onChange={(e) =>
                      handleChange("oneQuestionPerPage", e.target.checked)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-webcam-required">Webcam Required</label>
                </div>
                <div className="col-md-10">
                  <input
                    id="quiz-webcam-required"
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={quiz.webcamRequired}
                    onChange={(e) =>
                      handleChange("webcamRequired", e.target.checked)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-lock-questions">
                    {" "}
                    Lock Questions After Answering
                  </label>
                </div>
                <div className="col-md-10">
                  <input
                    id="quiz-lock-questions"
                    type="checkbox"
                    className="form-check-input ms-2"
                    checked={quiz.lockQuestionsAfterAnswering}
                    onChange={(e) =>
                      handleChange(
                        "lockQuestionsAfterAnswering",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-available-date">Available From</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="date"
                    id="quiz-available-date"
                    className="form-control"
                    value={(quiz.availableDate ?? "").split("T")[0]}
                    onChange={(e) =>
                      handleChange("availableDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-due-date">Due Date</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="date"
                    id="quiz-due-date"
                    className="form-control"
                    value={(quiz.dueDate ?? "").split("T")[0]}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                  />
                </div>
              </div>
            </td>
          </tr>

          <tr className="mb-3">
            <td>
              <div className="row align-items-center">
                <div className="col-md-2 text-end">
                  <label htmlFor="quiz-until-date">Until Date</label>
                </div>
                <div className="col-md-10">
                  <input
                    type="date"
                    id="quiz-until-date"
                    className="form-control"
                    value={(quiz.untilDate ?? "").split("T")[0]}
                    onChange={(e) => handleChange("untilDate", e.target.value)}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Save and Cancel buttons */}
      <div className="row g-3 mt-2">
        <hr />
        <div className="d-flex justify-content-end">
          <Link
            to={`/Kambaz/Courses/${cid}/Quizzes`}
            className="btn btn-secondary me-3"
          >
            Cancel
          </Link>
          <button
            onClick={() => handleSave(quiz.publish ?? false)}
            className="btn btn-danger me-3"
          >
            Save
          </button>
          <button onClick={() => handleSave(true)} className="btn btn-danger">
            Save and Publish
          </button>
        </div>
      </div>
    </div>
  );
}
