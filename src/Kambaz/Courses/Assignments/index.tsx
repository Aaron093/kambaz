import AssignmentControls from "./AssignmentControls";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButton from "./LessonControlButton";
import { MdOutlineAssignment } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { deleteAssignment, setAssignments } from "./reducer";
import AssignmentControlButtons from "./AssignmentControlButton";
import { useEffect, useState } from "react";
import * as coursesClient from "../client";
import * as assignmentClient from "./client"


export default function Assignments() {
    const { cid, aid } = useParams();
    const { assignments } = useSelector((state: any) => state.assignmentsReducer);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const dispatch = useDispatch();
    const handleDeleteAssignment = (assignmentId: string) => {
      dispatch(deleteAssignment(assignmentId));
    };

    const [showModal, setShowModal] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);

    const fetchAssignments = async () => {
      const assignments = await coursesClient.findAssignmentsForCourse(cid as string);
      dispatch(setAssignments(assignments));
    };
    useEffect(() => {
      fetchAssignments();
    }, []);

    const confirmDeleteAssignment = (assignmentId: string) => {
      setAssignmentToDelete(assignmentId);
      setShowModal(true);
    };

    const handleDeleteConfirmed = async () => {
      if (assignmentToDelete) {
        await assignmentClient.deleteAssignment(assignmentToDelete);
        dispatch(deleteAssignment(assignmentToDelete));
      }
      setShowModal(false);
      setAssignmentToDelete(null);
    };

    const handleDeleteCancelled = () => {
      setShowModal(false);
      setAssignmentToDelete(null);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setAssignmentToDelete(null);
    };

    return (
      <div id="wd-assignments">

        <AssignmentControls />

        <ul id="wd-assign" className="list-group rounded-0 mx-5">
          <li className="wd-module list-group-item p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary"> 
              <BsGripVertical className="me-2 fs-3 " />
              <IoMdArrowDropdown className=""/>
              <span className="fs-4 ">ASSIGNMENTS</span>
              <AssignmentControlButtons />
              <FaPlus className="me-2 float-end" />
              <span className="border border-dark rounded float-end mx-3 px-2">40% of Total</span>
            </div>
            <ul className="wd-lessons list-group rounded-0">
              {assignments
                .map((assignment: any) => 
                  <li className="wd-lesson list-group-item p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3 float-start mt-4" />
                    <MdOutlineAssignment className="text-success me-4 fs-3  float-start mt-4" />
                    <div className="float-start">
                      <a className="wd-assignment-link text-decoration-none text-dark fs-4 "
                        href={`#/Kambaz/Courses/${cid}/Assignments/${currentUser.role === "FACULTY" ? assignment._id : ""}`}>
                        {assignment.title}
                      </a> <br/>
                      <span className="fs-6 ">
                        <span className="text-danger">Multiple Modules</span> | <b>Not Available Until</b> {assignment.available} |<br/>
                        <b>Due</b> {assignment.due} | {assignment.points} Points
                      </span>
                  
                    </div>
                    <LessonControlButton assignId={assignment._id} deleteAssignment={confirmDeleteAssignment}/>
                  </li>
                  )} 
            </ul>
          </li>
        </ul>
        {showModal && (
           <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
           <div className="modal-dialog">
               <div className="modal-content">
                   <div className="modal-header">
                       <h5 className="modal-title">Confirm Deletion</h5>
                       <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                   </div>
                   <div className="modal-body">
                       <p>Are you sure you want to delete this assignment?</p>
                   </div>
                   <div className="modal-footer">
                       <button type="button" className="btn btn-secondary" onClick={handleDeleteCancelled}>
                           Cancel
                       </button>
                       <button type="button" className="btn btn-danger" onClick={handleDeleteConfirmed}>
                           Delete
                       </button>
                   </div>
               </div>
           </div>
       </div>
        
      )}
      </div>
                
               
  );}
  