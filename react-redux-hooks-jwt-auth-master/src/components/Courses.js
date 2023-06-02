import React, { useEffect, useState } from "react";
import Course from "./Course";

import { useDispatch, useSelector } from "react-redux";
import getCourses from '../services/teacher-service';
import { LOAD_COURSES } from "../actions/mod";

const Courses = () => {
  const user = useSelector((state) => state.auth.user.rows);
  const [courses, setCourses] = useState([]);


  useEffect(()=>{
    var x = courses
    debugger
  },[courses])
  useEffect(() => {
    if (user[0]?.id) {
      getCourses(user[0].id)
        .then(response => {
          if (response?.data)
            setCourses(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [user]);

  const handleCourseRemove = (idCourse) => {
    debugger
    setCourses(prevCourses => prevCourses.filter(course => {
      debugger
      return (course.course_id?course.course_id:course.id) !== idCourse
    }));
  };

  return (
    <div className="container">
      <header className="jumbotron">
        {courses && courses.map((course, id) => (
          <Course course={course} key={id} onRemove={handleCourseRemove} />
        ))}
      </header>
    </div>
  );
};

export default Courses;
