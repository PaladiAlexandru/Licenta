import React from 'react'
import { removeProf , addProf } from "../../services/mod.service"
import { useEffect } from 'react';

import { ADD_PROFESOR, REMOVE_ADMIN } from '../../actions/mod';

function Button({data, type, index, handleOnClick}) {
    debugger
    const btnType="btn btn-"+type;
   
  return (
    index !== ""?
    <button onClick={(e) => handleOnClick(e)} type="button" className={btnType} id={index} style={{margin: '5px'}}>{data}  </button> :
    <button onClick={(e) => handleOnClick(e)} type="button" className={btnType} id={index}>{data} </button>
  )
}

export default Button