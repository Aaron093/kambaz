import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function LessonControlButton({ assignId, deleteAssignment } : 
  { assignId: string; deleteAssignment: (assignId: string) => void; }) {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  return (
    <div className="float-end mt-4">
      {currentUser.role === "FACULTY" &&
      <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteAssignment(assignId)}/> }
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div>
);}