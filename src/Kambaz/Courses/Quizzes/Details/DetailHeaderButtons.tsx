import { FaPencil } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";

export default function DetailHeaderButtons({ path }: { path: string }) {
    const navigate = useNavigate();
    const { cid, qid } = useParams()
    
    return (
        <div>
            <button className="btn btn-primary" onClick={() => { navigate(path) }}>Preview</button>
            <button className="btn btn-danger" onClick={() => { navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor`) }}>
                <FaPencil className="me-2" />
                Edit</button>
        </div>
    );
}