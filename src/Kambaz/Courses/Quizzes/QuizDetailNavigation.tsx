import { Nav } from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom";

export default function QuizDetailNavigation() {
  const { cid, qid } = useParams();
  const { pathname } = useLocation();
  
  return (
    <Nav variant="pills" style={{ width: '1100px' }}>
      <Nav.Item>
        <Nav.Link 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`}
          active={pathname.includes(`${qid}`) && !pathname.includes('CreateQuestion')}
        >
          Quiz Details
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link 
          as={Link} 
          to={`/Kambaz/Courses/${cid}/Quizzes/${qid}/CreateQuestion`}
          active={pathname.includes('CreateQuestion')}
        >
          Create Question
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
