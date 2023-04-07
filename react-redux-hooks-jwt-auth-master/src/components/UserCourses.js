import React, { useEffect, useState } from "react";
import UserCourse from "./UserCourse";
import store from '../store'

import { useDispatch, useSelector} from "react-redux"
import getCourses, { getAllCourses, removeCourse, joinCourse} from '../services/teacher-service'
import { LOAD_COURSES } from "../actions/mod";
import Modal from "./Modal";
// import { setExpectation } from "../services/progression-service";
const UserCourses = () =>{

   const user= useSelector((state) => state.auth.user.rows)
   const [courses, setCourses]= useState([]); 
   const [allCourses, setAllCourses] = useState([]);
   const [modal,setModal] = useState(false)
   const [localCourseId,setLocalCourseId] = useState([]);
   useEffect(() => {
    
    let aux = [];
    let bol = 1;
   user[0].id && getCourses(user[0].id).then(response => {
     response.data.rows.forEach(course => {
         aux.push(course);
     })
     setCourses(aux);
     
   })
  },[])

  


   useEffect(() => {
    let aux = [];
    let bol=1;
   user[0].id && getAllCourses().then(response => {
    
     response.data.forEach(course => {
     
       courses && courses.every(course2 => {
         bol=1;
        
        if(course2.id === course.id){
          bol=0;
          return false;
        }
        return true;
       })
       if(bol === 1)
        aux.push(course);
       
       
     })
     
     setAllCourses(aux);
     
   })
  },[courses])

  const closeModalLocal = (par) =>{
    debugger
    setModal(par)

  }
  const handleSubmitBtn =(e) => {
  e.preventDefault();
  debugger
  const data={
    idUser: user[0].id,
    idCourse: localCourseId
    // expectation: e.target.courseGrade.value
  };

  // setExpectation(data)
  // setModal(false)
  }

   
  const handleJoinBtn =(e) => {
    debugger
    setLocalCourseId(e.currentTarget.id);
    // setModal(true);
    joinCourse(user[0].id,e.currentTarget.id);
    let aux=[];
    courses.forEach(course => {
      aux.push(course);
    })
    
    allCourses.forEach(course => {
      
      if(course.id === parseInt(e.target.id)){
          aux.push(course);
      }
    })

    setCourses(aux);
    
  }
  
  const handleLeaveBtn =(e) => {
    removeCourse(user[0].id,e.currentTarget.id);

    let aux=[];
    courses.forEach(course => {
      debugger
      if(course.id !==parseInt(e.target.id)){
          aux.push(course);
      }
    })

    setCourses(aux);
  }
  
  return (
    <div className="container">
      <header className="jumbotron">
      
        {courses  && (<h3>Your courses</h3>)}
        {courses  && courses.map((course,id) => (
          <UserCourse courseName={`${course.name}`} key={id} owned={true} handleOnClick={handleLeaveBtn} id={course.id} />
        ))}

          {allCourses &&  (<h3>All courses</h3>) }
        {allCourses  && allCourses.map((course,id) => (
          <UserCourse courseName={`${course.name}`} key={id} owned={false} handleOnClick={handleJoinBtn} id={course.id}/>
        ))}
        
       {modal && <Modal closeModal={closeModalLocal} joinBtnHandler={handleSubmitBtn} />} 
      
      </header>
      
    </div> 
  );

}

export default UserCourses;