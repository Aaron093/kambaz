import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router";
import QuizEditor from "./QuizEditor";
import Questions from "./QuizQuestionsEditor";
import Details from "./Details";
import { useDispatch, useSelector } from "react-redux";
import React, { ReactNode, useEffect, useState } from "react";
import * as quizClient from "../client";
import { setQuizzes } from "../reducer";

function EditorLayout({ children }: { children: ReactNode }) {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isDetailsTab = location.pathname.includes('/Details') || !location.pathname.includes('/Questions');

    return (
        <div>
            <div className="d-flex mb-4 container mt-4">
                <div
                    className="tab"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor/Details`)}
                    style={{
                        cursor: "pointer",
                        padding: "10px",
                        fontWeight: isDetailsTab ? "bold" : "normal",
                        borderBottom: isDetailsTab ? "2px solid black" : "1px solid lightgray",
                    }}
                >
                    Details
                </div>
                <div
                    className="tab"
                    onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/Editor/Questions`)}
                    style={{
                        cursor: "pointer",
                        padding: "10px",
                        fontWeight: !isDetailsTab ? "bold" : "normal",
                        borderBottom: !isDetailsTab ? "2px solid black" : "1px solid lightgray",
                    }}
                >
                    Questions
                </div>
            </div>
            <hr />
            {children}
        </div>
    );
}

export default function EditorIndex() {
    const { cid, qid } = useParams();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const quizzes = useSelector((state: any) => state.quizzesReducer.quizzes);
    const quiz = useSelector((state: any) => 
        state.quizzesReducer.quizzes.find((q: any) => q._id === qid)
    );
    
    useEffect(() => {
        const loadQuizData = async () => {
            if (qid === "New") return;
            
            if (quiz) return;
            
            try {
                setIsLoading(true);
                setError(null);
                
                const fetchedQuiz = await quizClient.findQuizById(qid as string);
                if (fetchedQuiz) {
                    const updatedQuizzes = [...quizzes.filter((q: any) => q._id !== qid), fetchedQuiz];
                    dispatch(setQuizzes(updatedQuizzes));
                } else {
                    setError("Quiz not found. Please check if this quiz exists.");
                }
            } catch (error) {
                console.error("Error loading quiz:", error);
                setError("Failed to load quiz data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        
        loadQuizData();
    }, [qid, quiz, quizzes, dispatch]);
    
    if (isLoading) {
        return <div className="alert alert-info mt-4 container">Loading quiz data...</div>;
    }
    
    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    {error}
                    <div className="mt-3">
                        <button 
                            className="btn btn-outline-primary" 
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <EditorLayout>
            <Routes>
                <Route path="/" element={<Navigate to="Details" />} />
                <Route path="/Details" element={<Details />} />
                <Route path="/Questions" element={<Questions />} />
            </Routes>
        </EditorLayout>
    )
}