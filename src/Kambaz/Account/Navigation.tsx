import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AccountNavigation() {
 const { currentUser } = useSelector((state: any) => state.accountReducer);
 const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
 const active = (path: string) => (pathname.includes(path) ? "active" : "text-danger");
 const { pathname } = useLocation();
 return (
   <div id="wd-account-navigation" className="wd list-group fs-6 rounded-0">
     {links.map((link) => (
       <Link key={link} to={`/Kambaz/Account/${link}`} className={`list-group-item ${active(link)} border border-0`}> {link} </Link>
     ))}
     {currentUser && currentUser.role === "ADMIN" && (
       <Link to={`/Kambaz/Account/Users`} className={`list-group-item ${active("Users")} border border-0`}> Users </Link> )}
   </div>
);}
