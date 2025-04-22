import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleEnrollment, setEnrollment } from "./reducer";
import * as courseClient from "../Courses/client";
import * as enrollClient from "./client";
import * as userClient from "../Account/client";

export default function Dashboard(
  { courses, course, setCourse, addNewCourse, setCourses,
    deleteCourse, updateCourse, enrolling, setEnrolling, updateEnrollment}: {
    courses: any[]; course: any; setCourse: (course: any) => void; setCourses: (course: any) => void;
    addNewCourse: () => void; deleteCourse: (course: any) => void;
    updateCourse: () => void; enrolling: boolean; setEnrolling: (enrolling: boolean) => void; 
    updateEnrollment: (courseId: string, enrolled: boolean) => void })
 {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const courses = await courseClient.fetchAllCourses();
      setAllCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllEnrollments = async () => {
    try {
      const enrollments = await enrollClient.fetchAllEnrollments();
      dispatch(setEnrollment(enrollments));
    } catch (error) {
      console.error(error)
    }
  };

  

  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (enrollment: any) =>
        enrollment.user === currentUser._id && enrollment.course === courseId
  );
  
  useEffect(() => {
    fetchAllCourses();
  }, []);
  useEffect(() => {
    fetchAllEnrollments();
  }, []);

    // Need to figure out if I need to allow student's too enroll in courses... That was the point of this statement
    // But I got rid of the filter part because that's what A5 told me to


  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />

      {currentUser.role === "STUDENT" && (
        <button onClick={() => setEnrolling(!enrolling)} className="float-end btn btn-primary" >
        {enrolling ? "My Courses" : "All Courses"}
        </button>

      )}
      
      {(currentUser.role === "FACULTY") &&
        <div>
      <h5>New Course
          <button className="btn btn-primary my-1 float-end"
                  id="wd-add-new-course-click"
                  onClick={addNewCourse} > Add </button>
          <button className="btn btn-warning float-end my-1 me-2"
                  onClick={updateCourse} id="wd-update-course-click">
                  Update
          </button>

                  <br />
                  
      <input    value={course.name} className="form-control mb-2" 
        onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
      <textarea value={course.description} className="form-control"
        onChange={(e) => setCourse({ ...course, description: e.target.value }) } />
      </h5><hr />
      </div>
      }
    
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {courses.map((course) => (
            <div className="wd-dashboard-course col" style={{ width: "300px" }}>
              <div className="card rounded-3 overflow-hidden">
                <Link to={( (currentUser.role === "STUDENT" && !enrolling) || course.enrolled || currentUser.role === "FACULTY") ? `/Kambaz/Courses/${course._id}/Home` : "/Kambaz/Dashboard"}
                      className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <img src={course.image} width="100%" height={160} />
                  <div className="card-body">
                    <h5 className="wd-dashboard-course-title card-title">
                      {course.name} </h5>
                    <p className="wd-dashboard-course-title card-text overflow-y-hidden" style={{ maxHeight: 100 }}>
                      {course.description} </p>
                    <button className="btn btn-primary"> Go </button>
                    {/* {currentUser.role === "STUDENT" && (
                      <button
                        className={`btn ${
                          isEnrolled(course._id)
                            ? "btn-danger"
                            : "btn-success"
                        } float-end`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleEnrollment(course._id);
                        }}
                      >
                        {isEnrolled(course._id) ? "Unenroll" : "Enroll"}
                      </button>
                    )} */}
                    {enrolling && (
                      <button className={`btn ${ course.enrolled ? "btn-danger" : "btn-success" } float-end`} 
                        onClick={(event) => {
                          event.preventDefault();
                          updateEnrollment(course._id, !course.enrolled);
                      }}>
                        {course.enrolled ? "Unenroll" : "Enroll"}
                      </button>
                    )}

                    {(currentUser.role === "FACULTY") && 
                    <div className="d-inline">
                      <button onClick={(event) => {
                          event.preventDefault();
                          deleteCourse(course._id);
                        }} className="btn btn-danger float-end"
                        id="wd-delete-course-click">
                        Delete
                      </button>

                      <button id="wd-edit-course-click"
                        onClick={(event) => {
                          event.preventDefault();
                          setCourse(course);
                        }}
                        className="btn btn-warning me-2 float-end" >
                        Edit
                      </button>
                    </div>}
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>);}
