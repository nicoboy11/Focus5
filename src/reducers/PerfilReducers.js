import {
    PERFIL_LOAD,
    PERFIL_SAVE,
    PERFIL_SAVE_SUCCESS,
    PERFIL_SAVE_FAILED,
    PERFIL_LOAD_FAILED
} from '../actions/types';

const INITIAL_STATE =  {
    perfil: {},
    tmp_perfil: {},
    loading: false,
    error: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case PERFIL_LOAD:
            return { ...state, perfil: action.payload, tmp_perfil: action.payload, error: '' }
        case PERFIL_LOAD_FAILED:
            return { ...state, ...INITIAL_STATE, loading: false, error: 'No se pudo cargar el perfil'}            
        case PERFIL_SAVE_SUCCESS:
            return { ...state, perfil: action.payload, tmp_perfil: {}, loading: false, error: ''}
        case PERFIL_SAVE:
            return { ...state, loading: true, error: '' }
        case PERFIL_SAVE_FAILED:
            return { ...state, loading: false, error: 'No se pudo guardar'}
        default:
            return { ...state }
    }
}