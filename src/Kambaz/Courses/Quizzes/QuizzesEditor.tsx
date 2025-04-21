import { Form, Row, Col, Button } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import QuizDetailNavigation from "./QuizDetailNavigation";
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import { FaCalendarAlt } from "react-icons/fa";
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { useDispatch, useSelector } from "react-redux";
import { updateQuiz, addQuiz } from "./reducer";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { TiCancel } from "react-icons/ti";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((a:any) => a._id === qid);

  const [title, setTitle] = useState(quiz?.title || "");
  const [editorState, setEditorState] = useState(() => {
    try {
      if (quiz?.description) {
        return EditorState.createWithContent(convertFromRaw(JSON.parse(quiz.description)));
      }
    } catch (e) {
      console.error('Error parsing description', e);
    }
    return EditorState.createEmpty();
  });
  const [points, setPoints] = useState(quiz?.points || 100);
  const [quizType, setQuizType] = useState(quiz?.quizType || "Graded Quiz");
  const [dueDate, setDueDate] = useState(quiz?.dueDate || "");
  const [availableDate, setAvailableDate] = useState(quiz?.availableDate || "");
  const [availableUntil, setAvailableUntil] = useState(quiz?.availableUntil || "");
  const [quizGroup, setQuizGroup] = useState(quiz?.quizGroup || "quiz");
  const [shuffle, setShuffle] = useState(quiz?.shuffle || "Yes");
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 20);
  const [multipleAttempt, setMultipleAttempt] = useState(quiz?.multipleAttempt || "No");
  const [assign, setAssign] = useState(quiz?.assign || "Everyone");
  const [gradeDisplay, setGradeDisplay] = useState(quiz?.gradeDisplay || "percentage");
  const [submission, setSubmission] = useState(quiz?.submission || "online");
  const initialEntry = {
    textEntry: false,
    websiteURL: false,
    mediaRecordings: false,
    studentAnnotation: false,
    fileUploads: false,
  }
  const [entry, setEntry] = useState(quiz?.entry || initialEntry);
  

  useEffect(() => {
    if (qid === "new") {
      setTitle("");
      setEditorState(EditorState.createEmpty());
      setPoints(100);
      setQuizType("Graded Quiz");
      setDueDate("");
      setAvailableDate("");
      setAvailableUntil("");
      setQuizGroup("quiz");
      setGradeDisplay("percentage");
      setSubmission("online");
      setEntry(initialEntry);
      setShuffle("Yes");
      setTimeLimit("20")
      setMultipleAttempt("No");
      setAssign("Everyone");
    }
  }, [qid]);

  const handleSave = async () => {
    if (!cid) return;
    const QuizData = {
      _id: qid === "new" ? uuidv4() : qid,
      title,
      description: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      points,
      quizType: quizType,
      dueDate: dueDate,
      availableDate: availableDate,
      availableUntil: availableUntil,
      course: cid,
      gradeDisplay: gradeDisplay,
      quizGroup: quizGroup,
      submission: submission,
      entry: entry,
      Shuffle: shuffle,
      timeLimit: timeLimit,
      multipleAttempt: multipleAttempt,
      assign: assign,
    };

    if (qid === "new") {
      const quiz = await coursesClient.createQuizForCourse(cid, QuizData);
      dispatch(addQuiz(quiz));
    } else {
      await quizzesClient.updateQuiz(QuizData);
      dispatch(updateQuiz(QuizData));
    }

    navigate(`/Kambaz/Courses/${cid}/quizzes`);
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

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/quizzes`);
  };
  

  return (
    <div>
      <div style={{ marginLeft: "350px" }}>
        <span>Points {points}</span>
        <TiCancel style={{ marginLeft: "30px" }}/>
          Not Published 
        <Button style={{ marginLeft: "30px" }}>
          <BsThreeDotsVertical size={20} />
        </Button>
      </div>
      <QuizDetailNavigation />
      <div style={{ width: '1100px' }}>
      <hr className="m-3" style={{ width: "600px" }} />
      <Form.Group className="mb-3 col-6" controlId="QuizName">
          <Form.Control
            type="text"
            placeholder="Please input Quiz Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          </Form.Group>
        <Form.Group className="mb-3 col-6" controlId="QuizDescription">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="border rounded p-2"
            editorClassName="px-2"
            toolbarClassName="border-bottom"
            placeholder="Please write quiz description"
          />
        </Form.Group>
      </div>

      <div style={{ width: "1100px" }}>
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
                    <Form.Label className="col-form-label float-end">Quiz Group</Form.Label>
                </Col>
                <Col className="col-4">
                    <Form.Select value={quizGroup} 
                     onChange={(e) => setQuizGroup(e.target.value)}>
                        <option value="quiz">Quiz</option>
                        <option value="exam">Exam</option>
                        <option value="assignment">ASSIGNMENT</option>
                        <option value="project">PROJECT</option>
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
            <h6 className="fw-bold mb-0">Assign to</h6>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  value={assign}
                  placeholder="Everyone"
                />
              </InputGroup>
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
              to={`/Kambaz/Courses/${cid}/quizzes`}
              className="btn btn-light text-decoration-none me-3"
              onClick={handleCancel}
            >
              Cancel
            </Link>
            <Link
              to={`/Kambaz/Courses/${cid}/quizzes`}
              onClick={handleSave}
            >
              Save
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}
