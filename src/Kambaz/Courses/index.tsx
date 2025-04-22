import CoursesNavigation from "./Navigation";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import PeopleTable from "./People/Table"
import { FaAlignJustify } from "react-icons/fa";
import { courses } from "../Database";
import * as courseClient from "../Courses/client";
import { useEffect, useState } from "react";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/Details/Details";
import QuizPreview from "./Quizzes/Preview";
import QuizEditor from "./Quizzes/Editor/QuizEditor";
import EditorIndex from "./Quizzes/Editor";
import { useSelector } from "react-redux";
import QuizQuestionsEditor from "./Quizzes/Editor/QuizQuestionsEditor";
import QuizAttempt from "./Quizzes/Attempt";

export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const { attempts } = useSelector((state: any) => state.accountReducer);
  const fetchUsers = async () => {
    if (cid) {
      const users = await courseClient.findUsersForCourse(cid);
      setUsers(users);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name}  &gt; {pathname.split("/")[4]}</h2> <hr />

      <div className="d-flex">
        <div className="d-none d-md-block">

          <CoursesNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Piazza" element={<h2>Piazza</h2>} />
            <Route path="Zoom" element={<h2>Zoom</h2>} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="Quizzes" element={<Quizzes />} />
            <Route path="Quizzes/:qid" element={<QuizDetails />} />
            <Route path="Quizzes/:qid/Questions" element={<QuizQuestionsEditor />} />
            <Route path="Quizzes/:qid/Editor/*" element={<EditorIndex />} />
            <Route path="Quizzes/:qid/Preview" element={<QuizPreview />} />
            <Route path="Quizzes/:qid/Attempt" element={<QuizAttempt />} />
            <Route path="People" element={<PeopleTable users={users} fetchUsers={fetchUsers} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
