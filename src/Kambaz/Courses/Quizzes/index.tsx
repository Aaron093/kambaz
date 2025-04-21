import { Link, useParams } from "react-router";
import { BsGripVertical } from "react-icons/bs";
import { MdEditDocument } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { ListGroup } from "react-bootstrap";
import { useEffect } from "react";

import QuizzesControls from "./QuizzesControls" 
import QuizzesControlButtons from "./QuizzesControlButtons";
import QuizzesSubControlButtons from "./QuizzesSubControlButtons";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import "./styles.css"

import {setQuizzes, deleteQuiz }
  from "./reducer";
import { useSelector, useDispatch } from "react-redux";


export default function Quizzes() {
  const { cid } = useParams();
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();

  const removeQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const fetchQuizzes = async () => {
    const quizzes = await coursesClient.findQuizzesForCourse(cid!);
    dispatch(setQuizzes(quizzes));
  };
  useEffect(() => {
    fetchQuizzes();
  }, [cid]);

    
  return (


    <div id="wd-quizzes d-flex" >
    <QuizzesControls />
      <ListGroup className="rounded-0" id="wd-quizzes">
        <ListGroup.Item className="wd-quizzes bg-secondary p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-1 d-flex">
            <div className="wd-title p-3 ps-1 d-flex align-self-center">
              <BsGripVertical className="me-2 fs-3 "/>
              <FaCaretDown className="me-2 fs-3 "/>
              QUIZZES
            </div>
            <div className="d-flex align-self-center ms-auto">
              <QuizzesControlButtons />
            </div>
          </div>


      {quizzes.map((quiz:any) => (
        <ListGroup className="wd-quizzes-details rounded-0" style={{ borderLeft: '3px solid green' }} >
          <Link to={`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`} className="text-decoration-none">
          <ListGroup.Item className="wd-quizzes-detail p-3 ps-1 d-flex">
              <BsGripVertical className="me-3 fs-3 align-self-center" />
              <MdEditDocument className="me-3 fs-3 text-success align-self-center"/>
            <div >
              <p className="mb-0 fs-5 fw-bold">
                {quiz.name && quiz.title
                  ? `${quiz.name} ${quiz.title}`
                  : quiz.name || quiz.title}
              </p>
              <p className="mb-0 fs-6 text-muted">
                <span className="text-danger ">Multiple Modules </span>
                <span> | </span> 
                <span className="fw-bold"> Not available until </span>
                <span className="">
                  {quiz.availableDate!=="" ? quiz.availableDate + " at 12:00am" : "not released yet"}  |
                </span> <br />
                <span className="fw-bold"> Due </span>
                <span> 
                  {quiz.due_date!=="" ? quiz.dueDate + " at 11.59pm" : "not released yet"} | 
                  {quiz.points!=="" ? quiz.points : " Unreleased"}
                </span></p>
            </div>
            <div className="d-flex align-self-center ms-auto">
              <QuizzesSubControlButtons 
                quizId={quiz._id}
                deleteQuiz={(quizId) => removeQuiz(quizId)}/>
            </div>
          </ListGroup.Item>
          </Link>
        </ListGroup>))}
        </ListGroup.Item>
      </ListGroup>
  </div>
    );}



  