import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.REACT_APP_REMOTE_SERVER || "http://localhost:4000";
const ANSWERS_API = `${REMOTE_SERVER}/api/quizzes`;

export const createAttempt = async (attempt: any, quizId: string, userId: string) => {
    const { data } = await axiosWithCredentials.post(`${ANSWERS_API}/${quizId}/answers/${userId}`, attempt);
    return data;
};

export const fetchAttemptForUser = async (userId: string) => {
    const { data } = await axiosWithCredentials.get(`${ANSWERS_API}/answers/${userId}`);
    return data;
};

export const updateAttempt = async (attempt: any) => {
    const { data } = await axiosWithCredentials.put(`${ANSWERS_API}/answers/${attempt._id}`, attempt);
}