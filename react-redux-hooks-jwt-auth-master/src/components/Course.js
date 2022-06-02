import React from "react";

const Course = (props) =>{
    var {courseName} = props;

    return ( <p><span className={`d-flex p-4 bg-info text-white font-weight-bold rounded`}>{courseName}                         
    
    <button type="button" className="btn btn-primary ">Edit</button>
    <button type="button" className="btn btn-danger ">Remove</button></span></p>
  );

}

export default Course;