import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import AddCourse from "./components/AddCourse";
import InsertGrades from "./components/InsertGrades";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import UserCourses from "./components/UserCourses";
import Feed from "./components/feed/Feed";
import GradesUsers from "./components/feed/GradesUsers";
import Chat from "./components/chat/Chat";
import EditCourse from "./components/EditCourse";
import GradesTeacher from "./components/GradesTeacher";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    
  
    if (currentUser?.rows[0]) {
      
      setShowModeratorBoard(currentUser.rows[0].role.includes("secretar"));
      setShowAdminBoard(currentUser.rows[0].role.includes("profesor"));
      //setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router history={history}>
      <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link to={"/"} className="navbar-brand d-flex align-items-center">
        <img src="/images/logo.png" alt="Catalog Online" height="40" className="mr-2" />
        Catalog Online
      </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>
           {currentUser && currentUser.rows[0] && !currentUser.rows[0].role.includes("secretar") &&  (<li className="nav-item">
              <Link to={"/chat"} className="nav-link">
                Chat
              </Link>
            </li>)} 

            {showModeratorBoard && (
              <li className="nav-item">
                <Link to={"/mod"} className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}

            {currentUser && currentUser.rows[0] && currentUser.rows[0].role.includes("user") && (
              <li className="nav-item">
                <Link to={"/userCourses"} className="nav-link">
                  Courses
                </Link>
              </li>
            )}
            {/* {currentUser && currentUser.rows[0] && currentUser.rows[0].role.includes("user") && (
              <li className="nav-item">
                <Link to={"/Feed"} className="nav-link">
                  Feed
                </Link>
              </li>
            )} */}
            {/* {currentUser && currentUser.rows[0] && currentUser.rows[0].role.includes("profesor") && (
              <li className="nav-item">
                <Link to={"/Feed"} className="nav-link">
                  Feed
                </Link>
              </li>
            )} */}
          </div>

          {currentUser && currentUser.rows[0] ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.rows[0].name}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/chat" component={Chat} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />
            <Route path="/addCourse" component={AddCourse} />
            <Route path="/insertGrades" component={InsertGrades} />
            <Route path="/userCourses" component={UserCourses} />
            <Route path="/Feed" component={Feed} />
            <Route path="/GradesUsers" component={GradesUsers} />
            <Route path="/editCourse" component={EditCourse} />
            <Route path="/CourseSituation" component={GradesTeacher} />
        
          </Switch>
        </div>

        {/* <AuthVerify logOut={logOut}/> */}
      </div>
    </Router>
  );
};

export default App;
