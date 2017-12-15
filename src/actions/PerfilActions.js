import {
    PERFIL_EDIT,
    PERFIL_LOAD,
    PERFIL_SAVE,
    PERFIL_SAVE_SUCCESS,
    PERFIL_SAVE_FAILED
} from './types';
import { Database } from '../configuracion';

export const cargarPerfil = (perfil) => {
    if(perfil) {
        localStorage.sessionData = JSON.stringify(perfil);
    } else {
        perfil = JSON.parse(localStorage.sessionData);
    }
    

    return {
        type: PERFIL_LOAD,
        payload: perfil
    }
}

export const editarPerfil = ({ prop, value, tmp_perfil }) => {
    let perfil = tmp_perfil;
    perfil[prop] = value;

    return {
        type: PERFIL_EDIT,
        payload: perfil
    }
}

export const guardarPerfil = (perfil) => {
    return(dispatch) => {
        dispatch({ type: PERFIL_SAVE });
        try {
            Database.request('POST', `perfil/${perfil.id_usuario}`, perfil, 2, (err, res) => {
                if(err) {
                    dispatch({ type: PERFIL_SAVE_FAILED, payload: err })
                } else {
                    dispatch({ type: PERFIL_SAVE_SUCCESS, payload: res[0] })
                }
            });

        } catch(err) {
            dispatch({ type: PERFIL_SAVE_FAILED, payload: err })
        }
    }
}