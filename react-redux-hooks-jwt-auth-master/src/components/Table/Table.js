import Button  from "./Button"
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import { useSelector } from "react-redux"
import { removeProf , addProf } from "../../services/mod.service"

import { ADD_PROFESOR, REMOVE_ADMIN } from '../../actions/mod';

function Table({colNames}) {
    const dispatch =useDispatch();
    const users = useSelector((state) => state.users.users)
    
    let index=0;
    
    
    const handleRemove = (e) => {
        
        dispatch(REMOVE_ADMIN(e.currentTarget.id))
        debugger
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
                        
                        <tr key={user.id}>
                        {Object.entries(user).map(tag=> 
                        
                            
                            (<td key={tag[1]}>{tag[1]}</td>)
                            
                        )}
                         {  
                            users[user.id]&&
                            users[user.id-1] &&users[user.id-1].role === 'secretar' ? '' :
                            users[user.id-1] &&users[user.id-1].role !== 'profesor' ? 
                            <td> <Button data={"Adaugă Profesor"} type="primary" index={user.id} handleOnClick={handleAdd}></Button></td> :
                            <td> <Button data={"Șterge Profesor"} type="danger" index={user.id} handleOnClick={handleRemove}></Button></td>
                            
                        }
                       
                       
                        
                        </tr>
                       
                        ))}
                </tbody>
            </table>
        )}
    </div>
  )
}

export default Table