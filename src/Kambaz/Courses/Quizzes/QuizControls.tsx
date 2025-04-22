import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { IoEllipsisVertical } from "react-icons/io5";
export default function QuizControls() {
  const { cid } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const details = () => {
    
    navigate(`/Kambaz/Courses/${cid}/Quizzes/New/Editor`);
  };

  return (
    <div id="wd-modules-controls" className="text-nowrap py-3 mx-5">
      {currentUser.role === "FACULTY" &&
        <div>
          <button id="wd-add-module-btn" className="btn btn-lg btn-secondary me-1 float-end">
            <IoEllipsisVertical className="fs-4" /></button>
          <button id="wd-add-module-btn" className="btn btn-lg btn-danger me-1 float-end"
          onClick={details}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Quiz</button>
          
        </div>
      }
      <button id="wd-add-module-btn" className="btn btn-lg me-1 btn-search">
        <CiSearch className="position-relative me-2" style={{ bottom: "1px" }} />
        <input id="wd-search-quiz" className="input-search"
               placeholder="Search for Quiz" /></button>

    </div>
);}