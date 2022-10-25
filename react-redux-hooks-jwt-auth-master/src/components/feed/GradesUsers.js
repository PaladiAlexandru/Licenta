import React, {useEffect, useState} from 'react'
import store from '../../store'
import Table from 'react-bootstrap/Table'
import { getGrades } from '../../services/grades'
const GradesUsers = () =>{
  const [grades, setGrades]= useState([]); 
 const aux =[]
  useEffect(() => {
    const courseId = store.getState().courseId.id
    console.log("COURSEEEEEEEEEEEEE " +courseId)
    store.getState().courseId.id != undefined && getGrades(store.getState().courseId.id).then(response =>{
      
      console.log("ASTA E" +response.data)
      response.data.rows.forEach(element => {
        aux.push(element)
        
      });
      debugger
      setGrades(aux);

    });  


  },[])
    
     
  return (
    grades && (<div className='container'>
        <Table striped bordered hover>
      <thead>
        <tr>
          
          <th>Nume</th>
          <th>Nota</th>
        </tr>
      </thead>
      <tbody>
      {grades != "" && grades.map((grade,id) => (
        <tr key={id}>
          <td>{grade.name}</td>
          <td>{grade.grade}</td>
        </tr>

      ))}
        
      </tbody>
    </Table>
    </div>)
  )
}

export default GradesUsers