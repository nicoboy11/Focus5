import { Database } from '../configuracion';
import {
    PROYECTO_ACTUALIZA,
    PROYECTO_ACTUAL,
    PROYECTO_ACTUAL_GUARDAR,
    PROYECTO_ACTUAL_GUARDAR_FAILED,
    PROYECTO_ACTUAL_GUARDAR_SUCESS,
    PROYECTO_ACTUAL_LIMPIAR,
    PROYECT_UPDATE,
    PROYECT_REFRESH
} from './types';

/*
export const seleccionarProyecto = (proyecto, tmp_proyecto) => {
    return {
        type: PROYECTO_ACTUAL,
        payload: { proyecto, tmp_proyecto }
    };
}

export const actualizarProyecto = ({ prop, value, tmp_proyecto }) => {

    let proyecto = tmp_proyecto;
    proyecto[prop] = value;

    return {
        type: PROYECTO_ACTUALIZA,
        payload: { tmp_proyecto: proyecto }
    };
}

export const proyect_update = ({ prop, value }) => {
    return {
        type: PROYECT_UPDATE,
        payload: { prop, value }
    };
}

export const proyect_refresh = (proyectoRefreshed) => {
    return {
        type: PROYECT_REFRESH,
        payload: proyectoRefreshed
    }
}

export const guardarProyecto = (proyecto) => {
    
        return (dispatch) => {
            dispatch({ type: PROYECTO_ACTUAL_GUARDAR });
            try {
                proyecto["id_usuario"] = JSON.parse(localStorage.sessionData).id_usuario;
                Database.request('POST', `editarProyecto/${proyecto.id_proyecto}`, proyecto, 2, (error, response) => {
                    if(error){
                        proyectoSaveFailed(dispatch);
                        console.log(error);
                    } else{
                        proyectoSaveSuccess(dispatch, { proyecto: response[0] } );
                    }
                });           
            }
            catch(err) {
                proyectoSaveFailed(dispatch);
            }                 
        }    
}

export const guardarProyectoNuevo = (proyecto) => {
    
        return (dispatch) => {
            dispatch({ type: PROYECTO_ACTUAL_GUARDAR });
            try {
                proyecto["id_usuario"] = JSON.parse(localStorage.sessionData).id_usuario;
                Database.request('POST', 'crearProyecto', proyecto, 2, (error, response) => {
                    if(error){
                        proyectoSaveFailed(dispatch);
                        console.log(error);
                    } else{
                        proyectoSaveSuccess(dispatch, { proyecto: response[0] } );
                    }
                });           
            }
            catch(err) {
                proyectoSaveFailed(dispatch);
            }                 
        }    
}
*/
export const limpiarProyectoActual = () => {
    return {
        type: PROYECTO_ACTUAL_LIMPIAR,
        payload: {}
    }    
}

const proyectoSaveFailed = (dispatch) => {
    dispatch({ type: PROYECTO_ACTUAL_GUARDAR_FAILED });
}

const proyectoSaveSuccess = (dispatch, proyecto) => {
    dispatch({
        type: PROYECTO_ACTUAL_GUARDAR_SUCESS,
        payload: proyecto
    });
};