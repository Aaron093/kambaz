import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import DetailHeaderButtons from "./DetailHeaderButtons";

export default function QuizDetails() {
    const { cid, qid } = useParams();
    console.log("Quiz ID", qid);
    const [quiz, setQuiz] = useState<any>({});
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);

    useEffect(() => {
        if (quizzes.length > 0) {
            const quiz = quizzes.find((quiz: any) => quiz._id === qid);
            setQuiz(quiz || {});
        }
    }, [quizzes]);

    return (
        <div className="container">
            <div className="row wd-full-width">
                <div>
                    <DetailHeaderButtons path={`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor/Questions`}/>
                </div>
            </div>
            <hr />
            <div className="row">
                <h2>{quiz?.title}</h2>
                <br />
            </div>
            <br />
            <br />
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Quiz Type:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.type}</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Points:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.points}</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Assignment Group:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.group}</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Shuffle Answers:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.shuffle ? "Yes" : "No"}</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Time Limit:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.time_limit} Minutes</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Multiple Attempts:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.multiple_attempts ? "Yes" : "No"}</h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>View Responses:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.view_responses ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Show Correct Answers:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.show_correct_answers ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>One Question at a Time:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.one_question_at_a_time ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Require Respondus Lockdown Browser:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.lockdown_browser ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Require to View Quiz Results:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.required_to_view ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Webcam Required:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.webcam ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-end">
                    <h6><b>Lock Questions After Answering:</b></h6>
                </div>
                <div className="col-8">
                    <h6>{quiz?.lock_questions_after_answering ? "Yes" : "No"} </h6>
                </div>
            </div>
            <div className="row">
                <table className="table">
                    <thead>
                        <tr className="table-light"><th>Due</th><th>For</th><th>Available From</th><th>Until</th></tr>
                    </thead>
                    <tbody>
                        <tr ><td>{quiz?.due}</td><td>{quiz?.published ? "Everybody" : "Nobody"} </td><td>{quiz?.available}</td><td>{quiz?.due}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}