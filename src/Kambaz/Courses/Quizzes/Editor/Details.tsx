import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import * as quizClient from "../client";
import { updateQuiz, addQuiz } from "../reducer";

export default function Details() {
    const { cid, qid } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [quiz, setQuiz] = useState<any>({
        _id: qid || "New",  
        title: "",
        desc: "",
        type: "graded-quiz",
        group: "assignments",
        points: 0,
        questions: []
    });
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);

    const dateObjectToHtmlDateString = (date: Date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? 0 : ""}${date.getMonth() + 1
            }-${date.getDate() + 1 < 10 ? 0 : ""}${date.getDate() + 1}`;
    };

    const updateGlobalQuiz = async () => {
        try {
            if (!quiz.title) {
                setLoadingError("Please enter a quiz title");
                return;
            }

            let quizToSave = { ...quiz };
            if (qid === "New") {
                quizToSave.course = cid;
                quizToSave._id = new Date().getTime().toString();
                const status = await quizClient.createQuiz(quizToSave);
                dispatch(addQuiz(quizToSave));
            } else {
                const status = await quizClient.updateQuiz(quizToSave);
                dispatch(updateQuiz(quizToSave));
            }
            
            setHasChanges(false);
            navigate(`/Kambaz/Courses/${cid}/Quizzes`);
        } catch (error) {
            console.error("Error updating quiz:", error);
            setLoadingError("Failed to save. Please try again.");
        }
    };

    const handleChange = (field: string, value: any) => {
        setQuiz({ ...quiz, [field]: value });
        setHasChanges(true);
    };

    const handleNavigateToQuestions = () => {
        if (hasChanges) {
            dispatch(updateQuiz({...quiz, course: cid}));
            setHasChanges(false);
        }
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid === "New" ? quiz._id : qid}/Editor/Questions`);
    };

    const fetchQuizById = async (quizId: string) => {
        try {
            setIsLoading(true);
            setLoadingError(null);
            const fetchedQuiz = await quizClient.findQuizById(quizId);
            if (fetchedQuiz) {
                console.log("Fetched quiz by ID:", fetchedQuiz);
                setQuiz(fetchedQuiz);
                dispatch(updateQuiz(fetchedQuiz));
                setHasChanges(false);
            } else {
                console.error("Quiz not found with ID:", quizId);
                setLoadingError("Quiz not found - server returned empty data");
            }
        } catch (error) {
            console.error("Error fetching quiz:", error);
            setLoadingError("Error fetching quiz. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (qid !== "New") {
            fetchQuizById(qid);
        }
    }, [qid]);

    useEffect(() => {
        if (qid !== "New" && quizzes.length > 0 && !isLoading) {
            const currentQuiz = quizzes.find((q: any) => q._id === qid);
            if (currentQuiz) {
                console.log("Found quiz in Redux:", currentQuiz);
                setQuiz(currentQuiz);
                setLoadingError(null);
                setHasChanges(false);
            }
        }
    }, [quizzes, qid]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasChanges]);

    if (loadingError) {
        return (
            <div className="alert alert-danger mt-3">
                {loadingError}
                <button 
                    className="btn btn-sm btn-outline-danger ms-3" 
                    onClick={() => setLoadingError(null)}
                >
                    Close
                </button>
            </div>
        );
    }

    if (isLoading) {
        return <div className="alert alert-info">Loading quiz data...</div>;
    }

    return (
        <div className="container">
            
            <div className="row mx-3 mt-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Quiz Title" 
                    value={quiz?.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)} 
                    style={{ width: '100%' }} 
                    aria-label="Quiz Title"
                />
            </div>
            <div className="row mx-3 mt-2">
                <p>Quiz Instructions:</p>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Quiz Description" 
                    value={quiz?.desc || ""}
                    onChange={(e) => handleChange("desc", e.target.value)} 
                    style={{ width: '100%' }} 
                    aria-label="Quiz Description"
                />
            </div>
            <div className="row mx-3 mt-3">
                <div className="col-4 text-end mt-2">
                    <p >Quiz Type:</p>
                </div>
                <div className="col-4">
                    <select 
                        className="form-control" 
                        value={quiz?.type || "graded-quiz"}
                        onChange={(e) => handleChange("type", e.target.value)}
                        aria-label="Quiz Type"
                    >
                        <option value="graded-quiz">Graded Quiz</option>
                        <option value="practice-quiz">Practice Quiz</option>
                        <option value="graded-survey">Graded Survey</option>
                        <option value="ungraded-survey">Ungraded Survey</option>
                    </select>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Assignment Group:</p>
                </div>
                <div className="col-4">
                    <select className="form-control" value={quiz?.group || "assignments"}
                        onChange={(e) => setQuiz({ ...quiz, group: e.target.value })}>
                        <option value="assignments">Assignments</option>
                        <option value="quizzes">Quizzes</option>
                        <option value="exams">Exams</option>
                        <option value="project">Project</option>
                    </select>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-5 text-end mt-2">
                    <p><b>Options</b></p>
                </div>
            </div>
            <div className="row mx-1 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Shuffle Answers:</p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.shuffle || false}
                        onChange={(e) => setQuiz({ ...quiz, shuffle: !quiz.shuffle })}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Time Limit: </p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.time_limit !== "0"}
                        onChange={(e) => setQuiz({ ...quiz, time_limit: quiz.time_limit !== "0" ? "0" : "60" })}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Set Time Limit: </p>
                </div>
                {quiz?.time_limit !== "0" &&
                    <div className="col-6 d-flex align-items-center">
                        <input type="number" className="form-control" value={quiz?.time_limit || ""}
                            onChange={(e) => setQuiz({ ...quiz, time_limit: e.target.value })} style={{ width: 'auto' }}></input>
                        <label className="ms-2">Minutes </label>
                    </div>
                }
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Points: </p>
                </div>

                <div className="col-6 d-flex align-items-center">
                    <input type="number" className="form-control" value={quiz?.points || ""}
                        onChange={(e) => setQuiz({ ...quiz, points: e.target.value })} style={{ width: 'auto' }}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Show Correct Answers: </p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.show_correct_answers || false}
                        onChange={(e) => setQuiz({ ...quiz, show_correct_answers: !quiz.show_correct_answers })}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Access Code: </p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.access_code || false}
                        onChange={(e) => setQuiz({ ...quiz, access_code: !quiz.access_code })}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Set Access Code: </p>
                </div>
                {quiz?.access_code &&
                    <div className="col-6 d-flex align-items-center">
                        <input type="text" className="form-control" value={""}
                            onChange={(e) => e.target.value} style={{ width: 'auto' }}></input>
                    </div>
                }
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>One Question At A Time: </p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.one_question_at_a_time || false}
                        onChange={(e) => setQuiz({ ...quiz, one_question_at_a_time: !quiz.one_question_at_a_time })}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Webcam: </p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.webcam || false}
                        onChange={(e) => setQuiz({ ...quiz, webcam: !quiz.webcam })}></input>
                </div>
            </div>
            <div className="row mx-3 mt-2">
                <div className="col-4 text-end mt-2">
                    <p>Lock Questions After Answering: </p>
                </div>
                <div className="col-1 text-start mt-2">
                    <input className="mx-1" type="checkbox" checked={quiz?.lock_questions_after_answering || false}
                        onChange={(e) => setQuiz({ ...quiz, lock_questions_after_answering: !quiz.lock_questions_after_answering })}></input>
                </div>
            </div>

            <div className="row mx-3 mt-3">
                <div className="col-7 text-end px-3">
                    <div className="border border-secondary rounded px-5 float-end">
                        <input className="mx-1" type="checkbox" checked={quiz?.multiple_attempts || false}
                            onChange={(e) => setQuiz({ ...quiz, multiple_attempts: !quiz.multiple_attempts })}></input>
                        <label>Allow Multiple Attempts</label>
                    </div>
                </div>
            </div>
            {quiz?.multiple_attempts && (
                <div className="row mx-3 mt-2">
                    <div className="col-4 text-end mt-2">
                        <p>Number of Attempts Allowed: </p>
                    </div>
                    <div className="col-6 d-flex align-items-center">
                        <input 
                            type="number" 
                            className="form-control" 
                            value={quiz?.attempts || 3}
                            onChange={(e) => setQuiz({ ...quiz, attempts: parseInt(e.target.value) || 3 })} 
                            style={{ width: 'auto' }}
                            min="2"
                        />
                        <label className="ms-2">attempts</label>
                    </div>
                </div>
            )}
            <div className="row mx-3 mt-3">
                <div className="col-4 text-end mt-2">
                    <p>Assign:</p>
                </div>
                <div className="border border-secondary rounded col-sm-6">
                    <div className="row py-2 px-2">
                        <label className="col-form-label" htmlFor="assign-to">
                            Assign To
                        </label>
                        <select className="form-control">
                            <option value="everybody">Everybody</option>
                            <option value="nobody">Nobody</option>
                        </select>
                    </div>

                    <div className="row px-2">
                        <label className="row col-form-lable px-4" htmlFor="due-date">
                            Due
                        </label>
                        <input type="date" className="form-control"
                            id="due-date"
                            defaultValue={quiz?.due || ""}
                            onChange={(e) => setQuiz({ ...quiz, due: dateObjectToHtmlDateString(new Date(e.target.value)) })} />
                    </div>

                    <div className="row py-2">
                        <div className="col-sm-6">
                            <label className="row col-form-lable px-4" htmlFor="available-from">
                                Available From
                            </label>
                            <input type="date" className="form-control"
                                id="available-from" defaultValue={quiz?.available || ""}
                                onChange={(e) => setQuiz({ ...quiz, available: dateObjectToHtmlDateString(new Date(e.target.value)) })} />
                        </div>
                        <div className="col-sm-6">
                            <label className="row col-form-lable px-4" htmlFor="available-to">
                                To
                            </label>
                            <input type="date" className="form-control"
                                id="available-to" defaultValue={quiz?.due || ""} />
                        </div>
                        <div className="col-sm-6"></div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="float-end mx-2">
                <button className="btn btn-sm btn-secondary mx-2"
                    onClick={() => { navigate(`/Kambaz/Courses/${cid}/Quizzes`) }}>Cancel</button>
                <button className="btn btn-sm btn-primary mx-2"
                    onClick={() => { handleNavigateToQuestions(); }}>Next: Edit Questions</button>
                <button className="btn btn-sm btn-success"
                    onClick={() => { updateGlobalQuiz(); }}>Save</button>
            </div>
        </div>
    )
}