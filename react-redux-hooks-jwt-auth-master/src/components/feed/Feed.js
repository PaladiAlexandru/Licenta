import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import getCourses, { ownedCourse } from "../../services/teacher-service";
import FeedItem from "./FeedItem";
import store from '../../store'

import { useHistory } from "react-router-dom";

const Feed = () =>{
  const history = useHistory();

  const handleViewGradesBtn =(e) => {
    debugger
      store.dispatch({type: "LOAD_GRADES",payload: e.currentTarget.id})
      
        let path = `/GradesUsers`;
        
        history.push(path);
        
  }  
  

  const user= useSelector((state) => state.auth.user.rows)
  const [courses, setCourses]= useState([]); 
  const [allCourses, setAllCourses] = useState([]);  
 
 
  useEffect(() => {
    let aux = [];
   
   user[0].id && getCourses(user[0].id).then(response => {
   
     
     setCourses(response.data);
     
   })
  
  },[])

  useEffect(() => {
    
    let aux = [];
    if (user[0].id && courses?.length !== 0) {
      ownedCourse(user[0].id).then(resp => {
        resp.data.forEach(crse => {
        
          const found = courses?.find(element => element.course_id == crse.id_course);
          if (found !== undefined) {
            aux.push(found);
          }
        });
        setAllCourses(aux);
      });
    }
  }, [courses]);
  debugger
  
  return (
    <div className="container">
      <header className="jumbotron">
      { allCourses.length > 0 && allCourses.map((course,id) => (
          
          course.name !='undefined'? (<FeedItem courseName={course.name} handleOnClick={handleViewGradesBtn} courseId={course.course_id} key={id}/>): console.log(course)
        ))}
        
      </header>
      
    </div>
    
  );

}

export default Feed;