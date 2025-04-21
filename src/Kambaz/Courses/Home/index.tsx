import { useSelector } from "react-redux";
import Modules from "../Modules/index";
import CourseStatus from "./Status";
export default function Home() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (currentUser.role === "FACULTY"){
  return (
    <div className="d-flex" id="wd-home">
      <div className="flex-fill me-3">
          <Modules />
      </div>
      <div className="d-none d-xl-block">
          <CourseStatus />
      </div>
    </div>
);}
if (currentUser.role === "STUDENT"){
  return (
    <div className="d-flex" id="wd-home">
      <div className="flex-fill">
          <Modules />
      </div>
    </div>
);}

}