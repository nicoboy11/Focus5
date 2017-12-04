import { Database, Helper } from '../configuracion';
import {
    LISTA_PROYECTOS,
    LISTA_PROYECTOS_SUCESS,
    LISTA_PROYECTOS_FAILED,
    LISTA_PROYECTOS_UPDATE,
    PROYECTO_SELECT
} from './types';

/**
 * Carga lista de proyectos
 * @param {*} id_usuario 
 */
export const listaProyectos = (id_usuario) => {
    return (dispatch) => {
        dispatch({ type: LISTA_PROYECTOS });

        Database.request('GET', `contenido/${id_usuario}`, {}, 2, (error, response) => {
            if(error){
              listaProyectosFailed(dispatch);
              console.log(error);
            } else{

                //convertir tareas a objetos
                for(const proyecto of response) {
                    const datos = Helper.clrHtml(proyecto.tareas);
                    proyecto.id_proyecto = parseInt(proyecto.id_proyecto);
                    proyecto.id_status = parseInt(proyecto.id_status);
                    proyecto.tareas = proyecto.tareas ? JSON.parse(datos) : [];  
                    proyecto.txt_proyecto = Helper.decode_utf8(Helper.htmlPaso(proyecto.txt_proyecto));

                    for(const tarea of proyecto.tareas) {
                        for(const usuario of tarea.participantes) {
                            usuario.txt_usuario = Helper.decode_utf8(Helper.htmlPaso(usuario.txt_usuario));
                        }

                        tarea.txt_tarea = Helper.decode_utf8(Helper.htmlPaso(tarea.txt_tarea));
                    }
                }
  

                listaProyectosSuccess(dispatch, response);
            }
        });            
    }
};

/**
 * Recibe la lista de proyectos y el proyecto modificado y actualiza la lista
 * @param {*} proyectos 
 * @param {*} proyecto 
 */
export const actualizaListaProyectos = (proyectos, proyecto) => {
    
    const foundIndex = proyectos.findIndex(x=>x.id_proyecto === proyecto.id_proyecto);

    //Si no encuentra el proyecto en la lista lo inserta (nuevo proyecto)
    if(foundIndex === -1){
        proyectos.push(proyecto);
    } else {
        proyectos[foundIndex] = proyecto;
    }

    return {
        type: LISTA_PROYECTOS_UPDATE,
        payload: proyectos
    }
}

export const selectProyecto = (id_proyecto) => {
    return {
        type: PROYECTO_SELECT,
        payload: { id_proyecto }
    };
}

const listaProyectosFailed = (dispatch) => {
    dispatch({ type: LISTA_PROYECTOS_FAILED });
}

const listaProyectosSuccess = (dispatch, proyectos) => {
    dispatch({
        type: LISTA_PROYECTOS_SUCESS,
        payload: proyectos
    });
};


