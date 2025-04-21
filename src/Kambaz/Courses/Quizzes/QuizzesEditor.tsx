import { Form, Row, Col } from "react-bootstrap";
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

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((a:any) => a._id === qid);

  const [name, setName] = useState(quiz?.name || "");
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
  const [dueDate, setDueDate] = useState(quiz?.dueDate || "");
  const [availableDate, setAvailableDate] = useState(quiz?.availableDate || "");
  const [availableUntil, setAvailableUntil] = useState(quiz?.availableUntil || "");
  const [quizGroup, setQuizGroup] = useState(quiz?.quizGroup || "quiz");
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
      setName("")
      setTitle("");
      setEditorState(EditorState.createEmpty());
      setPoints(100);
      setDueDate("");
      setAvailableDate("");
      setAvailableUntil("");
      setQuizGroup("quiz");
      setGradeDisplay("percentage");
      setSubmission("online");
      setEntry(initialEntry);
    }
  }, [qid]);

  const handleEntryChange = (option:any) => {
    setEntry((prevEntry:any) => ({
      ...prevEntry,
      [option]: !prevEntry[option],
    }));
  };

  const handleSave = async () => {
    if (!cid) return;
    const QuizData = {
      _id: qid === "new" ? uuidv4() : qid,
      name,
      title,
      description: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
      points,
      dueDate: dueDate,
      availableDate: availableDate,
      availableUntil: availableUntil,
      course: cid,
      gradeDisplay: gradeDisplay,
      quizGroup: quizGroup,
      submission: submission,
      entry: entry,
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

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/quizzes`);
  };
  

  return (
    <div>
      <QuizDetailNavigation />
      <div style={{ width: '1100px' }}>
        <Form.Group className="mb-3 col-6" controlId="QuizName">
          <Form.Label className="mtext-muted">Quiz Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Please input Quiz Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label className="mtext-muted">Quiz Title</Form.Label>
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
            <Form.Label className="col-form-label float-end">Points</Form.Label>
          </Col>
          <Col className="col-4">
            <Form.Control
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
            />
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
                    </Form.Select>
                </Col>
        </Row>

        <Row className="mb-3">
            <Col className="col-2 float-end">
                <Form.Label className="col-form-label float-end">Display Grade as</Form.Label>
            </Col>
            <Col className="col-4">
                <Form.Select value={gradeDisplay}
                 onChange={(e) => setGradeDisplay(e.target.value)}>
                    <option value="percentage">Percentage</option>
                    <option value="points">Points</option>
                    <option value="level">Level</option>
                </Form.Select>
            </Col>
        </Row>

        <Row className="mb-3">
            <Col className="col-2">
                <Form.Label className="col-form-label float-end">Submission Type</Form.Label>
            </Col>
            <Col className="col-4">
                <Card className="p-2">
                    <Form.Select className="mb-3" value={submission}
                     onChange={(e) => setSubmission(e.target.value)}>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="none">No Submission needed</option>
                    </Form.Select>
                    <h6 className="fw-bold mb-3">Online Entry Options</h6>
                    <Form.Check className="mb-3" label="Text Entry"
                    checked={entry.textEntry} 
                    onChange={() => handleEntryChange("textEntry")}/>
                    <Form.Check className="mb-3" label="Website URL"
                    checked={entry.websiteURL} 
                    onChange={() => handleEntryChange("websiteURL")}/>
                    <Form.Check className="mb-3" label="Media Recordings"
                    checked={entry.mediaRecordings} 
                    onChange={() => handleEntryChange("mediaRecordings")}/>
                    <Form.Check className="mb-3" label="Student Annotation"
                    checked={entry.studentAnnotation} 
                    onChange={() => handleEntryChange("studentAnnotation")}/>
                    <Form.Check className="mb-3" label="File Uploads"
                    checked={entry.fileUploads} 
                    onChange={() => handleEntryChange("fileUploads")}/>

                </Card>
            </Col>
        </Row>

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
