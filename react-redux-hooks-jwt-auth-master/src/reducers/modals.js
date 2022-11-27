import {OPEN_MODAL} from "../actions/types";


export default function (state="", action) {
    const { type, payload } = action;
  
    switch (type) {
      case OPEN_MODAL:
        return {
          ...state,
          id: payload,
        };
      default:
        return state;
    }
  }