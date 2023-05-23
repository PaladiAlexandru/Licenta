import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { getProgression } from "../services/teacher-service";

const UserCourse = (props) => {
  const { courseName, owned, handleOnClick, id, progression} = props;
  const userId = JSON.parse(localStorage.getItem("user"))?.rows[0]?.id;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [testsTaken, setTestsTaken] = useState([]);

 

  useEffect(() => {
    
    if (progression?.length > 0) {
      
      progression.forEach((item) => {
        if (item.id === id) {
          const lastCharacter = item.grade_type.slice(-1);
          setCurrentStep(lastCharacter);
        }
      });

      const updatedTestsTaken = progression.map((item) => item.grade_type);
      setTestsTaken(updatedTestsTaken);
    }
  }, [progression]);

  return (
    <div
      className={`d-flex p-4 bg-info text-white font-weight-bold rounded`}
      style={{ position: "relative", marginTop: "10px" }}
    >
      <Link to="/GradesUsers" style={{ color: "white" }}>
        {courseName}
      </Link>

      {currentStep !== 0 && owned && progression&& progression[0] && (
  <ProgressBar
    currentStep={currentStep}
    testsTaken={testsTaken}
    numberOfGrades={progression[0].nr_of_grades}
  />
) }


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
