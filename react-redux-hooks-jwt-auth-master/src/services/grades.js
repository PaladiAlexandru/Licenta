import axios from "axios";

const API_URL = "http://localhost:3001/";

export  function getGrades(courseId,userId)  {
  debugger
  console.log("IN AIURL " + userId)
  return  axios.post(API_URL + "grades", { courseId:courseId ,userId});
};