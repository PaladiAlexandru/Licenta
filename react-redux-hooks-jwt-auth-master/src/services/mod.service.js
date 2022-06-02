import axios from "axios";

const API_URL = "http://localhost:3001/";



export function removeProf (index)  {
  
  return axios.post(API_URL + "remove/prof", { index:index });
};
export function addProf (index)  {
  
  return axios.post(API_URL + "add/prof", { index:index });
};



