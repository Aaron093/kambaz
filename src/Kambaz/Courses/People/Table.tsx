import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function PeopleTable({ users = [], fetchUsers }: { users?: any[], fetchUsers?: any }) {
  console.log(users);
  const filteredUsers = users.filter((user: any) => user !== null && user !== undefined);
  
  return (
    <div id="wd-people-table">
      <PeopleDetails fetchUsers={fetchUsers}/>
      <table className="table table-striped">
        <thead>
          <tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
        </thead>
        <tbody>
        {filteredUsers
          .map((user: any) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
              <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName} </span>
                <span className="wd-last-name">{user.lastName}</span>
              </Link>
              </td>
              <td className="wd-login-id">{user.loginId}</td>
              <td className="wd-section">{user.section}</td>
              <td className="wd-role">{user.role}</td>
              <td className="wd-last-activity">{user.lastActivity}</td>
              <td className="wd-total-activity">{user.totalActivity}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </div> 
    );
}