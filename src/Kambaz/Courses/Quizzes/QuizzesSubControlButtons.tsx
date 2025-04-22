import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash, FaCheck } from "react-icons/fa";
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
      <Dropdown>

        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <IoEllipsisVertical className="fs-4" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={(event) => {
            event.preventDefault();
            handleShow();
          }}>
            <FaTrash className="text-danger me-2" />
            Delete
          </Dropdown.Item>
          <Dropdown.Item>
            <FaCheck className="text-success me-2" />
            Publish
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      <DeleteComfirmation
        show={show}
        handleClose={handleClose} 
        dialogTitle="Delete Quiz"
        deleteQuiz={handleConfirmDelete} />
    </div>
  );
}
