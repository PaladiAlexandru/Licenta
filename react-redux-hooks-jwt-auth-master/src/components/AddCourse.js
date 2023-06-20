import React, { useEffect, useState } from "react";
import { addCourse, getCourse } from '../services/teacher-service';
import { useSelector } from "react-redux";
import Form from 'react-bootstrap/Form';
import { useRef } from "react";
import "./AddCourse.css"
import { useHistory } from "react-router-dom";


const AddCourse = (props) => {
  const [checked1, setChecked1] = useState(true);
  const [onTheWayChecked, setOnTheWayChecked] = useState(false);
  const [oneTestChecked, setOneTestChecked] = useState(false);
  const [twoTestsChecked, setTwoTestsChecked] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [courseAdded, setCourseAdded] = useState(false);
  const [formSubmited, setFormSubmited] = useState(false);
  const [isGradePercentageValid, setIsGradePercentageValid] = useState(true);
  const [examDate, setExamDate] = useState(''); // State variable for exam date
  const [courseName, setCourseName] = useState(''); // State variable for course name
  const [courseDescription, setCourseDescription] = useState(''); // State variable for course description
  const formRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    if (checked1)
      document.getElementById("check").value = 0;
  }, [checked1]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = {
      name: courseName,
      description: courseDescription,
      type: '',
      final_exam: examDate,
      teacher_id: currentUser.rows[0].id,
      nr_of_grades: 0,
      weights: []
    };

    const radioButtons = document.querySelectorAll('input[name="gridRadios"]');
    for (const radioButton of radioButtons) {
      if (radioButton.checked) {
        data.type = radioButton.value;
        break;
      }
    }

    if (data.type === "Final exam only") {
      data.nr_of_grades = 1;
      data.weights.push(100);
    } else {
      data.nr_of_grades = document.getElementById("check").value;
      for (var j = 0; j < data.nr_of_grades; j++) {
        data.weights.push(document.getElementsByName("member" + j)[0].value);
      }
    }

    const localData = await getCourse(data);

    if (localData.rows.length === 0) {
      debugger
      addCourse(data).then(() =>{
        setCourseAdded(true);
        setFormSubmited(true);
        setTimeout(() => {
          history.push("/admin");
        }, 1000);
      });
    } else {
      console.log("The course already exists!");
    }

    setFormSubmited(true);
    window.scrollTo({ top: formRef.current.scrollHeight, behavior: "smooth" });
  };

  function checkFunc(e) {
    setChecked1(false);
    setOneTestChecked(false);
    setTwoTestsChecked(false);
  }

  function handleTwoTestsCheck(e) {
    setChecked1(true);
    displayGrades(0);
    setOneTestChecked(false);
    setTwoTestsChecked(true);
  }

  function displayGrades(number) {
    var container = document.getElementById("OnTheWayContainer");

    // Remove any existing children
    while (container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }

    for (var i = 0; i < number; i++) {
      // Create a <label> element for the grade
      var label = document.createElement("label");
      label.innerHTML = "Grade " + (i + 1) + " (Weight %)";
      label.className = "grade-label text-muted";
      label.style.marginBottom = "0"; // Remove margin bottom for the label

      // Create an <input> element, set its type and name attributes
      var input = document.createElement("input");
      input.type = "text";
      input.className = "form-control short-input"; // Add custom CSS class for shorter input boxes
      input.value = ""; // Set initial value as empty
      input.name = "member" + i;

      var inputGroup = document.createElement("div");
      inputGroup.className = "input-group mb-3";
      inputGroup.appendChild(label);

      var inputGroupAppend = document.createElement("div");
      inputGroupAppend.className = "input-group-append";
      var span = document.createElement("span");
      span.className = "input-group-text";
      span.innerHTML = "<b>%</b>";

      inputGroupAppend.appendChild(span);
      inputGroup.appendChild(input);
      inputGroup.appendChild(inputGroupAppend);

      var div = document.createElement("div");
      div.className = "input-group-prepend";
      div.appendChild(inputGroup);

      container.appendChild(div);
    }

    // Update the label for the last input to "Final exam"
    if (number > 0) {
      var lastLabel = container.children[number - 1].querySelector("label");
      lastLabel.innerHTML = "Final exam (Weight %)";
      lastLabel.className = "final-exam-label text-muted";
    }

    // Attach event listener to input fields
    var inputs = container.querySelectorAll("input");
    for (var j = 0; j < inputs.length; j++) {
      inputs[j].addEventListener("input", handleInputChange);
    }
  }

  function validateGradePercentages() {
    var container = document.getElementById("OnTheWayContainer");
    var inputs = container.querySelectorAll("input");
    var totalPercentage = 0;

    for (var i = 0; i < inputs.length; i++) {
      var percentage = parseInt(inputs[i].value);

      if (isNaN(percentage)) {
        return false; // Return false if any input is not a valid number
      }

      totalPercentage += percentage;
    }

    return totalPercentage === 100;
  }

  function handleInputChange() {
    var isPercentageValid = validateGradePercentages();
    setIsGradePercentageValid(isPercentageValid);
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <form ref={formRef} style={{ alignItems: "left", display: "flow" }}>
          <div className="form-group row">
            <label htmlFor="courseName" className="col-sm-2 col-form-label">*Course name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="courseName" placeholder="Course name" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="courseDescription" className="col-sm-2 col-form-label">*Description</label>
            <div className="col-sm-10">
              <textarea id="courseDescription" className="form-control" aria-label="A description of the course" value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)}></textarea>
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
                  <Form.Group className="mb-3">
                    <Form.Label>Number of grades</Form.Label>
                    <Form.Control placeholder="num of grades" id='check' disabled={checked1} onInput={(e) => displayGrades(e.currentTarget.value)} />
                    <div className="form-group" id="OnTheWayContainer">
                      <div className="input-group input-group-sm mb-3">

                      </div>
                    </div>
                    {!isGradePercentageValid && (
                      <div className="alert alert-danger mt-2">
                        Grade percentages should add up to 100%
                      </div>
                    )}
                  </Form.Group>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="gridRadios" id="gridRadiosFinalExam" value="Final exam only" onClick={(e) => handleTwoTestsCheck(e)} />
                  <label className="form-check-label" htmlFor="gridRadiosFinalExam">
                    Final exam only
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          <div className="form-group row">
            <label htmlFor="examDate" className="col-sm-2 col-form-label">Final exam date</label>
            <div className="col-sm-10">
              <input type="date" className="form-control" id="examDate" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-success" onClick={handleSubmit} disabled={!examDate || !courseName || !courseDescription}>Submit</button>
          {formSubmited && (
            <div className={`card text-white ${courseAdded ? 'bg-success' : 'bg-danger'}`} style={{ maxWidth: '18rem', textAlign: 'left', marginTop: '10px'  }}>
              <div className="card-header">{courseAdded ? 'Success!' : 'Error!'}</div>
              <div className="card-body">
                <div className="card-text" >
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
