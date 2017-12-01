import {
    TAREA_ACTUAL,
    TAREA_ACTUALIZA
} from './types';


export const seleccionarTarea = (tarea, tmp_tarea) => {
    return {
        type: TAREA_ACTUAL,
        payload: { tarea, tmp_tarea }
    };
}

export const actualizarTarea = ({ prop, value, tmp_tarea }) => {
    
    let tarea = tmp_tarea;
    tarea[prop] = value;

    return {
        type: TAREA_ACTUALIZA,
        payload: { tmp_tarea: tarea }
    };
}