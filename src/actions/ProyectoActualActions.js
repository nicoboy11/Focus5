import { Database, Helper } from '../configuracion';
import {
    PROYECTO_ACTUALIZA,
    PROYECT_CREATE,
    PROYECT_FEC_FIN,
    PROYECT_FEC_OPEN,
    PROYECT_FEC_INICIO,
    PROYECTO_ACTUAL,
    PROYECTO_ACTUAL_GUARDAR,
    PROYECTO_ACTUAL_GUARDAR_FAILED,
    PROYECTO_ACTUAL_GUARDAR_SUCESS,
    PROYECTO_ACTUAL_LIMPIAR,
    PROYECT_UPDATE,
    PROYECT_STATUS,
    PROYECT_TEXT
} from './types';


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

export const guardarProyecto = (proyecto) => {
    
        return (dispatch) => {
            dispatch({ type: PROYECTO_ACTUAL_GUARDAR });
            try {
                proyecto["id_usuario"] = 12;
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
                proyecto["id_usuario"] = 12;
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