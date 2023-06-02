import axios from "axios";

const API_URL = "http://localhost:3001/";

export  function ownedCourse(userId)  {
  
  console.log("userID:",userId)
  return  axios.post(API_URL + "teacher/ownedCourse", { userId:userId });
};

export default function getCourses (index)  {
  
  return  axios.post(API_URL + "teacher/courses", { index:index });
};
export function getProgression (idUser,idCourse)  {
  
  return  axios.post(API_URL + "getProgression", { idUser,idCourse });
};
export function addCourse (data)  {
  
  return  axios.post(API_URL + "teacher/addCourse", { data });
};
export function editCourse (data)  {
  debugger
  return  axios.post(API_URL + "teacher/editCourse", { data });
};

export async function getUsers (courseName)  {
  
  return   await axios.post(API_URL + "teacher/getCourseUsers", { courseName });
};
export async function getGradesType (courseId)  {
  
  return   await axios.post(API_URL + "teacher/getGradesType", { courseId });
};
export async function getAllUsers ()  {
  
  return   await axios.get(API_URL + "users");
};
export async function getMessages (receiverId,senderId)  {
  let response = await axios.get(API_URL + `messages/${receiverId}/${senderId}`);
  debugger
  return response.data;
};


export async function getCourse(data) {
  const response = await axios.post(API_URL + "teacher/getCourse", { data });
  return response.data;
}


export async function sendMessage(data) {
  const response = await axios.post(API_URL + "message/add", { data });
  return response.data;
}



export function getAllCourses ()  {
  
  return  axios.post(API_URL + "all/courses");
};

export function removeCourse (idUser,idCourse)  {
  
  return  axios.delete(API_URL + `user/removeCourse/${idUser}/${idCourse}` );
};
export function deleteCourse (idCourse)  {
  
  return  axios.delete(API_URL + `user/deleteCourse/${idCourse}` );
};

export function joinCourse (idUser,idCourse)  {
  console.log("idUser: ",idUser,"idCourse: ",idCourse)
  return  axios.post(API_URL + `user/joinCourse/${idUser}/${idCourse}` );
};

export function addGrades (data)  {
  
  return  axios.post(API_URL + `teacher/sendGrades`,{data} );
};
