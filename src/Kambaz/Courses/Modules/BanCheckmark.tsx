import { FaCircle } from "react-icons/fa";
import { MdDoNotDisturbAlt } from "react-icons/md";
export default function BanCheckmark() {
  return (
    <span className="me-1 position-relative">
      <MdDoNotDisturbAlt style={{ top: "2px" }} className="text-secondary me-1 position-absolute fs-5" />
      <FaCircle className="text-white me-1 fs-6" />
    </span>);}