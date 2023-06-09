import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { getProgression } from "../services/teacher-service";
import { useDispatch } from "react-redux";

const UserCourse = (props) => {
  const { courseName, owned, handleOnClick, id, progression } = props;
  const userId = JSON.parse(localStorage.getItem("user"))?.rows[0]?.id;

  const [currentStep, setCurrentStep] = useState(0);
  const [testsTaken, setTestsTaken] = useState([]);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (progression?.length > 0) {
      progression.forEach((item) => {
        
        
        if (item.id === id) {
          if(item.grade != null){
            debugger
            if(item.grade_type != "Final exam"){
              const lastCharacter = item.grade_type.slice(-1);
              setCurrentStep(lastCharacter);
            }else{
              
              setCurrentStep(item.nr_of_grades)
            }
          }
          else{
              
            setCurrentStep(item.nr_of_grades)
          }
          
        }
        
       
      });

      const updatedTestsTaken = progression
  .filter(item => item.grade !== null)
  .map(item => item.grade_type);

      setTestsTaken(updatedTestsTaken);
    }
  }, [progression]);

  const handleCourseClick = (e) => {
    debugger
    dispatch({ type: "LOAD_GRADES", payload: e.currentTarget.id });

    let path = `/GradesUsers`;
    history.push(path);
  };

  return (
    <div
      className={`d-flex p-4 bg-info text-white font-weight-bold rounded`}
      style={{ position: "relative", marginTop: "10px" }}
    >
      <Link
        to="/GradesUsers"
        style={{ color: "white" }}
        onClick={handleCourseClick}
        id={id}
      >
        {courseName}
      </Link>

      {currentStep !== 0 && owned && progression && progression[0] && (
        <ProgressBar
          currentStep={currentStep}
          progression={progression}
          numberOfGrades={progression[0].nr_of_grades}
        />
      )}

      {owned ? (
        <button
          type="button"
          className="btn btn-danger"
          onClick={(e) => handleOnClick(e, id)}
          id={id}
          style={{ position: "absolute", right: "5%" }}
        >
          Leave
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => handleOnClick(e, id)}
          id={id}
          style={{ position: "absolute", right: "5%" }}
        >
          Join
        </button>
      )}
    </div>
  );
};

export default UserCourse;
