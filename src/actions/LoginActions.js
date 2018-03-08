import { Database } from '../configuracion'
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
} from './types';

export const emailChanged = (text) => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const passwordChanged = (text) => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const logoutUser = () => {
    return {
        type: LOGOUT
    }
}

export const loginUser = (email, password, callback = () => {}) => {
    return (dispatch) => {
        dispatch({ type: LOGIN_USER });

        Database.request('POST', 'loginUser', { email, password }, 0, (error, response) => {
            if(error || (response.status !== undefined && response.status > 299)) {
                callback(false);
                loginFailed(dispatch, response.message);
            } else {
                callback(true);
                loginSuccess(dispatch, response[0]);
            }
        });

    }
};

export const loginLocalStorage = (session) => {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: session
    }
}

export const loginGoogle = (gapi) => {
    return {
        type: GOOGLE_LOGIN_SUCCESS
    }
}

export const logoutGoogle = () => {
    return {
        type: GOOGLE_LOGOUT
    }
}

export const initGoogle = (gapi) => {
    return {
        type: GOOGLE_INIT,
        payload: gapi
    }
}

export const googleStatus = (status) => {
    return {
        type: GOOGLE_STATUS,
        payload: status
    }
}

export const setCalEvents = (events) => {
    return {
        type: GOOGLE_EVENTS,
        payload: events
    }
}

const loginFailed = (dispatch, error) => {
    dispatch({ type: LOGIN_USER_FAILED, payload: error });
}

const loginSuccess = (dispatch, usuario) => {
    dispatch({ 
        type: LOGIN_USER_SUCCESS,
        payload: usuario
    });
}