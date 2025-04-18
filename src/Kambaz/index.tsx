import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import ProtectedRoute from "./Account/ProtectedRoute";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";
import * as enrollmentClient from "./client"

import { useSelector } from "react-redux";
// import { useDispatch } from "react-redux";
// import { addCourse, deleteCourse, updateCourse } from "./Courses/reducer";

import Session from "./Account/Session";

export default function Kambaz() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [course, setCourse] = useState<any>({
    _id: "0", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15",
    image: "/images/reactjs.jpg", description: "New Description"
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const triggerRefresh = () => setRefreshFlag(prev => !prev);

  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, [currentUser, enrollments]);

  const fetchAllCourses = async () => {
    try {
      const courses = await courseClient.fetchAllCourses();
      setAllCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrollments = async () => {
    const data = await enrollmentClient.fetchAllEnrollments();
    setEnrollments(data);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    fetchAllCourses();
  }, [refreshFlag]);


 // const dispatch = useDispatch();

/*   const handleAddCourse = () => {
    dispatch(addCourse(course));
    setCourse({...course, name: "", description: "" });
  }; */
  const handleAddCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setCourses([ ...courses, newCourse ]);
    triggerRefresh();
  };

  const handleDeleteCourse = async (courseId: string) => {
      const status = await courseClient.deleteCourse(courseId);
      if (status === 200) {
        setCourses(courses.filter((course) => course._id !== courseId));
      } else {
        console.error('Failed to delete course. Server returned:', status);
      }
      triggerRefresh();
    };

  const handleUpdateCourse =  async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    }));
    triggerRefresh();
  };

  const handleEnroll = async (userId: string, courseId: string) => {
    await enrollmentClient.enrollUserInCourse(userId, courseId);
    await fetchEnrollments();
  };

  const handleUnenroll = async (userId: string, courseId: string) => {
    await enrollmentClient.unenrollUserFromCourse(userId, courseId);
    await fetchEnrollments();
  };

  console.log(enrollments)
  return (
    <Session>
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
      <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={
              <ProtectedRoute>
              <Dashboard
              allCourses={allCourses}
              courses={courses}
              course={course}
              setCourse={setCourse}
              enrollments = {enrollments}
              addNewCourse={handleAddCourse}
              deleteCourse={handleDeleteCourse}
              updateCourse={handleUpdateCourse}
              enroll = {handleEnroll}
              unenroll = {handleUnenroll}/>

              </ProtectedRoute> }
            />
            
            <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses}/></ProtectedRoute>} />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
      </div>
    </div>
    </Session>
  );
}

