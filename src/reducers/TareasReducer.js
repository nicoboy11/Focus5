import {
    TAREAS
} from '../actions/types';

const INITIAL_STATE = { tareas: [], loading: false, error: '' };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case TAREAS:
            return { ...state, tareas: action.payload }     
        default:
            return state;
    }
};