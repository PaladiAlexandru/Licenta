import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { deleteCourse } from "../services/teacher-service";

const Course = (props) => {
  const { course, onRemove } = props;
  const history = useHistory();
  const [isHovered, setIsHovered] = useState(false);

  const handleEditCourse = () => {
    // Redirect to /editCourse and pass the course as a prop
    history.push({
      pathname: "/editCourse",
      state: { course: course },
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleRemove = () => {
    deleteCourse(course.course_id ? course.course_id : course.id)
      .then(() => {
        onRemove(course.course_id ? course.course_id : course.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const underlineStyle = isHovered ? { textDecoration: "underline", cursor: "pointer" } : {};

  return (
    <p>
      <span
        className={`d-flex p-4 bg-info text-white font-weight-bold rounded`}
        style={{ position: "relative" }}
      >
        <span
          onClick={handleEditCourse}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={underlineStyle}
        >
          {course.name}
        </span>
        <button
          type="button"
          className="btn btn-danger"
          style={{ position: "absolute", right: "10%" }}
          onClick={handleRemove}
        >
          Remove
        </button>
      </span>
    </p>
  );
};

export default Course;
