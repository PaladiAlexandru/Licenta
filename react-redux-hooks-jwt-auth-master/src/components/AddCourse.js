import React, { useState } from "react";
import { addCourse, getCourse } from '../services/teacher-service';
import { useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';
import { useRef } from "react";

const AddCourse = (props) => {
  const [checked1, setChecked1] = useState(true);
  const [oneTestChecked, setOneTestChecked] = useState(false);
  const [twoTestsChecked, setTwoTestsChecked] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [courseAdded, setCourseAdded] = useState(false); // Add state for whether the course has been added
  const [formSubmited, setFormSubmited] = useState(false);
  const formRef = useRef(null);
 

  const handleSubmit = async(event) => {
    event.preventDefault();
    let data = {
      name: document.getElementById("courseName").value,
      description: document.getElementById("courseDescription").value,
      type: '',
      final_exam: document.getElementById("examDate").value,
      teacher_id: currentUser.rows[0].id
    };
    const radioButtons = document.querySelectorAll('input[name="gridRadios"]');
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        data.type = radioButton.value;
        break;
      }
    }
    
    const localData = await getCourse(data);

    if (localData.rows.length === 0) {
      addCourse(data).then(() => setCourseAdded(true));
    } else {
      console.log("The course already exists!");
    }
    setFormSubmited(true);
    window.scrollTo({ top: formRef.current.scrollHeight, behavior: "smooth" });
  }
  function checkFunc(e) {
    setChecked1(false);
    setOneTestChecked(false);
    setTwoTestsChecked(false);

  }
  function handleTwoTestsCheck(e) {
    setChecked1(true)
    setOneTestChecked(false)
    setTwoTestsChecked(true);
  }
  function handleOneTestCheck(e) {
    setChecked1(true)
    setTwoTestsChecked(false);
    setOneTestChecked(true);
  }
  function displayGrades(e) {
    var number = e.currentTarget.value;
    var container = document.getElementById("OnTheWayContainer");

    // Remove every children it had before
    while (container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }
    for (var i = 0; i < number; i++) {

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
      input.placeholder = "From 1 to 10, how much the grade values";
      var span = document.createElement("span")
      span.className = "input-group-text";
      span.id = "inputGroup-sizing-sm";
      span.innerHTML = "Grade " + (i + 1);


      div.className = "input-group-prepend";
      div.style = "padding:0.5em"
      div.appendChild(span)
      div.appendChild(input);
      container.appendChild(div);

    }
  }


  return (
    <div className="container">
      <header className="jumbotron" >
        <form ref={formRef} style={{ alignItems: "left", display:"flow"}}>
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
                  <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="Evaluation along the way" onClick={(e) => checkFunc(e)} />
                  <label className="form-check-label" htmlFor="gridRadios1">
                    Evaluation along the way
                  </label>
                  <Form.Group className="mb-3" >
                    <Form.Label>Number of grades</Form.Label>
                    <Form.Control placeholder="num of grades" id='check' disabled={checked1} onInput={(e) => displayGrades(e)} />
                    <div className="form-group" id="OnTheWayContainer">
                      <div className="input-group input-group-sm mb-3">

                      </div>
                    </div>
                  </Form.Group>
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="radio" name="gridRadios" id="gridRadiosTwoTests" value="Two tests + Final exam" onClick={(e) => handleTwoTestsCheck(e)} />
                  <label className="form-check-label" htmlFor="gridRadiosTwoTests">
                    Two tests + Final exam
                  </label>
                  {twoTestsChecked && (
                    <Form.Group className="mb-3">
                      <div className="form-group" id="TwoTestsContainer">
                        <div className="mb-3">
                        <label className="form-check-label" htmlFor="grade11">Grade 1</label>
                          <input type="text" className="form-control" placeholder="From 1 to 10, how much the grade values" id="grade11"/>
                          <label className="form-check-label" htmlFor="grade12">Grade 2</label>
                          <input type="text" className="form-control" placeholder="From 1 to 10, how much the grade values" id="grade12"/>
                          <label className="form-check-label" htmlFor="grade13">Final exam</label>
                          <input type="text" className="form-control" placeholder="From 1 to 10, how much the final exam values" id="grade13"/>
                        </div>
                      </div>
                    </Form.Group>
                  )}
                </div>

                <div className="form-check">
                  <input className="form-check-input" type="radio" name="gridRadios" id="gridRadiosOneTest" value="One test + Final exam" onClick={(e) => handleOneTestCheck(e)} />
                  <label className="form-check-label" htmlFor="gridRadiosOneTest">

                    One test + Final exam
                  </label>
                  <Form.Group className="mb-3" >
                    <div className="form-group" id="OneTestContainer">
                      <div className="mb-3">

                      {oneTestChecked && (
  <Form.Group className="mb-3">
    <div className="form-group" id="TwoTestsContainer">
      <div className="mb-3">
        <div style={{ display: 'block' }}>
          <label className="form-check-label" htmlFor="grade1">
            Grade 1:
          </label>
          <input type="text" className="form-control" placeholder="From 1 to 10, how much the grade values" id="grade1" />
        </div>
        <div style={{ display: 'block' }}>
          <label className="form-check-label" htmlFor="finalExam1">
            Final exam:
          </label>
          <input type="text" className="form-control" placeholder="From 1 to 10, how much the final exam values" id="finalExam1" />
        </div>
      </div>
    </div>
  </Form.Group>
)}

                      </div>
                    </div>
                  </Form.Group>
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
          <button type="submit" className="btn btn-success" onClick={handleSubmit}>Submit</button>
          {formSubmited && (
  <div
    className={`card text-white ${
      courseAdded ? 'bg-success' : 'bg-danger'
    }`}
    style={{ maxWidth: '18rem', textAlign: 'left' }}
  >
    <div className="card-header">{courseAdded ? 'Success!' : 'Error!'}</div>
    <div className="card-body">
      
      <div className="card-text">
        {courseAdded ? 'Course added' : 'Course already exists'}
      </div>
    </div>
  </div>
)}


        </form>
      </header>
    </div>
  );

}


export default AddCourse;