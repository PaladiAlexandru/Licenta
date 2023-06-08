import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import { useHistory } from "react-router-dom";
import Courses from "./Courses";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const history = useHistory();

  const addCourseHandler = () => {
    let path = `/addCourse`;
    history.push(path);
  };
  
  const insertGradesHandler = () => {
    let path = `/insertGrades`;
    history.push(path);
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <button
          className="btn btn-secondary"
          style={{ backgroundColor: "#526D82", padding: "10px 20px" }}
          onClick={addCourseHandler}
        >
          + Add Course
        </button>
       
        <br />
        <br />
        <br />

        <h3>Courses</h3>
        <Courses />
      </header>
    </div>
  );
};

export default BoardAdmin;
