import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import "./styles.css"

export default function QuizzesControlButtons() {
  return (
    <div className="float-end d-flex align-items-center">
      <p className='pill'>
            30% of Total
      </p>
      <BsPlus className="fs-2" />
      <IoEllipsisVertical className="fs-4" />
            
    </div> );}