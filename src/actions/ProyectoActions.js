import { Database, Helper } from '../configuracion';
import {
    PROYECTOS,
    PROYECTOS_SUCESS,
    PROYECTOS_FAILED,
    PROYECTO_SELECT,
    PROYECTOS_UPDATE,
    TAREA_SELECT,
    TAREAS,
    COMENTARIOS
} from './types';

export const cargarProyectos = (id_usuario) => {
    return (dispatch) => {
        dispatch({ type: PROYECTOS });

        Database.request('GET', `contenido/${id_usuario}`, {}, 2, (error, response) => {
            if(error){
              cargarProyectosFailed(dispatch);
              console.log(error);
            } else{
                cargarProyectosSuccess(dispatch, response);
            }
        });            
    }
};

export const selectProyecto = (id_proyecto) => {
    return {
        type: PROYECTO_SELECT,
        payload: { id_proyecto }
    };
}

export const cargarTareas = (proyectos, id_proyecto) => {

    const currentProyecto = proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto);
    const datos = Helper.clrHtml(currentProyecto[0].tareas);
    const tareas = currentProyecto[0].tareas ? JSON.parse(datos) : [];     

    return {
        type: TAREAS,
        payload: tareas
    }
}

export const updateProyectos = (proyectos, proyecto) => {

    const foundIndex = proyectos.findIndex(x=>x.id_proyecto == proyecto.id_proyecto);
    proyectos[foundIndex] = proyecto;

    return {
        type: PROYECTOS_UPDATE,
        payload: proyectos
    }
}

const cargarProyectosFailed = (dispatch) => {
    dispatch({ type: PROYECTOS_FAILED });
}

const cargarProyectosSuccess = (dispatch, proyectos) => {
    dispatch({
        type: PROYECTOS_SUCESS,
        payload: proyectos
    });
};


