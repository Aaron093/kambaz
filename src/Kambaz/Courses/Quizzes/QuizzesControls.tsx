import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import InputGroup from 'react-bootstrap/InputGroup';

import { useParams, useNavigate } from "react-router";


export default function QuizzesControls() {
  const { cid } = useParams();
  const navigate = useNavigate()
  return (
    <div id="wd-quizzes-controls" className="text-nowrap">
      <Button onClick={()=>navigate(`/Kambaz/Courses/${cid}/Quizzes/new`)} variant="danger" size="lg" className="me-1 float-end" id="wd-add-quiz-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Quiz
      </Button>
      <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-group-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
      </Button>

      <InputGroup className="mb-3 border-0" float-start size="lg" style={{ width: "30%" }} id="wd-quiz-search-bar">
        <InputGroup.Text className="bg-white border-end-0" style={{paddingRight:"0px"}}>
          <CiSearch />
        </InputGroup.Text>
        <Form.Control className="border-start-0 z-1" style={{borderLeft:"None"}}
          placeholder="Search..."
          aria-label="Search"
        />
      </InputGroup>
    </div>
);}
