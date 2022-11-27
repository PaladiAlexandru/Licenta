import React from "react";

const Course = (props) =>{
    var {courseName} = props;

    return ( <p><span className={`d-flex p-4 bg-info text-white font-weight-bold rounded`} style={{position: 'relative'}}>{courseName}                         
    
    <button type="button" className="btn btn-primary " style={{position: 'absolute',right:'20%'}}>Edit</button>
    <button type="button" className="btn btn-danger " style={{position: 'absolute',right:'10%'}}>Remove</button></span>
    </p>
    
  );

}

export default Course;
