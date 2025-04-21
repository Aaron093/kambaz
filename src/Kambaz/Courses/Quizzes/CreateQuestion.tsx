import { Form, Row, Col, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import QuizDetailNavigation from "./QuizDetailNavigation";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function CreateQuestion() {
  const { cid, qid } = useParams();
  const navigate = useNavigate();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [questionType, setQuestionType] = useState("multipleChoice");
  const [points, setPoints] = useState(10);

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    const questionText = JSON.stringify(rawContent);
    
    // TODO: client dao routes for question
    console.log('Saving question:', { questionText, questionType, points });
    
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
  };

  const handleCancel = () => {
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}`);
  };

  return (
    <div>
      <div style={{ width: '1100px' }}>
        <QuizDetailNavigation />
      </div>
      <div style={{ width: '1100px' }}>
        <Form.Group className="mb-3" controlId="QuestionText">
          <Form.Label>Question Text</Form.Label>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="border rounded p-2"
            editorClassName="px-2"
            toolbarClassName="border-bottom"
            placeholder="Please write question text"
          />
        </Form.Group>

        <Row className="mb-3">
          <Col className="col-3">
            <Form.Label>Question Type</Form.Label>
            <Form.Select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="multipleChoice">Multiple Choice</option>
              <option value="trueFalse">True/False</option>
              <option value="shortAnswer">Short Answer</option>
            </Form.Select>
          </Col>
          <Col className="col-3">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value))}
            />
          </Col>
        </Row>

        <Card className="p-3 mb-3">
          {questionType === "multipleChoice" && (
            <div>
              <h6>Multiple Choice Options</h6>
              {/* TODO */}
            </div>
          )}
          {questionType === "trueFalse" && (
            <div>
              <h6>True/False Options</h6>
              {/* TODO */}
            </div>
          )}
          {questionType === "shortAnswer" && (
            <div>
              <h6>Short Answer Options</h6>
              {/* TODO */}
            </div>
          )}
        </Card>

        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-light me-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
