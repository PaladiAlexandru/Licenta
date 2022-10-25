import {LOAD_GRADES} from "../actions/types";


export default function (state="", action) {
    const { type, payload } = action;
  
    switch (type) {
      case LOAD_GRADES:
        return {
          ...state,
          id: payload,
        };
      default:
        return state;
    }
  }