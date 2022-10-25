import axios from "axios";

const API_URL = "http://localhost:3001/";

export  function ownedCourse(userId)  {
  
  
  return  axios.post(API_URL + "teacher/ownedCourse", { userId:userId });
};

export default function getCourses (index)  {
  
  return  axios.post(API_URL + "teacher/courses", { index:index });
};
export function addCourse (data)  {
  debugger
  return  axios.post(API_URL + "teacher/addCourse", { data });
};

export async function getUsers (courseName)  {
  
  return   await axios.post(API_URL + "teacher/getCourseUsers", { courseName });
};

export function getAllCourses ()  {
  
  return  axios.post(API_URL + "all/courses");
};

export function removeCourse (idUser,idCourse)  {
  
  return  axios.delete(API_URL + `user/removeCourse/${idUser}/${idCourse}` );
};

export function joinCourse (idUser,idCourse)  {
  
  return  axios.post(API_URL + `user/joinCourse/${idUser}/${idCourse}` );
};

export function addGrades (data)  {
  
  return  axios.post(API_URL + `teacher/sendGrades`,{data} );
};
