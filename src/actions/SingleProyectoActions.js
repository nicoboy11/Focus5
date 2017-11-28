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


export const cambiaTitulo = (txt_proyecto) => {
    return {
        type: PROYECT_UPDATE,
        payload: txt_proyecto
    };
}