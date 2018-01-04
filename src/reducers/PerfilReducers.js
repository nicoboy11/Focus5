import {
    PERFIL_LOAD,
    PERFIL_SAVE,
    PERFIL_SAVE_SUCCESS,
    PERFIL_SAVE_FAILED
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
            return { ...state, perfil: action.payload, tmp_perfil: action.payload }
        case PERFIL_SAVE_SUCCESS:
            return { ...state, perfil: action.payload, tmp_perfil: {}, loading: false}
        case PERFIL_SAVE:
            return { ...state, loading: true }
        case PERFIL_SAVE_FAILED:
            return { ...state, loading: false, error: action.payload}
        default:
            return { ...state }
    }
}