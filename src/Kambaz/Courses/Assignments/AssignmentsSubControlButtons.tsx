import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import DeleteComfirmation from "./DeleteComfirmation";


export default function AssignmentsSubControlButtons(
  {assignmentId, deleteAssignment}:
    { assignmentId: string;
      deleteAssignment: (assignmentId: string) => void; } ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirmDelete = () => {
    deleteAssignment(assignmentId);
    handleClose();
  };

  return (
    <div className="float-end d-flex align-items-center">
      <FaTrash className="text-danger me-2 mb-1"
       onClick={(event)=>{
        event.preventDefault();
        handleShow()}}/>
      <DeleteComfirmation
       show={show}
       handleClose={handleClose} 
       dialogTitle="Delete Assignment"
       deleteAssignment={handleConfirmDelete} />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div> );}