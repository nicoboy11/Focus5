import {
    PROYECT_UPDATE,
    PROYECT_CREATE,
    PROYECT_FEC_FIN,
    PROYECT_FEC_OPEN,
    PROYECT_FEC_INICIO,
    PROYECT_GUARDAR,
    PROYECT_GUARDAR_FAILED,
    PROYECT_GUARDAR_SUCESS,
    PROYECT_STATUS,
    PROYECT_TEXT
} from './types';

const INITIAL_STATE = { txt_proyecto: '' };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PROYECT_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value}
        default:
            return state;
    }
};