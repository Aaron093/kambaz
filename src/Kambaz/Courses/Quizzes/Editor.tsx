import { Form, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import { TiCancel } from "react-icons/ti";
import InputGroup from 'react-bootstrap/InputGroup';
import { FaCalendarAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateQuiz, addQuiz } from "./reducer";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function QuizEditor() {
  const { cid, aid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((a:any) => a._id === aid);

  const [title, setTitle] = useState(quiz?.title || "");
  const [activeTab, setActiveTab] = useState("details");
  const [description, setDescription] = useState(quiz?.description || "");
  const [points, setPoints] = useState(quiz?.points || 100);
  const [dueDate, setDueDate] = useState(quiz?.dueDate || "");
  const [availableDate, setAvailableDate] = useState(quiz?.availableDate || "");
  const [availableUntil, setAvailableUntil] = useState(quiz?.availableUntil || "");
  const [quizType, setQuizType] = useState(quiz?.quizType || "Graded Quiz");
  const [assignmentGroup, setAssignmentGroup] = useState(quiz?.assignmentGroup || "1");
  const [shuffle, setShuffle] = useState(quiz?.shuffle || "Yes");
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 20);
  const [multipleAttempt, setMultipleAttempt] = useState(quiz?.multipleAttempt || "No");
  const [questionType, setQuestionType] = useState(quiz?.questionType || "Multiple Choice");



  const [gradeDisplay, setGradeDisplay] = useState(quiz?.gradeDisplay || "1");
  const [submission, setSubmission] = useState(quiz?.submission || "1");
  const [questions, setQuestions] = useState<any[]>([]);
  

  useEffect(() => {
    if (aid === "new") {
      setTitle("");
      setDescription("");
      setPoints(100);
      setDueDate("");
      setAvailableDate("");
      setAvailableUntil("");
      setAssignmentGroup("1");
      setQuizType("Graded Quiz");
      setShuffle("Yes");
      setTimeLimit("20")
      setMultipleAttempt("No");
      setQuestionType("Multiple Choice")
      setGradeDisplay("1");
      setSubmission("1");
    }
  }, [aid]);

  const handleSave = async () => {
    if (!cid) return;
    const quizData = {
      _id: aid === "new" ? uuidv4() : aid,
      title,
      description,
      points,
      dueDate: dueDate,
      availableDate: availableDate,
      availableUntil: availableUntil,
      gradeDisplay: gradeDisplay,
      quizType: quizType,
      Shuffle: shuffle,
      timeLimit: timeLimit,
      multipleAttempt: multipleAttempt,
      questionType: questionType,
      assignmentGroup: assignmentGroup,
      submission: submission
    };

    if (aid === "new") {
      const quiz = await coursesClient.createQuizForCourse(cid, quizData);
      dispatch(addQuiz(quiz));
    } else {
      await quizzesClient.updateQuiz(quizData);
      dispatch(updateQuiz(quizData));
    }

    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes`);
  };

  const handleShuffleChange = () => {
    setShuffle((prevShuffle: boolean) => !prevShuffle);
  };

  const handleAttemptChange = () => {
    setMultipleAttempt((prevAttempt: boolean) => !prevAttempt);
  };

  const handleTimeLimitChange = () => {
    setTimeLimit((prevTimeLimit: boolean) => !prevTimeLimit);
  };

  const addNewQuestion = () => {
    const newQuestion = {
      id: uuidv4(),
      type: "multiple_choice",
      points: 1,
      text: "",
      options: ["Option 1", "Option 2"],
      isEditing: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <div>
      <div style={{ width: '1100px' }}>
      <div style={{ marginLeft: "350px" }}>
        <span>Points {points}</span>
        <TiCancel style={{ marginLeft: "30px" }}/>
          Not Published 
        <Button style={{ marginLeft: "30px" }}>
          <BsThreeDotsVertical size={20} />
        </Button>
      </div>
      <hr className="m-3" style={{ width: "600px" }} />

      <ButtonGroup className="mb-3">
        <Button
          variant={activeTab === "details" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("details")}
        >
          Details
        </Button>
        <Button
          variant={activeTab === "questions" ? "primary" : "outline-primary"}
          onClick={() => setActiveTab("questions")}
        >
          Questions
        </Button>
      </ButtonGroup>


      {activeTab === "details" && (
        <div>
          <Form.Group className="mb-3 col-6" controlId="QuizName">
          <Form.Control
            type="text"
            placeholder="Please input Quiz Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          </Form.Group>
          <p>Quiz Instructions:</p>
          <div className="d-flex gap-3">
            <p>Edit</p>
            <p>View</p>
            <p>Insert</p>
            <p>Format</p>
            <p>Tools</p>
            <p>Table</p>
          </div>

          <Form.Group className="mb-3 col-6" controlId="QuizDescription">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder="Please write quiz description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row className="mb-3">
                <Col className="col-2">
                    <Form.Label className="col-form-label float-end">Quiz Type</Form.Label>
                </Col>
                <Col className="col-4">
                    <Form.Select value={quizType} 
                     onChange={(e) => setQuizType(e.target.value)}>
                        <option value="1">Graded Quiz</option>
                        <option value="2">Practice Quiz</option>
                        <option value="3">Graded Survey</option>
                        <option value="4">Ungraded Survey</option>
                    </Form.Select>
                </Col>
        </Row>

        <Row className="mb-3">
                <Col className="col-2">
                    <Form.Label className="col-form-label float-end">Assignment Group</Form.Label>
                </Col>
                <Col className="col-4">
                    <Form.Select value={assignmentGroup} 
                     onChange={(e) => setAssignmentGroup(e.target.value)}>
                        <option value="1">Assignment</option>
                        <option value="2">Quiz</option>
                        <option value="3">Exam</option>
                        <option value="4">Project</option>
                    </Form.Select>
                </Col>
        </Row>

        <p>Options</p>

          <Form.Check
            type="checkbox"
            id="shuffle-checkbox"
            label={`Shuffle Answers`}
            checked={shuffle}
            onChange={handleShuffleChange}
          />

          <Form.Check
            type="checkbox"
            id="timeLimit-checkbox"
            label={`Time Limit`}
            checked={timeLimit}
            onChange={handleTimeLimitChange}
          />

          <Form.Check
            type="checkbox"
            id="multipleAttempts-checkbox"
            label={`Allow Multiple Attempts`}
            checked={multipleAttempt}
            onChange={handleAttemptChange}
          />

        <Row className="mb-3">
          <Col className="col-2">
            <Form.Label className="col-form-label float-end">Assign</Form.Label>
          </Col>
          <Col className="col-4">
            <Card className="p-2">
              
              <h6 className="fw-bold mb-0">Due</h6>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="Quiz Due Date"
                />
                <InputGroup.Text><FaCalendarAlt className="fs-6" /></InputGroup.Text>
              </InputGroup>
              <Row className="p-0">
                <Col className="pe-0">
                <h6 className="fw-bold mb-0">Available from</h6>
                <InputGroup className="mb-3">
                  <Form.Control
                        type="text"
                        value={availableDate}
                        onChange={(e) => setAvailableDate(e.target.value)}
                        placeholder="Available from Date"
                      />
                    <InputGroup.Text><FaCalendarAlt className="fs-6"/></InputGroup.Text>
                </InputGroup>
                </Col>

                <Col className="ps-0">
                <h6 className="fw-bold mb-0">Until</h6>
                <InputGroup className="mb-3">
                  <Form.Control
                          type="text"
                          value={availableUntil}
                          onChange={(e) => setAvailableUntil(e.target.value)}
                          placeholder="Available Until Date"
                        />
                    <InputGroup.Text><FaCalendarAlt className="fs-6"/></InputGroup.Text>
                </InputGroup>
                </Col>
                </Row>
            </Card>
          </Col>
        </Row>

        <hr className="m-3" style={{ width: "600px" }} />
        
                <Row className="mb-3">
                  <Col className="col-4"></Col>
                  <Col className="col-2">
                    <Link
                      to={`/Kambaz/Courses/${cid}/Quizzes`}
                      className="btn btn-light text-decoration-none me-3"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Link>
                    <Link
                      to={`/Kambaz/Courses/${cid}/Quizzes`}
                      className="btn btn-danger text-decoration-none"
                      onClick={handleSave}
                    >
                      Save
                    </Link>
                  </Col>
                </Row>
        </div>
      )}

      {activeTab === "questions" && (
        <div>
          <button className="btn btn-secondary" onClick={addNewQuestion}>
            + New Question
          </button>

          <Row className="mb-3">
                  <Col className="col-4"></Col>
                  <Col className="col-2">
                    <Link
                      to={`/Kambaz/Courses/${cid}/Quizzes`}
                      className="btn btn-light text-decoration-none me-3"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Link>
                    <Link
                      to={`/Kambaz/Courses/${cid}/Quizzes`}
                      className="btn btn-danger text-decoration-none"
                      onClick={handleSave}
                    >
                      Save
                    </Link>
                  </Col>
            </Row>


            <Card>
            <Form.Group className="mb-3" controlId="QuizName">
              <div className="d-flex gap-2">
                <Form.Control
                type="text"
                placeholder="Input 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
                <Form.Control
                type="text"
                placeholder="Input 2"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                />
              </div>
            </Form.Group>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button>Preview</button>
              <button>Edit</button>
            </div>

            <Card>
            <h1>{title}</h1>
            <p style={{ textAlign: 'center' }}>Quiz Type: {quizType}</p>
            <p style={{ textAlign: 'center' }}>Points: {points}</p>
            <p style={{ textAlign: 'center' }}>Assignment Group: {assignmentGroup}</p>
            <p style={{ textAlign: 'center' }}>Shuffle Answers: {shuffle}</p>
            <p style={{ textAlign: 'center' }}>Time Limit: {timeLimit}</p>
            <p style={{ textAlign: 'center' }}>Multiple Attempts: {multipleAttempt}</p>
            <p style={{ textAlign: 'center' }}>View Responses: {quizType}</p>
            <p style={{ textAlign: 'center' }}>One Question at a Time: Yes</p>
            <p style={{ textAlign: 'center' }}>Require Respondus LockDown Browser: No</p>
            <p style={{ textAlign: 'center' }}>Require to View Quiz Results: No</p>
            <p style={{ textAlign: 'center' }}>WebCam Required: No</p>
            <p style={{ textAlign: 'center' }}>Lock Question After Answering:No</p>


            <div id="wd-tables">
        <table border={1} width="100%">
          <thead>
            <tr>
              <th>Due</th>
              <th>For</th>
              <th>Available From</th>
              <th>Until</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{dueDate}</td>
              <td>Everyone</td>
              <td>{availableDate}</td>
              <td>{availableUntil}</td>
              </tr>
          </tbody>
        </table>
      </div>
      </Card>


        </div>
      )}
      </div>
    </div>
  );
}