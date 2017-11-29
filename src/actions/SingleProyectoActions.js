import { Database, Helper } from '../configuracion';
import {
    PROYECT_UPDATE,
    PROYECT_CREATE,
    PROYECT_FEC_FIN,
    PROYECT_FEC_OPEN,
    PROYECT_FEC_INICIO,
    PROYECT_GUARDAR,
    PROYECT_GUARDAR_FAILED,
    PROYECT_GUARDAR_SUCESS,
    PROYECT_STATUS,
    PROYECT_TEXT
} from './types';


export const proyect_update = ({ prop, value }) => {
    return {
        type: PROYECT_UPDATE,
        payload: { prop, value }
    };
}

export const proyect_save = (params) => {
    return (dispatch) => {
        dispatch({ type: PROYECT_GUARDAR });

        console.log(params);
        Database.request('POST', `editarProyecto/${params.id_proyecto}`, params, 2, (error, response) => {
            if(error){
                proyectoSaveFailed(dispatch);
              console.log(error);
            } else{
                proyectoSaveSuccess(dispatch, { proyectoEdit: response[0] });
            }
        });            
    }    
}


const proyectoSaveFailed = (dispatch) => {
    dispatch({ type: PROYECT_GUARDAR_FAILED });
}

const proyectoSaveSuccess = (dispatch, proyecto) => {
    dispatch({
        type: PROYECT_GUARDAR_SUCESS,
        payload: proyecto
    });
};