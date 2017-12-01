import {
    USUARIOS,
    USUARIO_RESPONSABLE,
    USUARIOS_PARTICIPANTES,
    USUARIOS_FAILED,
    USUARIOS_SUCCESS,
    USUARIOS_ACTUAL_LIMPIAR
} from '../actions/types';

const INITIAL_STATE = { 
    usuarios: [],
    usuario_reponsable: [],
    USUARIOS_PARTICIPANTES: [],
    error: '',
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case USUARIOS:
            return { ...state, usuarios: action.payload }
        case USUARIO_RESPONSABLE:
            return { ...state, usuario_reponsable: action.payload }
        case USUARIOS_PARTICIPANTES:
            return { ...state, USUARIOS_PARTICIPANTES: action.payload}                
        case USUARIOS_FAILED:
            return { ...state, error: 'Error al cargar', loading: false }
        case USUARIOS_SUCCESS:
            return { ...state, usuarios: action.payload, loading: false }  
        case USUARIOS_ACTUAL_LIMPIAR:
            return { ...state, usuario_reponsable: [], USUARIOS_PARTICIPANTES: [] }          
        default:
            return state;
    }
};