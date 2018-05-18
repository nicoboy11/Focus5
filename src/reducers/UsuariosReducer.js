import {
    USUARIOS,
    USUARIO_RESPONSABLE,
    USUARIOS_PARTICIPANTES,
    USUARIOS_FAILED,
    USUARIOS_SUCCESS,
    USUARIOS_ACTUAL_LIMPIAR,
    USR_EDIT,
    USR_SELECT,
    INVITE,
    INVITE_FAILED,
    INVITE_SUCCESS
} from '../actions/types';

const INITIAL_STATE = { 
    usuarios: [],
    usuario_reponsable: [],
    USUARIOS_PARTICIPANTES: [],
    usuarioActual: {},
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
        case USR_EDIT:
            return { ...state, usuarios: action.payload }     
        case USR_SELECT:
            return { ...state, usuarioActual: action.payload }
        case INVITE:
            return { ...state, loading: true }
        case INVITE_SUCCESS: 
            return { ...state, loading: false }
        case INVITE_FAILED: 
            return { ...state, loading: false }
        default:
            return state;
    }
};