import React from "react";
import store from "../store";
const UserCourse = (props) =>{
    var {courseName, owned, handleOnClick, id} = props;
    debugger
    return ( <p><span className={`d-flex p-4 bg-info text-white font-weight-bold rounded`} style={{position: 'relative'}}>{courseName}                         
    {owned ? (<button type="button" className="btn btn-danger" onClick={(e) => handleOnClick(e)} id={id} style={{position: 'absolute',right:'5%'}}>Leave</button>):
    (<button type="button" className="btn btn-primary " onClick={(e) => handleOnClick(e)} id={id} style={{position: 'absolute',right:'5%'}}>Join</button>)}
    </span>
    </p>
  );

}

export default UserCourse;