import React,{ useEffect, useState } from "react";
import {addCourse, addGrades, getUsers} from '../services/teacher-service';
import { useSelector } from "react-redux";
import getCourses from '../services/teacher-service'    
import { FilledInput } from "@material-ui/core";
import Table from '../components/Table/Table'
import Button from "./Table/Button";
const colNames = ['Name','Grade']
const InsertGrades = (props) =>{


    const user= useSelector((state) => state.auth.user.rows)
    const [users, setUsers] = useState([]);
    const [courseName, setCourseName] = useState('');
    const [courses, setCourses]= useState([]); 
    getCourses(user[0].id).then(response => {
      console.log(response.data.rows);
    })
   
    useEffect(() => {
      let aux = [];
     user[0].id && getCourses(user[0].id).then(response => {
       response.data.rows.forEach(course => {
         aux.push(course);
         
       })
       setCourses(aux);
       
     })
    },[])

    useEffect(() => {
      let aux = [];
      
     courseName && getUsers(courseName).then(response => {
      debugger
      response.data.forEach(user => {
        
        aux.push(user);
        
      })
      setUsers(aux);
      
    })
    },[courseName])

    const fillInput = (e) => {
      
      setCourseName(e.currentTarget.childNodes[0].data);
        console.log(e);
        document.getElementById("chooseCourse").textContent = e.currentTarget.childNodes[0].data
        document.getElementById("myDropdown").classList.remove("show");
       }
        

    

   const myFunction =() => {
        document.getElementById("myDropdown").classList.toggle("show");
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
        console.log(users)
        let data = []

        users.forEach(user1 => {
          let info={
            courseId: user1.course_id,
            userId: user1.id,
            grade: parseInt(document.getElementById(user1.name).value),
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
                <button onClick={() => myFunction()} className="dropbtn" id="chooseCourse">Choose course</button>
                    <div id="myDropdown" className="dropdown-content">
                        {courses && (courses.map(course => (
                                 <a onClick={(event) =>fillInput(event)} key={course.name} onKeyPress={()=>filterFunction()}>{course.name}</a>
                        ))
                            
                        )}
                        
                        
                    </div>
            </div>
            <br/>
            <br/>
            



            <table className="table table-dark"  >
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Grade</th>
    </tr>
  </thead>
  <tbody>
      {courseName ? 
          users?  (users.map((user,index) => (
        <tr key={index}>
        <td key={user.id}>{user.name}</td>
        <td><input id={user.name}></input></td>
        
      </tr>
          ))
                            
       ): (<tr><td>This course has no students</td></tr>) : ""
      }
  </tbody>
</table>
{courseName&& < Button data="Submit" type="success" id="awd22e23" handleOnClick={handleSubmit}/>}


        
            </header>
        </div>
  );

}

export default InsertGrades;