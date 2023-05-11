import React, { useEffect, useState } from "react";
import { addCourse, addGrades, getUsers } from '../services/teacher-service';
import { useSelector } from "react-redux";
import getCourses from '../services/teacher-service'
import Table from '../components/Table/Table'
import Button from "./Table/Button";
import NoStudentsCard from "./NoStudentsCard";
//import './InsertGrades.css'
import TableInsertGrades from'./TableInsertGrades.js';
const colNames = ['Name', 'Grade']
const InsertGrades = (props) => {

  const user = useSelector((state) => state.auth.user.rows)
  const [users, setUsers] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [courses, setCourses] = useState([]);
  const [gradeType, setGradeType] = useState(''); // added state for grade type
  const [courseSelected,setCourseSelected] = useState(false);

  getCourses(user[0].id).then(response => {
    console.log(response.data.rows);
  })

  useEffect(() => {
    let aux = [];
    user[0].id && getCourses(user[0].id).then(response => {
      debugger
      response.data.forEach(course => {
        aux.push(course);
      })
      setCourses(aux);
    })
  }, [])

  useEffect(() => {
    let aux = [];
    courseName && getUsers(courseName).then(response => {
      
      response.data.forEach(user => {
        aux.push(user);
      })
      setUsers(aux);
      debugger
    })
  }, [courseName])

  const fillInput = (e) => {
    setCourseName(e.currentTarget.childNodes[0].data);
    console.log(e);
    debugger
    document.getElementById("chooseCourse").textContent = e.currentTarget.childNodes[0].data
    setCourseSelected(true);
    document.getElementById("myDropdown").classList.remove("show");
  }

  const fillGradeType = (e) => { // added function to set grade type
    setGradeType(e.currentTarget.childNodes[0].data);
    console.log(e);
    document.getElementById("chooseGradeType").textContent = e.currentTarget.childNodes[0].data
    document.getElementById("myDropdown2").classList.remove("show");
  }

  const myFunction = () => {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  const myFunction2 = () => { // added function for grade type dropdown
    document.getElementById("myDropdown2").classList.toggle("show");
  }

  function filterFunction() {
    var input, filter, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    let div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      let txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  const handleSubmit = (e) => {
    console.log("USERS:" + users)
    debugger
    let data = []

    users.forEach(user1 => {
      let info = {
        courseId: user1.course_id,
        userId: user1.id,
        grade: parseInt(document.getElementById(user1.name).value),
        gradeType: gradeType, // added grade type to info object
        owner: user[0].id
      }
      data.push(info);
    })
    addGrades(data);
  }

  return (
    <div className="container">
      <header className="jumbotron">
        <div className="dropdown">
          <div><h3>First, choose the course</h3></div>
          <button onClick={() => myFunction()} className="dropbtn" id="chooseCourse">Choose Course</button>
          <div id="myDropdown" className="dropdown-content">
            <input type="text" placeholder="Search.." id="myInput" onKeyUp={() => filterFunction()} />
            {courses.map(course => (
              <a key={course.id} onClick={(e) => fillInput(e)}>{course.name}</a>
            ))}
          </div>
          <div><h3>Second, choose the type of grade</h3></div>
          <button onClick={() => myFunction2() } disabled={!courseSelected} className="dropbtn" id="chooseGradeType">Choose Grade Type</button>
          <div id="myDropdown2" className="dropdown-content">
            <a onClick={(e) => fillGradeType(e)}>Test</a>
            <a onClick={(e) => fillGradeType(e)}>Exam</a>
          </div>
        </div>
      </header>
      <div className="col-md-6">
        {users.length > 0 ?
          <div><TableInsertGrades
            colNames={colNames}
            data={users}
          />
          <button onClick={(e) => handleSubmit(e)} type="button" className="btn btn-success" >Submit </button></div>: courseName? <NoStudentsCard />:""
        }
        
      </div>
    </div>
  )
}

export default InsertGrades;
