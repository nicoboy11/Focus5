import { 
    EMAIL_CHANGED, 
    PASSWORD_CHANGED,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOGOUT,
    GOOGLE_LOGIN_SUCCESS,
    GOOGLE_LOGOUT,
    GOOGLE_INIT,
    GOOGLE_STATUS,
    GOOGLE_EVENTS
} from '../actions/types';

const INITIAL_STATE = {
    email: '',
    password: '',
    sessionData: null,
    error: '',
    loading: false,
    googleLogin: false,
    gapi: null,
    googleStatus: false,
    events: []
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
        case GOOGLE_INIT:
            return { ...state, gapi: action.payload }
        case GOOGLE_LOGIN_SUCCESS:
            return { ...state, googleLogin: true, googleStatus: true }
        case GOOGLE_LOGOUT:
            return { ...state, googleLogin: false, googleStatus: false }      
        case GOOGLE_STATUS:
            return { ...state, googleStatus: action.payload }      
        case GOOGLE_EVENTS:
            return { ...state, events: action.payload }
        default:
            return state;
    }
};