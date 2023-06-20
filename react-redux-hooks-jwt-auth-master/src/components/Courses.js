import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useDispatch, useSelector } from "react-redux";
import getCourses from '../services/teacher-service';
import { LOAD_COURSES } from "../actions/mod";

const Courses = () => {
  const user = useSelector((state) => state.auth.user.rows);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    setCourses(prevCourses => prevCourses.filter(course => (course.course_id ? course.course_id : course.id) !== idCourse));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter(course => {
    return course.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container">
      <header className="jumbotron">
        <div className="search-bar">
          <label htmlFor="searchInput" className="search-label">Search courses:</label>
          <input id="searchInput" type="text" placeholder="Enter a course name" value={searchTerm} onChange={handleSearch} className="search-input" />
        </div>
        <br/>
        <div className="course-list">
          {filteredCourses.map((course, id) => (
            <Course course={course} key={id} onRemove={handleCourseRemove} />
          ))}
        </div>
      </header>
    </div>
  );
};

export default Courses;
