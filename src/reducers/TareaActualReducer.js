import {
    TAREA_ACTUAL,
    TAREA_ACTUALIZA,
    TAREA_ACTUAL_GUARDAR,
    TAREA_ACTUAL_GUARDAR_FAILED,
    TAREA_ACTUAL_GUARDAR_SUCESS,
    TAREA_ACTUAL_LIMPIAR,
    TAREA_NUEVA,
    TAREA_NUEVA_SUCCESS,
    TAREA_NUEVA_FAILED
} from '../actions/types';

const INITIAL_STATE = { 
    tarea: {},
    tmp_tarea: {},
    tareaNueva: {
        avance: 0,
        fec_creacion: '',
        fec_limite: '',
        id_proyecto: null,
        id_status: 1,
        id_tarea: null,
        notificaciones: 0,
        participantes: [],
        priority_id: 1,
        topComments: [],
        txt_tarea: ''
    },
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
            return { ...state, tarea: {}, tmp_tarea: {}, tareaNueva: INITIAL_STATE.tareaNueva }        
        case TAREA_NUEVA:
            return { ...state, loading: true, error: '' }
        case TAREA_NUEVA_SUCCESS:
            return { ...state, loading: false, tareaNueva: action.payload.tarea }  
        case TAREA_NUEVA_FAILED:
            return { ...state, loading: false, error: 'Error al guardar' }
        default:
            return state;
    }
};