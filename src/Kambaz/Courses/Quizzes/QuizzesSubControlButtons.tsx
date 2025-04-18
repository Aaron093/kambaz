import { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import DeleteComfirmation from "./DeleteComfirmation";
import { Button } from "react-bootstrap";


export default function QuizzesSubControlButtons(
  {QuizId, deleteQuiz}:
    { QuizId: string;
      deleteQuiz: (QuizId: string) => void; } ) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirmDelete = () => {
    deleteQuiz(QuizId);
    handleClose();
  };

  return (
    <div className="float-end d-flex align-items-center">
      <GreenCheckmark />
      <Button variant="secondary" size="lg" className="me-1 float-end">
      <IoEllipsisVertical className="fs-4" />
      </Button>
    </div> );}