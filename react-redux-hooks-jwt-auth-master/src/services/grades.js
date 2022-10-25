import axios from "axios";

const API_URL = "http://localhost:3001/";

export  function getGrades(courseId)  {
  
  console.log("IN AIURL " + courseId)
  return  axios.post(API_URL + "grades", { courseId:courseId });
};