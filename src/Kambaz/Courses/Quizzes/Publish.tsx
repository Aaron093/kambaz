import GreenCheckmark from "../Modules/GreenCheckmark";
import { GoCircleSlash } from "react-icons/go";

export default function LessonControlButton({ quiz, togglePublish, } : 
  { quiz: any;
    togglePublish: (quiz: any) => void; 
  }) {
        return (
          <div className="d-inline" onClick={() => togglePublish(quiz)}>
            {quiz.published ? 
                <GreenCheckmark  /> :
                <GoCircleSlash className="text-danger" />}
          </div>
        );}