import CourseNavigation from "./Navigation";
import Modules from "./Modules/index.tsx";
import Home from "./Home";
import PeopleTable from "./People/Table"
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Quizzes from "./Quizzes";
import QuizEditor from "./Quizzes/QuizzesEditor";
import CreateQuestion from "./Quizzes/CreateQuestion.tsx";
import { FaAlignJustify } from "react-icons/fa6"
import { Navigate, Route, Routes, useParams, useLocation } from "react-router";
import { useState, useEffect } from 'react';
import * as coursesClient from "./client";


export default function Courses({ courses }: { courses: any[]; }) {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation()
  const [users, setUsers] = useState<any[]>([]);
  const fetchUsersbyCoures = async () => {
    const users = await coursesClient.findUsersForCourse(cid!);
    setUsers(users);
  };
  useEffect(() => {
    fetchUsersbyCoures();
  }, [cid]);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name} &gt; {pathname.split("/")[4]}
        {pathname.split("/")[5]!== undefined ? " > " + pathname.split("/")[5] : ""}
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
            <CourseNavigation />
        </div>
        <div className="flex-fill">
            <Routes>
              <Route path="/" element={<Navigate to="Home" />} />
              <Route path="Home" element={<Home />} />
              <Route path="Modules" element={<Modules />} />
              <Route path="Assignments" element={<Assignments/>} />
              <Route path="Assignments/:aid" element={<AssignmentEditor />} />
              <Route path="Quizzes" element={<Quizzes/>} />
              <Route path="Quizzes/:qid" element={<QuizEditor />} />
              <Route path="Quizzes/:qid/createQuestion" element={<CreateQuestion />} />
              <Route path="People" element={<PeopleTable users = {users}/>} />
            </Routes>
        </div>
      </div>
    </div>
  );
}
