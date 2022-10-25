import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import getCourses, { ownedCourse } from "../../services/teacher-service";
import FeedItem from "./FeedItem";
import { check } from "./utils";


const GradesUsersPage = () =>{
  

  const handleViewGradesBtn =(e) => {
    console.log("Afiseaza notele");
  }
  const user= useSelector((state) => state.auth.user.rows)
  const [data, setData]= useState([]); 
 
 
  useEffect(() => {
    let aux = [];
   user[0].id && getUsersGrades(user[0].id).then(response => {
     response.data.rows.forEach(course => {
       aux.push(course);
       
     })
     setData(aux);
     
   })
  
  },[])

  useEffect(() => {
    
    
    let aux = [];
    
   user[0].id && courses.length !== 0 && 
        ownedCourse(user[0].id).then(resp =>{
          resp.data.forEach(crse => {
            
            const found = courses.find(element => element.id == crse.id_course);
            if (found != "undefined"){
                  aux.push(found);
            }
          
            
              
            
          
          })
          setAllCourses(aux);
        
        })
      
  
   
   
  },[courses])
  
  
  return (
    <div className="container">
      <header className="jumbotron">
      { allCourses && allCourses.map((course,id) => (
          <FeedItem courseName={course.name} handleOnClick={handleViewGradesBtn} courseId={course.id} key={id}/>
        ))}
        
      </header>
      
    </div>
    
  );

}

export default GradesUsersPage;