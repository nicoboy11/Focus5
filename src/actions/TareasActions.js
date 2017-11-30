import { Database, Helper } from '../configuracion';
import {
    TAREAS
} from './types';

export const cargarTareas = (proyectos, id_proyecto) => {
    
   /* const currentProyecto = proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto);
    const datos = Helper.clrHtml(currentProyecto[0].tareas);
    const tareas = currentProyecto[0].tareas ? JSON.parse(datos) : [];    */ 
    const tareas = [];

    return {
        type: TAREAS,
        payload: tareas
    }
}