import {
    USUARIOS,
    USUARIO_RESPONSABLE,
    USUARIOS_PARTICIPANTES,
    USUARIOS_FAILED,
    USUARIOS_SUCCESS,
    USUARIOS_ACTUAL_LIMPIAR,
    USR_EDIT,
    USR_SELECT,
    USUARIO_GUARDADO_SUCCESS,
    USR_GUARDAR,
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
        case USR_GUARDAR:
            return { ...state, error: '', loading: true }
        case USR_SELECT:
            return { ...state, usuarioActual: action.payload }
        case USUARIO_GUARDADO_SUCCESS:
            const listaUsuarios = [...state.usuarios];
            listaUsuarios.push(action.payload);
            return { ...state, usuarioActual: {}, usuarios: listaUsuarios, error: '', loading: false }
        default:
            return state;
    }
};