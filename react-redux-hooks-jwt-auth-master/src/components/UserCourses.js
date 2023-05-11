import React, { useEffect, useState } from "react";
import UserCourse from "./UserCourse";
import store from '../store'

import { useDispatch, useSelector} from "react-redux"
import getCourses, { getAllCourses, removeCourse, joinCourse} from '../services/teacher-service'
import { LOAD_COURSES } from "../actions/mod";
import Modal from "./Modal";

const UserCourses = () =>{

   const user= useSelector((state) => state.auth.user?.rows)
   const [joinedCourses, setJoinedCourses] = useState([]);
   const [allCourses, setAllCourses] = useState([]);
  
   useEffect(() => {
    getAllCourses().then(response =>{
      
      setAllCourses(response.data);
      debugger
    })
    getCourses(user[0].id).then(response =>{
      setJoinedCourses(response.data);
      debugger
    })
  },[])

  useEffect(() => {
    debugger
    const filteredCourses = allCourses.filter(course => {
      return !joinedCourses.some((c) => c.course_id === course.id);
    });
    setAllCourses(filteredCourses);
  }, [joinedCourses])
  
 
  

  const handleJoinBtn = (e) => {
  const courseId = parseInt(e.currentTarget.id);
  
  // Make API call to join the course
  joinCourse(user[0].id, courseId);
  
  // Update the joinedCourses state
  allCourses.forEach(course =>{
    if(course.id == courseId){
      setJoinedCourses(prevState => [...prevState, course]);
    }
  })
  
  
  // Remove the course from allCourses state
  setAllCourses(prevState => prevState.filter(course => course.id !== courseId));
};

const handleLeaveBtn = (e) => {
  const courseId = parseInt(e.currentTarget.id);
  debugger
  // Make API call to leave the course
  removeCourse(user[0].id, courseId);
  
  // Update the joinedCourses state
  setJoinedCourses(prevState => prevState.filter(course => course.course_id !== courseId));
  
  // Add the course back to allCourses state
  getAllCourses().then(response => {
    setAllCourses(response.data.filter(course => !joinedCourses.some(jc => jc.course_id === course.id)));
  });
  setJoinedCourses(prevState => prevState.filter(course => course.id !== courseId));
};

  
  return (
    <div className="container">
      <header className="jumbotron">
      
        {joinedCourses.length ? (<h3>Your courses</h3>): ""}
        {joinedCourses.length ? joinedCourses.map((course, id) => (
          <UserCourse courseName={`${course.name}`} key={id} owned={true} handleOnClick={handleLeaveBtn} id={course.id} />
        )): ""}

          {allCourses &&  (<h3>All courses</h3>) }
        {allCourses.length>0  && allCourses.map((course,id) => (
          <UserCourse courseName={`${course.name}`} key={id} owned={false} handleOnClick={handleJoinBtn} id={course.id}/>
        ))}
        
       
      
      </header>
      
    </div> 
  );

}

export default UserCourses;