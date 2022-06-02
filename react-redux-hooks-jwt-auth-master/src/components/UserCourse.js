import React from "react";

const UserCourse = (props) =>{
    var {courseName, owned, handleOnClick, id} = props;

    return ( <p><span className={`d-flex p-4 bg-info text-white font-weight-bold rounded`}>{courseName}                         
    {owned ? (<button type="button" className="btn btn-danger" onClick={(e) => handleOnClick(e)} id={id}>Leave</button>):
    (<button type="button" className="btn btn-primary " onClick={(e) => handleOnClick(e)} id={id}>Join</button>)}
    </span></p>
  );

}

export default UserCourse;