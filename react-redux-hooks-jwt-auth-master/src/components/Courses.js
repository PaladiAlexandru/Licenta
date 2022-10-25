import React, { useEffect, useState } from "react";
import Course from "./Course";

import { useDispatch, useSelector} from "react-redux"
import getCourses from '../services/teacher-service'
import { LOAD_COURSES } from "../actions/mod";

const Courses = () =>{

   const user= useSelector((state) => state.auth.user.rows)
   const [courses, setCourses]= useState([]); 
   getCourses(user[0].id).then(response => {
     console.log(response.data.rows);
   })
   debugger
   useEffect(() => {  
     let aux = [];
    user[0].id && getCourses(user[0].id).then(response => {
      response.data.rows.forEach(course => {
        aux.push(course);
        
      })
      setCourses(aux);
      
    })
   },[])
   
  return (
    <div className="container">
      <header className="jumbotron">
        {courses && courses.map((course,id) => (
          <Course courseName={`${course.name}`} key={id}/>
        ))}

      </header>
    </div>
  );

}

export default Courses;