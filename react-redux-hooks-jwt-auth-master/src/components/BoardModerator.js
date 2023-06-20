import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import Table from "./Table/Table";
import { useDispatch, useSelector} from "react-redux";
import { USERS_LOADED } from "../actions/mod";
const colNames = ['Name','Role']

const BoardModerator = () => {
  const dispatch= useDispatch();
  

  useEffect(() => {
    debugger
    UserService.getModeratorBoard().then(
      (response) => {
        debugger
        dispatch(USERS_LOADED(response.data));
        
      },
      (error) => {
        console.error("err");
        // const _content =
        //   (error.response &&
        //     error.response.data &&
        //     error.response.data.message) ||
        //   error.message ||
        //   error.toString();

        // setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);
  return (
    <div className="container">
      <header className="jumbotron">
      {   
         <Table colNames={colNames} />
        
        
      
      }
      
      </header>
    </div>
  );
};

export default BoardModerator;
