import Button  from "./Table/Button"
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import { useSelector } from "react-redux"
import { removeProf , addProf } from "../services/mod.service"

import { ADD_PROFESOR, REMOVE_ADMIN } from '../actions/mod';

function TableInsertGrades({colNames,data}) {
    const dispatch =useDispatch();
    const [users,setUsers] = useState([]);
    useEffect(()=>{
        setUsers(data);
    },[data])
    
    useEffect(()=>{
        let x = users;
        
    },[users])
    let index=0;
    
    
    const handleRemove = (e) => {
        
        dispatch(REMOVE_ADMIN(e.currentTarget.id))
      
        removeProf(e.currentTarget.id);
              
    
    }
    const handleAdd = (e) => {
        dispatch(ADD_PROFESOR(e.currentTarget.id));
        addProf(e.currentTarget.id);
    }
  return (
    <div>
        {users && (

            <table className="table">
                <thead className="thead-dark">
                    <tr >
                        {colNames.map((headerItem,index)=> (
                            <th scope="col" key={index}>{headerItem}</th>
                        ) )}
                        <th></th>
                        
                    </tr>
                </thead>
                <tbody>
                {users&&users.map(user => (
                        
                        <tr key={user.user_id}>
                        <td>{user.name}</td>
                        <td><input defaultValue={user.existingGrade} id={user.name}></input></td>
                       
                       
                        
                        </tr>
                       
                        ))}
                </tbody>
            </table>
        )}
    </div>
  )
}

export default TableInsertGrades