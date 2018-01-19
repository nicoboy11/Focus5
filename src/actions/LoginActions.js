import { Database } from '../configuracion'
import {
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILED,
    LOGOUT
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

        Database.request('POST', 'loginUser', { email, password }, 2, (error, response) => {
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

const loginFailed = (dispatch, error) => {
    dispatch({ type: LOGIN_USER_FAILED, payload: error });
}

const loginSuccess = (dispatch, usuario) => {
    dispatch({ 
        type: LOGIN_USER_SUCCESS,
        payload: usuario
    });
}