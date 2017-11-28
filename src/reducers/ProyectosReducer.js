import {
    PROYECTOS_FAILED,
    PROYECTOS_SUCESS,
    PROYECTOS,
    PROYECTO_SELECT,
    TAREAS,
    TAREA_SELECT
} from '../actions/types';

const INITIAL_STATE = { proyectos: [], current_id_proyecto: null, tareas: [], current_id_tarea: null, loading: false, error: '' };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PROYECTOS:
            return { ...state, loading: true, error: ''}
        case PROYECTOS_SUCESS:
            return { ...state, ...INITIAL_STATE, proyectos: action.payload };
        case PROYECTOS_FAILED:
            return { ...state, error: 'Error al cargar', loading: false}
        case PROYECTO_SELECT:
            return { ...state, current_id_proyecto: action.payload }
        case TAREAS:
            return { ...state, tareas: action.payload }     
        case TAREA_SELECT:
            return { ...state, current_id_tarea: action.payload }    
        default:
            return state;
    }
};