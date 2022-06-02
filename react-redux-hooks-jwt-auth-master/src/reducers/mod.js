import * as actions from '../actions/types';

import getCourses from '../services/teacher-service'

export function USERS_LOADED (state =[],action) {
    
    switch(action.type){
        case actions.USERS_LOADED:
            return {
                ...state,
                users: action.payload
            }
        case actions.REMOVE_ADMIN:
            return {...state, users:[...state.users.map(user => user.id !== parseInt(action.payload)? user : {...user,role:'user'})]} 
        case actions.ADD_PROFESOR:
            return {...state, users:[...state.users.map(user => user.id !== parseInt(action.payload)? user : {...user,role:'profesor'})]} 
        case actions.LOAD_COURSES:
            return {...state, courses: [getCourses(action.payload)]}
        default:
            return state;
    }
}