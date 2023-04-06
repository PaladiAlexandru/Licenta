import React, {useState} from "react";
import {addCourse} from '../services/teacher-service';
import { useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';

const AddCourse = (props) =>{
    const [checked1,setChecked1] = useState(false); 
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
    function checkFunc(e) {
      
      
      if (e.currentTarget.id == "gridRadios1") 
        setChecked1(false)
      else
        setChecked1(true)
    
  }
  function displayGrades(e){
    var number = e.currentTarget.value;
      var container = document.getElementById("OnTheWayContainer");
      
      // Remove every children it had before
      while (container.hasChildNodes()) {
        container.removeChild(container.lastChild);
    }
    for (var i=0;i<number;i++){
    
      // Create an <input> element, set its type and name attributes
      var input = document.createElement("input");
      var div = document.createElement("div");
      const ariaL = document.createAttribute("aria-label");
      const ariaD = document.createAttribute("aria-describedby");
      input.type = "text";
      input.className = "form-control";

      ariaL.value = "Small"
      ariaD.value = "inputGroup-sizing-sm";
      input.setAttributeNode(ariaL);
      input.setAttributeNode(ariaD);
      input.name = "member" + i;
      input.size = "1"
      input.placeholder="From 1 to 10, how much the grade values";
      var span = document.createElement("span")
      span.className = "input-group-text";
      span.id = "inputGroup-sizing-sm";
      span.innerHTML = "Grade " + (i+1);
      

      div.className = "input-group-prepend";
      div.style="padding:0.5em"
      div.appendChild(span)
      div.appendChild(input);
      container.appendChild(div);
    
  }
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
          <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="Evaluation along the way"  onClick={(e)=>checkFunc(e)} />
          <label className="form-check-label" htmlFor="gridRadios1">
            Evaluation along the way
          </label>
          <Form.Group className="mb-3" >
          <Form.Label>Number of grades</Form.Label>
          <Form.Control placeholder="num of grades" id='check' disabled={checked1} onInput={(e)=>displayGrades(e)}/>
          <div className="form-group" id="OnTheWayContainer">
              <div className="input-group input-group-sm mb-3">
              
              </div>
            </div>
          </Form.Group>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value=" Two tests + Final exam" onClick={(e)=>checkFunc(e)}/>
          <label className="form-check-label" htmlFor="gridRadios2">
            Two tests + Final exam
          </label>
        </div>
        <div className="form-check disabled">
          <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios3" value="One test + Final exam" onClick={(e)=>checkFunc(e)} />
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