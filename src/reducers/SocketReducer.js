import {
    SOCKET,
    SOCKET_CLEAR
} from '../actions/types';

const INITIAL_STATE = { 
    socket: {}
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case SOCKET:
            return { ...state, socket: action.payload }
        case SOCKET_CLEAR:
            return { ...state, socket: {}}
        default:
            return state;
    }
};