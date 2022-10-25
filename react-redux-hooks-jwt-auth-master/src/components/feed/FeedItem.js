import React from "react";

const FeedItem = (props) =>{
    var {courseName, handleOnClick, courseId} = props;
    console.log("==============CourseName:" + courseName + "courseID" + courseId)
    return ( 
    <p>
        <span className={`d-flex p-4 bg-info text-white font-weight-bold rounded`} style={{position: 'relative'}}>
          {courseName}                         
    <button type="button" className="btn btn-danger" onClick={(e) => handleOnClick(e)} id={courseId} style={{position: 'absolute',right:'5%'}}>View info</button>
        </span>
    </p>
  );

}

export default FeedItem;