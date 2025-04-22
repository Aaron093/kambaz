import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../../Modules/GreenCheckmark";
import { GoCircleSlash } from "react-icons/go";


export default function EditorHeader({ points, published }: { points: number, published: boolean }) {
    return (
        <div className=" float-end align-items-center mr-2">
            <button className="btn btn-sm btn-secondary me-1 mx-3 align-items-center float-end">
                <IoEllipsisVertical className="fs-4" /></button>
            {published ?
                <div className="d-flex align-items-center mt-2 mx-3">
                    <p className="mb-0 mx-3">Points: {points}</p>
                    <GreenCheckmark /> <p className="mb-0 "> Published</p>
                </div> :
                <div className="d-flex align-items-center mx-3 mt-2">
                    <p className="mb-0 mx-3">Points: {points}</p>
                    <GoCircleSlash className="text-danger" />
                    <p className="mb-0 mx-1"> Not Published</p>
                </div>
            }
        </div>
    )
}