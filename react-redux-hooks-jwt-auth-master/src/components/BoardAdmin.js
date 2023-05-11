import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Button from "./Table/Button";

import { useHistory } from "react-router-dom";
import Courses from "./Courses";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const history = useHistory();

  const addCourseHandler = () =>{
    let path = `/addCourse`; 
    history.push(path);
  }
  const insertGradesHandler = () =>{
    let path = `/insertGrades`; 
    history.push(path);
  }



  return (
    <div className="container">
      <header className="jumbotron">
        <Button data="+ Add Course" type="secondary" handleOnClick={addCourseHandler}/>
        <Button data=" Insert grades" type="secondary" handleOnClick={insertGradesHandler}/>
        <br/>
        <br/>
        <br/>

        <h3>Courses</h3>
        <Courses />
      </header>
    </div>
  );
};

export default BoardAdmin;
