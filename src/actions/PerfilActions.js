import {
    PERFIL_EDIT,
    PERFIL_LOAD,
    PERFIL_SAVE,
    PERFIL_SAVE_SUCCESS,
    PERFIL_SAVE_FAILED,
    PERFIL_LOAD_FAILED,
    PERFIL_PROGRESS
} from './types';
import { Database } from '../configuracion';

export const cargarPerfil = (perfil) => {
    try{
        if(perfil) {
            localStorage.sessionData = JSON.stringify(perfil);
        } else if (localStorage.sessionData) {
            perfil = JSON.parse(localStorage.sessionData);
        } else {
            perfil = {}
        }
        
    
        return {
            type: PERFIL_LOAD,
            payload: perfil
        }
    } catch(err){
        return {
            type: PERFIL_SAVE_FAILED,
            payload: err
        }
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
            Database.requestWithFile(`Perfil/${perfil.id_usuario}`, perfil, "usuarios", (error, res) => {
                if(error || res.status > 299) {
                    console.log("%c" + res.message, "color:orange")
                    dispatch({ type: PERFIL_SAVE_FAILED, payload: error })
                } else {
                    switch(res.type) {
                        case "progress":
                            dispatch({ type: PERFIL_PROGRESS, payload: res.progress });
                            break;
                        case "error":
                            dispatch({ type: PERFIL_SAVE_FAILED, payload: error })
                            break;
                        case "complete":
                            localStorage.sessionData = JSON.stringify(res.data[0]);
                            dispatch({ 
                                type: PERFIL_SAVE_SUCCESS, 
                                payload: res.data[0]
                            });
                            break;
                        default:
                            dispatch({ type: PERFIL_SAVE_FAILED, payload: error })
                            return;
                    }                    
                }

            });

        } catch(error) {
            dispatch({ type: PERFIL_SAVE_FAILED, payload: error })
        }
    }
}
