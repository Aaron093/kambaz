import { FaPlus } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
export default function AssignmentControls() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const editer = () => {
    
    navigate(`/Kambaz/Courses/${cid}/Assignments/New`);
  };

  return (
    <div id="wd-modules-controls" className="text-nowrap py-3 mx-5">
      {currentUser.role === "FACULTY" &&
        <div>
          <button id="wd-add-module-btn" className="btn btn-lg btn-danger me-1 float-end"
          onClick={editer}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Assignment</button>
          <button id="wd-add-module-btn" className="btn btn-lg btn-secondary me-1 float-end">
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Group</button>
        </div>
      }
      <button id="wd-add-module-btn" className="btn btn-lg me-1 btn-search">
        <CiSearch className="position-relative me-2" style={{ bottom: "1px" }} />
        <input id="wd-search-assignment" className="input-search"
               placeholder="Search..." /></button>

    </div>
);}