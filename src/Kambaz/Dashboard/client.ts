import axios from "axios";
const REMOTE_SERVER = import.meta.env.REACT_APP_REMOTE_SERVER || "http://localhost:4000";
const ENROLLMENT_API = `${REMOTE_SERVER}/api/enrollments`;

export const fetchAllEnrollments = async () => {
    const { data } = await axios.get(ENROLLMENT_API);
    return data;
};
export const unenrollInCourse = async (userId: string, courseId: string) => {
    const { data } = await axios.delete(`${ENROLLMENT_API}/${userId}/${courseId}`);
    return data;
};
export const enrollInCourse = async (userId: string, courseId: string) => {
    const enroll = {userId: userId, courseId: courseId};
    const { data } = await axios.post(ENROLLMENT_API, enroll);
    return data
}