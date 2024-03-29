import { combineReducers } from "redux";
import auth from "./auth";
import grades from "./grades";
import message from "./message";
import { USERS_LOADED } from "./mod";
import modals from "./modals";


export default combineReducers({
  auth,
  message,
  users: USERS_LOADED,
  courseId: grades,
  openModal: modals
});
