import React, { useEffect, useState } from "react";
import { addCourse, addGrades, getGradesType, getUsers } from '../services/teacher-service';
import { useSelector } from "react-redux";
import getCourses from '../services/teacher-service'
import Table from '../components/Table/Table'

import NoStudentsCard from "./NoStudentsCard";
import TableInsertGrades from'./TableInsertGrades.js';
import "./InsertGrades.css"
import { useLocation } from "react-router-dom";
import { Box, Button, MenuItem, FormControl, InputLabel, TextField } from '@material-ui/core';




import { useHistory } from "react-router-dom";
import { darkBaseTheme } from "material-ui/styles";

const InsertGrades = (props) => {
  const colNames = ['Name', 'Grade']
  const user = useSelector((state) => state.auth.user.rows)
  const [users, setUsers] = useState([]);
  const [updatedUsers,setUpdatedUsers] = useState([]);
  
  const [courses, setCourses] = useState([]);
  const [allGradeTypes, setAllGradeTypes] = useState([]);
  const [gradeType, setGradeType] = useState(''); // added state for grade type
  const [isCourseSelected,setCourseSelected] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // Notification state
  const [notificationMessage, setNotificationMessage] = useState(""); // Notification message state
  const history = useHistory();
  const location = useLocation();
  const course = location.state?.course;
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
    if (allGradeTypes.length > 0 && gradeType.grade_type !== '') {
      const fetchData = async () => {
        const updatedUsersCopy = JSON.parse(JSON.stringify(users)); // Deep copy of the users array
      
        for (let i = 0; i < updatedUsersCopy.length; i++) {
          const user = updatedUsersCopy[i];
      
          try {
            const response = await getGradesType(course.course_id);
            const grades = response.data.rows;
      
            for (let j = 0; j < grades.length; j++) {
              const grade = grades[j];
      
              if (grade.grade_type === gradeType.grade_type && grade.id_user === user.user_id) {
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
    
   
  },[updatedUsers])

  useEffect(()=>{
    let sp = users
    let vt = course


  },[users,course])
  
 

  const fillInput = (e) => {
    
    setCourseSelected(true);
    document.getElementById("myDropdown").classList.remove("show");
  }

  const fillGradeType = (event) => {
    setGradeType(event.target.value);
  
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
        if (grade.grade_type === gradeType.grade_type) {
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
    <Box container spacing={2}>
      <h3>Course name: {course.name}</h3>

      <Box item xs={12}>
        <FormControl fullWidth>
          <TextField
            select
            label="Choose the evaluation"
            value={gradeType}
            onChange={fillGradeType}
            style={{ paddingBottom: "16px" }}
          >
            {allGradeTypes.map((grade) => (
              <MenuItem key={grade.grade_id} value={grade}>
                {grade.grade_type}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Box>

      <Box item xs={12}>
        {users.length > 0 && gradeType.grade_type && (
          <>
            <TableInsertGrades colNames={colNames} data={updatedUsers} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
          </>
        )}

        {users.length === 0 && course && <NoStudentsCard />}
      </Box>

      {showNotification && (
        <Box item xs={12} className="notification">
          {notificationMessage}
        </Box>
      )}
    </Box>
  )
}

export default InsertGrades;
