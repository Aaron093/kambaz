import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import DeleteComfirmation from "./DeleteComfirmation";


export default function QuizzesSubControlButtons(
  {quizId, deleteQuiz}:
    { quizId: string;
      deleteQuiz: (quizId: string) => void; } ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirmDelete = () => {
    deleteQuiz(quizId);
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
       dialogTitle="Delete Quiz"
       deleteQuiz={handleConfirmDelete} />
      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />
    </div> );}