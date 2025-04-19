import { Link, useParams } from "react-router";
import { BsGripVertical } from "react-icons/bs";
import { MdEditDocument } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { ListGroup } from "react-bootstrap";
import { useEffect } from "react";

import QuizzesControls from "./QuizzesControls" 
import QuizzesSubControlButtons from "./QuizzesSubControlButtons";
import * as coursesClient from "../client";
import * as QuizzesClient from "./client";
import "./styles.css"
// import { Quizzes } from "../../Database";

import {setQuizzes, deleteQuiz }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";


export default function Quizzes() {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();

  const removeQuiz = async (QuizId: string) => {
    await QuizzesClient.deleteQuiz(QuizId);
    dispatch(deleteQuiz(QuizId));
  };

  const fetchQuizzes = async () => {
    const Quizzes = await coursesClient.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(Quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);
  return (
    <div id="wd-Quizzes d-flex" >
    <QuizzesControls />
      <ListGroup className="rounded-0" id="wd-Quizzes">
        <ListGroup.Item className="wd-Quizzes bg-secondary p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-1 d-flex">
            <div className="wd-title p-3 ps-1 d-flex align-self-center">
              <BsGripVertical className="me-2 fs-3 "/>
              <FaCaretDown className="me-2 fs-3 "/>
              ASSIGNMENT QUIZZES
            </div>
          </div>


      {quizzes.map((Quiz:any) => (
        <ListGroup className="wd-Quiz-details rounded-0" style={{ borderLeft: '3px solid green' }} >
          <Link to={`/Kambaz/Courses/${cid}/Quizzes/${Quiz._id}`} className="text-decoration-none">
          <ListGroup.Item className="wd-Quiz-detail p-3 ps-1 d-flex">
              <BsGripVertical className="me-3 fs-3 align-self-center" />
              <MdEditDocument className="me-3 fs-3 text-success align-self-center"/>
            <div >
              <p className="mb-0 fs-5 fw-bold">
                {Quiz.name && Quiz.title
                  ? `${Quiz.name} ${Quiz.title}`
                  : Quiz.name || Quiz.title}
              </p>
              <p className="mb-0 fs-6 text-muted">
                <span className="text-danger ">Multiple Modules </span>
                <span> | </span> 
                <span className="fw-bold"> Not available until </span>
                <span className="">
                  {Quiz.availableDate!=="" ? Quiz.availableDate + " at 12:00am" : "not released yet"}  |
                </span> <br />
                <span className="fw-bold"> Due </span>
                <span> 
                  {Quiz.due_date!=="" ? Quiz.dueDate + " at 11.59pm" : "not released yet"} | 
                  {Quiz.points!=="" ? Quiz.points : " Unreleased"}
                </span></p>
            </div>
            <div className="d-flex align-self-center ms-auto">
              <QuizzesSubControlButtons 
                QuizId={Quiz._id}
                deleteQuiz={(QuizId) => removeQuiz(QuizId)}/>
            </div>
          </ListGroup.Item>
          </Link>
        </ListGroup>))}
        </ListGroup.Item>
      </ListGroup>
  </div>
    );
}



  