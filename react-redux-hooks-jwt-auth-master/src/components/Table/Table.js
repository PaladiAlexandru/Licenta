import Button  from "./Button"
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import { useSelector } from "react-redux"
import { removeProf , addProf } from "../../services/mod.service"

import { ADD_PROFESOR, REMOVE_ADMIN } from '../../actions/mod';

function Table({ colNames }) {
    const users = useSelector(state => state.users.users);
    const dispatch = useDispatch();
  
    const handleRemove = (e) => {
      dispatch(REMOVE_ADMIN(e.currentTarget.id));
      removeProf(e.currentTarget.id);
    };
  
    const handleAdd = (e) => {
      dispatch(ADD_PROFESOR(e.currentTarget.id));
      addProf(e.currentTarget.id);
    };
  
    return (
      <div>
        {users && (
          <table className="table">
            <thead className="thead-dark">
              <tr>
                {colNames.map((headerItem, index) => (
                  <th scope="col" key={index}>{headerItem}</th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  {Object.entries(user).map(([key, value]) => {
                    if (key === "name" || key === "password" || key === "role") {
                      return <td key={key}>{value}</td>;
                    }
                    return null;
                  })}
                  {user.role === 'secretar' ? (
                    ''
                  ) : user.role !== 'profesor' ? (
                    <td>
                      <Button data={"Adaugă Profesor"} type="primary" index={user.id} handleOnClick={handleAdd} />
                    </td>
                  ) : (
                    <td>
                      <Button data={"Șterge Profesor"} type="danger" index={user.id} handleOnClick={handleRemove} />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
  
  export default Table;
  