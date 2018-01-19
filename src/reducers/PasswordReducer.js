import {
    PSW_CHANGED,
    PSW_GUARDAR
} from '../actions/types'

const INITIAL_STATE = {
    password_actual: '',
    password_nuevo: '',
    password_confirmacion: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case PSW_CHANGED:
            return { ...state, [action.payload.prop]: action.payload.value}
        case PSW_GUARDAR:
            return { ...state, ...INITIAL_STATE}
        default:
            return state;
    }
}