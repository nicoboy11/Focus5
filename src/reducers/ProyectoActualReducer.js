import {
    PROYECTO_ACTUAL,
    PROYECT_CREATE,
    PROYECT_FEC_FIN,
    PROYECT_FEC_OPEN,
    PROYECT_FEC_INICIO,
    PROYECTO_ACTUALIZA,
    PROYECTO_ACTUAL_GUARDAR,
    PROYECTO_ACTUAL_GUARDAR_FAILED,
    PROYECTO_ACTUAL_GUARDAR_SUCESS,
    PROYECTO_ACTUAL_LIMPIAR,
    PROYECT_STATUS,
    PROYECT_TEXT
} from '../actions/types';

const INITIAL_STATE = { 
    proyecto: {},
    tmp_proyecto: {},
    error: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PROYECTO_ACTUAL:
            return { ...state, proyecto: action.payload.proyecto, tmp_proyecto: action.payload.tmp_proyecto}
        case PROYECTO_ACTUALIZA:
            return { ...state, tmp_proyecto: action.payload.tmp_proyecto }
        case PROYECTO_ACTUAL_GUARDAR:
            return { ...state, error: '', loading: true}                
        case PROYECTO_ACTUAL_GUARDAR_FAILED:
            return { ...state, error: 'Error al guardar', loading: false }
        case PROYECTO_ACTUAL_GUARDAR_SUCESS:
            return { ...state, proyecto: action.payload.proyecto, tmp_proyecto: {}, loading: false }  
        case PROYECTO_ACTUAL_LIMPIAR:
            return { ...state, proyecto: {}, tmp_proyecto: {} }          
        default:
            return state;
    }
};