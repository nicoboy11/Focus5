import {
    BSR_CLEAR,
    BSR_EDIT,
    FLTR_NTF
} from './types'

export const buscarTexto = (texto) => {
    //Al seleccionar tarea se indica si se seleccionó para editar o solo para mostrar el chat
    return {
        type: BSR_EDIT,
        payload: texto
    };
}

export const filtraNotificaciones = (filtrar) => {
    return {
        type: FLTR_NTF,
        payload: filtrar
    }
}