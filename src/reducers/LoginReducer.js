import { 
    EMAIL_CHANGED, 
    PASSWORD_CHANGED,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOGOUT
} from '../actions/types';

const INITIAL_STATE = {
    email: '',
    password: '',
    sessionData: null,
    error: '',
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case EMAIL_CHANGED:
            return { ...state, email: action.payload, error: '' };
        case PASSWORD_CHANGED:
            return { ...state, password: action.payload, error: '' };
        case LOGIN_USER:
            return { ...state, loading: true, error: ''};
        case LOGOUT:
            return { ...state, loading: false, error: '', sessionData: null};            
        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, sessionData: action.payload, email: '', password: '' }
        case LOGIN_USER_FAILED:
            return { ...state, loading: false, sessionData: null, error: action.payload}
        default:
            return state;
    }
};