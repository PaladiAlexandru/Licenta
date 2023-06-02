import React, { useEffect, useState } from "react";
import { addCourse, addGrades, getGradesType, getUsers } from '../services/teacher-service';
import { useSelector } from "react-redux";
import getCourses from '../services/teacher-service'
import Table from '../components/Table/Table'
import Button from "./Table/Button";
import NoStudentsCard from "./NoStudentsCard";
import TableInsertGrades from'./TableInsertGrades.js';
import "./InsertGrades.css"

import { useHistory } from "react-router-dom";

const InsertGrades = (props) => {
  const colNames = ['Name', 'Grade']
  const user = useSelector((state) => state.auth.user.rows)
  const [users, setUsers] = useState([]);
  const [updatedUsers,setUpdatedUsers] = useState([]);
  const [course, setCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [allGradeTypes, setAllGradeTypes] = useState([]);
  const [gradeType, setGradeType] = useState(''); // added state for grade type
  const [isCourseSelected,setCourseSelected] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // Notification state
  const [notificationMessage, setNotificationMessage] = useState(""); // Notification message state
  const history = useHistory();

  getCourses(user[0].id).then(response => {
    console.log(response.data.rows);
  })

  useEffect(() => {
    let aux = [];
    user[0].id && getCourses(user[0].id).then(response => {
     
      response.data.forEach(course => {
        aux.push(course);
      })
      setCourses(aux);
    })
  }, [])
 

  useEffect(() => {
    let aux = [];
    course && getUsers(course.name).then(response => {
      
      response.data.forEach(user => {
        aux.push(user);
        
      })
      setUsers(aux);
      
      
      

    })
    
    

  }, [course])

  useEffect(() => {
    course && getGradesType(course.course_id).then(response => {
      let aux2 = [];
      const existingGradeTypes = new Set(); // Create a set to store existing grade types
  
      response.data.rows.forEach(grade => {
        if (!existingGradeTypes.has(grade.grade_type)) {
          aux2.push(grade);
          existingGradeTypes.add(grade.grade_type); // Add the grade type to the set
        }
      });
  
      setAllGradeTypes(aux2);
    });
  }, [course]);
  
  useEffect(() => {
    if (allGradeTypes.length > 0 && gradeType !== '') {
      const fetchData = async () => {
        const updatedUsersCopy = [...users];
  
        for (let i = 0; i < updatedUsersCopy.length; i++) {
          const user = updatedUsersCopy[i];
  
          try {
            const response = await getGradesType(course.course_id); // Assuming getGradesType fetches individual user grades based on the course ID
            const grades = response.data.rows;
  
            for (let j = 0; j < grades.length; j++) {
              const grade = grades[j];
  
              if (grade.grade_type === gradeType && grade.id_user === user.user_id) {
                updatedUsersCopy[i].existingGrade = grade.grade;
                break;
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
  
        setUpdatedUsers(updatedUsersCopy);
      };
  
      fetchData();
    }
  }, [users, gradeType, allGradeTypes, course]);
  

  
  

  useEffect(()=>{
    let v = updatedUsers
    debugger
   
  },[updatedUsers])

  useEffect(()=>{
    let sp = users
    let vt = course


  },[users,course])
  
 

  const fillInput = (e) => {
    const crs = courses.find(crs => crs.name == e.currentTarget.childNodes[0].data)
    setCourse(crs);
    console.log(e);
    
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
    let data = [];

    users.forEach(user1 => {
      let info = {
        courseId: user1.course_id,
        userId: user1.user_id,
        grade: parseInt(document.getElementById(user1.name).value),
        owner: user[0].id,
        idGrade: 0
      };

      allGradeTypes.forEach(grade => {
        if (grade.grade_type === gradeType) {
          info.idGrade = grade.grade_id;
        }
      });

      data.push(info);
    });

    addGrades(data)
      .then(() => {
        setNotificationMessage("Grades have been inserted.");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          // Redirect to "/admin" after notification disappears
          history.push("/admin");
        }, 2000);
      })
      .catch(error => {
        console.error(error);
        setNotificationMessage("Failed to insert grades.");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          // Redirect to "/admin" after notification disappears
          history.push("/admin");
        }, 2000);
      });
  };
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
          <div><h3>Second, choose the evaluation</h3></div>
          <button onClick={() => myFunction2() } disabled={!isCourseSelected} className="dropbtn" id="chooseGradeType">Choose the evaluation</button>
          <div id="myDropdown2" className="dropdown-content">
              {
               allGradeTypes&& allGradeTypes.map(grade =>(<a key={grade.grade_id} onClick={(e) => fillGradeType(e)}>{grade.grade_type}</a>) )
            

            }
            
           
          </div>
        </div>
      </header>
      <div className="col-md-6">
        {users.length > 0 ? 
            gradeType ?
              <div><TableInsertGrades
                colNames={colNames}
                data={updatedUsers}
              />
              <button onClick={(e) => handleSubmit(e)} type="button" className="btn btn-success" >Submit </button></div>
              : ""
              : course ? <NoStudentsCard />: ""
        }
         {showNotification && <div className="notification">{notificationMessage}</div>}
      </div>
    </div>
  )
}

export default InsertGrades;
