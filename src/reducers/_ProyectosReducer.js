import {
    LISTA_PROYECTOS_FAILED,
    LISTA_PROYECTOS_SUCESS,
    LISTA_PROYECTOS,
    LISTA_PROYECTOS_UPDATE,
    PROYECTO_SELECT
} from '../actions/types';

const INITIAL_STATE = { proyectos: [], current_id_proyecto: null, tareas: [], current_id_tarea: null, loading: false, error: '', renderState: null };

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case LISTA_PROYECTOS:
            return { ...state, loading: true, error: ''}
        case LISTA_PROYECTOS_SUCESS:
            return { ...state, ...INITIAL_STATE, proyectos: action.payload };
        case LISTA_PROYECTOS_FAILED:
            return { ...state, error: 'Error al cargar', loading: false}
        case LISTA_PROYECTOS_UPDATE:
            return { ...state, proyectos: action.payload }            
        case PROYECTO_SELECT:
            return { ...state, current_id_proyecto: action.payload }
        default:
            return state;
    }
};