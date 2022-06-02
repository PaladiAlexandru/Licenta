import React from "react";
import {addCourse} from '../services/teacher-service';
import { useSelector } from "react-redux";

const AddCourse = (props) =>{

    const { user: currentUser } = useSelector((state) => state.auth);
    const handleSubmit =() =>{
        let data={ 
            name: document.getElementById("courseName").value,
            description: document.getElementById("courseDescription").value,
            type: '',
            final_exam: document.getElementById("examDate").value,
            teacher_id: currentUser.rows[0].id
        };
        const radioButtons = document.querySelectorAll('input[name="gridRadios"]');
        for(const radioButton of radioButtons){
            if(radioButton.checked){
                data.type = radioButton.value;
                break;
            }
        }
        addCourse(data);
        console.log(data)


    }
    
    return ( 
        <div className="container">
      <header className="jumbotron">
        <form>
  <div className="form-group row">
    <label htmlFor="courseName" className="col-sm-2 col-form-label">*Course name</label>
    <div className="col-sm-10">
      <input type="text" className="form-control" id="courseName" placeholder="Course name" />
    </div>
  </div>
  <div className="form-group row">
  <label htmlFor="courseDescription" className="col-sm-2 col-form-label">*Description</label>
  <div className="col-sm-10">
  <textarea id="courseDescription" className="form-control" aria-label="A description of the course"></textarea>
  </div>
</div>
  <fieldset className="form-group">
    <div className="row">
      <legend className="col-form-label col-sm-2 pt-0">*Type of examination</legend>
      <div className="col-sm-10">
        <div className="form-check">
          <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="Evaluation along the way" defaultChecked />
          <label className="form-check-label" htmlFor="gridRadios1">
            Evaluation along the way
          </label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value=" Two tests + Final exam" />
          <label className="form-check-label" htmlFor="gridRadios2">
            Two tests + Final exam
          </label>
        </div>
        <div className="form-check disabled">
          <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="One test + Final exam"  />
          <label className="form-check-label" htmlFor="gridRadios3">
            One test + Final exam
          </label>
        </div>
        
      </div>
    </div>
  </fieldset>
  <div className="form-group row">
    <label htmlFor="examDate" className="col-sm-2 col-form-label">Final exam date</label>
    <div className="col-sm-10">
      <input type="date" className="form-control" id="examDate" />
    </div>
  </div>
  <div className="form-group row">
    <div className="col-sm-10">
      <button type="submit" className="btn btn-success" onClick={handleSubmit}>Submit</button>
    </div>
  </div>
</form>
</header>
</div>
  );

}

export default AddCourse;