import { Modal, Button } from "react-bootstrap";
export default function DeleteComfirmation({ show, handleClose, dialogTitle, deleteQuiz,}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string; 
  deleteQuiz: () => void; }) {
  return (
  <Modal show={show} onHide={handleClose}>
   <Modal.Header closeButton>
    <Modal.Title>{dialogTitle}</Modal.Title>
   </Modal.Header>
   <Modal.Body>
    Are you sure you want to remove this quiz?
   </Modal.Body>
   <Modal.Footer>
    <Button variant="secondary"
     onClick={(event) => {
      event.preventDefault();
      handleClose();}}
     > Cancel </Button>
    <Button variant="danger"
     onClick={(event) => {
      deleteQuiz();
      handleClose();
      event.preventDefault();
     }} > Delete </Button>
   </Modal.Footer>
  </Modal>
);}
