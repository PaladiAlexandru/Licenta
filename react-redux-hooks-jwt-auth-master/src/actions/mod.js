import * as types from './types';

export const USERS_LOADED = users => ({
    type: types.USERS_LOADED,
    payload: users.rows
})
export const REMOVE_ADMIN = id => ({
    type: types.REMOVE_ADMIN,
    payload: id
})
export const ADD_PROFESOR = id => ({
    type: types.ADD_PROFESOR,
    payload: id
})
export const LOAD_COURSES = id => ({
    type: types.LOAD_COURSES,
    payload: id
})