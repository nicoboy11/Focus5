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
} from '../actions/types';

const INITIAL_STATE = { 
    txt_proyecto_text: '', 
    fec_inicio_text: null, 
    fec_fin_text: null, 
    fec_fin_disabled: false, 
    fec_abierta: true, 
    id_status_text: null,
    guardando: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PROYECT_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value}
        case PROYECT_GUARDAR_SUCESS:
            return action.payload
        default:
            return state;
    }
};