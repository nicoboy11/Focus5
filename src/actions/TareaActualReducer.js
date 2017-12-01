import {
    TAREA_ACTUAL,
    TAREA_ACTUALIZA,
    TAREA_ACTUAL_GUARDAR,
    TAREA_ACTUAL_GUARDAR_FAILED,
    TAREA_ACTUAL_GUARDAR_SUCESS,
    TAREA_ACTUAL_LIMPIAR
} from '../actions/types';

const INITIAL_STATE = { 
    tarea: {},
    tmp_tarea: {},
    error: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case TAREA_ACTUAL:
            return { ...state, tarea: action.payload.tarea, tmp_tarea: action.payload.tmp_tarea}
        case TAREA_ACTUALIZA:
            return { ...state, tmp_tarea: action.payload.tmp_tarea }
        case TAREA_ACTUAL_GUARDAR:
            return { ...state, error: '', loading: true}                
        case TAREA_ACTUAL_GUARDAR_FAILED:
            return { ...state, error: 'Error al guardar', loading: false }
        case TAREA_ACTUAL_GUARDAR_SUCESS:
            return { ...state, tarea: action.payload.tarea, tmp_tarea: {}, loading: false }  
        case TAREA_ACTUAL_LIMPIAR:
            return { ...state, tarea: {}, tmp_tarea: {} }          
        default:
            return state;
    }
};