import {
    PERFIL_EDIT,
    PERFIL_LOAD,
    PERFIL_SAVE,
    PERFIL_SAVE_SUCCESS,
    PERFIL_SAVE_FAILED
} from '../actions/types';

const INITIAL_STATE =  {
    perfil: {},
    tmp_perfil: {}
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case PERFIL_LOAD:
            return { ...state, perfil: action.payload, tmp_perfil: action.payload }
        default:
            return { ...state }
    }
}