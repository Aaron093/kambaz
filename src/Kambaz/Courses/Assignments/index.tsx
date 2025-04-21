import { Link, useParams } from "react-router";
import { BsGripVertical } from "react-icons/bs";
import { MdEditDocument } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { ListGroup } from "react-bootstrap";
import { useEffect } from "react";

import AssignmentsControls from "./AssignmentsControls" 
import AssignmentsControlButtons from "./AssignmentsControlButtons";
import AssignmentsSubControlButtons from "./AssignmentsSubControlButtons";
import * as coursesClient from "../client";
import * as assignmentsClient from "./client";
import "./styles.css"
// import { assignments } from "../../Database";

import {setAssignments, deleteAssignment }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";


export default function Assignments() {
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();

  const removeAssignment = async (assignmentId: string) => {
    await assignmentsClient.deleteAssignment(assignmentId);
    dispatch(deleteAssignment(assignmentId));
  };

  const fetchAssignments = async () => {
    const assignments = await coursesClient.findAssignmentsForCourse(cid!);
    dispatch(setAssignments(assignments));
  };
  useEffect(() => {
    fetchAssignments();
  }, [cid]);

  
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (currentUser.role === "FACULTY"){
  return (


    <div id="wd-assignments d-flex" >
    <AssignmentsControls />
      <ListGroup className="rounded-0" id="wd-assignments">
        <ListGroup.Item className="wd-assignments bg-secondary p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-1 d-flex">
            <div className="wd-title p-3 ps-1 d-flex align-self-center">
              <BsGripVertical className="me-2 fs-3 "/>
              <FaCaretDown className="me-2 fs-3 "/>
              ASSIGNMENTS
            </div>
            <div className="d-flex align-self-center ms-auto">
              <AssignmentsControlButtons />
            </div>
          </div>


      {assignments.map((assignment:any) => (
        <ListGroup className="wd-assignment-details rounded-0" style={{ borderLeft: '3px solid green' }} >
          <Link to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`} className="text-decoration-none">
          <ListGroup.Item className="wd-assignment-detail p-3 ps-1 d-flex">
              <BsGripVertical className="me-3 fs-3 align-self-center" />
              <MdEditDocument className="me-3 fs-3 text-success align-self-center"/>
            <div >
              <p className="mb-0 fs-5 fw-bold">
                {assignment.name && assignment.title
                  ? `${assignment.name} ${assignment.title}`
                  : assignment.name || assignment.title}
              </p>
              <p className="mb-0 fs-6 text-muted">
                <span className="text-danger ">Multiple Modules </span>
                <span> | </span> 
                <span className="fw-bold"> Not available until </span>
                <span className="">
                  {assignment.availableDate!=="" ? assignment.availableDate + " at 12:00am" : "not released yet"}  |
                </span> <br />
                <span className="fw-bold"> Due </span>
                <span> 
                  {assignment.due_date!=="" ? assignment.dueDate + " at 11.59pm" : "not released yet"} | 
                  {assignment.points!=="" ? assignment.points : " Unreleased"}
                </span></p>
            </div>
            <div className="d-flex align-self-center ms-auto">
              <AssignmentsSubControlButtons 
                assignmentId={assignment._id}
                deleteAssignment={(assignmentId) => removeAssignment(assignmentId)}/>
            </div>
          </ListGroup.Item>
          </Link>
        </ListGroup>))}
        </ListGroup.Item>
      </ListGroup>
  </div>
    );}

  if (currentUser.role === "STUDENT"){
  return (
    <div id="wd-assignments d-flex" >
      <ListGroup className="rounded-0" id="wd-assignments">
        <ListGroup.Item className="wd-assignments bg-secondary p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-1 d-flex">
            <div className="wd-title p-3 ps-1 d-flex align-self-center">
              <BsGripVertical className="me-2 fs-3 "/>
              <FaCaretDown className="me-2 fs-3 "/>
              ASSIGNMENTS
            </div>
            <div className="d-flex align-self-center ms-auto">
              <AssignmentsControlButtons />
            </div>
          </div>


      {assignments.map((assignment:any) => (
        <ListGroup className="wd-assignment-details rounded-0" style={{ borderLeft: '3px solid green' }} >
          <Link to={`/Kambaz/Courses/${cid}/Assignments/${assignment._id}`} className="text-decoration-none">
          <ListGroup.Item className="wd-assignment-detail p-3 ps-1 d-flex">
              <BsGripVertical className="me-3 fs-3 align-self-center" />
              <MdEditDocument className="me-3 fs-3 text-success align-self-center"/>
            <div >
              <p className="mb-0 fs-5 fw-bold">
                {assignment.name && assignment.title
                  ? `${assignment.name} ${assignment.title}`
                  : assignment.name || assignment.title}
              </p>
              <p className="mb-0 fs-6 text-muted">
                <span className="text-danger ">Multiple Modules </span>
                <span> | </span> 
                <span className="fw-bold"> Not available until </span>
                <span className="">
                  {assignment.availableDate!=="" ? assignment.availableDate + " at 12:00am" : "not released yet"}  |
                </span> <br />
                <span className="fw-bold"> Due </span>
                <span> 
                  {assignment.due_date!=="" ? assignment.dueDate + " at 11.59pm" : "not released yet"} | 
                  {assignment.points!=="" ? assignment.points : " Unreleased"}
                </span></p>
            </div>

          </ListGroup.Item>
          </Link>
        </ListGroup>))}
        </ListGroup.Item>
      </ListGroup>
  </div>
    );}
  }



  