import { Modal, Button } from "react-bootstrap";
export default function DeleteComfirmation({ show, handleClose, dialogTitle, deleteAssignment,}: {
  show: boolean;
  handleClose: () => void;
  dialogTitle: string; 
  deleteAssignment: () => void; }) {
  return (
  <Modal show={show} onHide={handleClose}>
   <Modal.Header closeButton>
    <Modal.Title>{dialogTitle}</Modal.Title>
   </Modal.Header>
   <Modal.Body>
    Are you sure you want to remove this assignment?
   </Modal.Body>
   <Modal.Footer>
    <Button variant="secondary"
     onClick={(event) => {
      event.preventDefault();
      handleClose();}}
     > Cancel </Button>
    <Button variant="danger"
     onClick={(event) => {
      deleteAssignment();
      handleClose();
      event.preventDefault();
     }} > Delete </Button>
   </Modal.Footer>
  </Modal>
);}
