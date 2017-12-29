import { Database, Helper } from '../configuracion';
import {
    TAREA_ACTUAL,
    TAREA_ACTUALIZA,
    TAREA_ACTUAL_GUARDAR,
    TAREA_ACTUAL_GUARDAR_FAILED,
    TAREA_ACTUAL_GUARDAR_SUCESS,
    TAREA_ACTUAL_LIMPIAR,
    TAREA_NUEVA,
    TAREA_NUEVA_SUCCESS,
    TAREA_NUEVA_FAILED,
    TAREA_SOCKET_SUCCESS,
    TAREA_SOCKET_CANCEL,
    TAREA_REFRESH,
    TAREA_RENDER_START,
    TAREA_RENDER_END
} from './types';

/*
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

export const refreshTarea = (tareaRefreshed) => {
    return {
        type: TAREA_REFRESH,
        payload: tareaRefreshed
    };
}

export const tareaRenderStart = () => {
    return { type: TAREA_RENDER_START }
}
export const tareaRenderEnd = () => {
    return { type: TAREA_RENDER_END }
}

export const actualizarGente = ({ rolId, persona, tmp_tarea, usuarios }) => {
    
    // Si el rol destino es "responsable"
    if(rolId === 2){
        // Borrar el responsable actual
        tmp_tarea.participantes = tmp_tarea.participantes.filter(participante => { 
            return participante.role_id != 2 && participante.id_usuario != persona.id_usuario 
        });

        //pongo la persona como responsable
        persona.role_id = 2;

        //la guardo en el array
        tmp_tarea.participantes.push(persona);

    } else {
        persona.map(usuario => {
            if(usuario.role_id !== 3) {
                usuario.role_id = 3;
            }
        });

        // Borrar el participantes actuales actual
        tmp_tarea.participantes = tmp_tarea.participantes.filter(participante => { 
            return participante.role_id != 3 
        });

        tmp_tarea.participantes = tmp_tarea.participantes.concat(persona);
    }

    return {
        type: TAREA_ACTUALIZA,
        payload: { tmp_tarea }
    };
}

export const getTarea = (id_tarea, id_usuario) => {
    return (dispatch) => {
        try {
            Database.request('GET', `tarea/${id_tarea}?id_usuario=${id_usuario}`, {}, 2, (error, response) => {
                if(error){
                    dispatch({ type: TAREA_SOCKET_CANCEL })
                } else{
                    let tareas = Helper.clrHtml(response[0].tarea);
                    let tareaSocket = tareas ? JSON.parse(tareas)[0] : [];  
                    dispatch({ type: TAREA_SOCKET_SUCCESS, payload: tareaSocket})
                }
            });    
        } catch (err) {

        }
    }
}

export const clearTareaSocket = () => {
    return {
        type: TAREA_SOCKET_CANCEL
    };
}
*/
/*
export const guardarTareaNueva = (tarea) => {
    return (dispatch) => {
        dispatch({ type: TAREA_NUEVA });
        try {

            Database.request('POST', `CrearTarea`, tarea, 2, (error, response) => {
                if(error){
                    tareaNuevaSaveFailed(dispatch);
                } else{
                    let tareas = Helper.clrHtml(response[0].tarea);
                    let tareaCreada = tareas ? JSON.parse(tareas)[0] : [];  
                    tareaNuevaSaveSuccess(dispatch, { tarea: tareaCreada } );
                }
            });                 

        } catch(err) {
            tareaSaveFailed(dispatch);
        }
    }
}

export const guardarTarea = (tmpTarea) => {
    return (dispatch) => {
        dispatch({ type: TAREA_ACTUAL_GUARDAR });
        try {
            let tarea = JSON.parse(JSON.stringify(tmpTarea));
            //El usuario que edita
            tarea["id_usuario"] = JSON.parse(localStorage.sessionData).id_usuario;
            tarea.txt_descripcion = "";

            //Obtengo el responsable (role_id = 2 ó creador (role_id = 1))
            tarea.id_responsable = tarea.participantes.filter(participante => participante.role_id === 1 || participante.role_id === 2).sort((a,b) => b.role_id - a.role_id)[0].id_usuario;

            //Obtengo los participantes
            const participantes = [];
            for (let i = 0; i < tarea.participantes.length; i++) {
                if(tarea.participantes[i].role_id === 3) {
                    participantes.push(tarea.participantes[i].id_usuario);
                }
            }            

            //convierto array en formato separado por comas                                    
            tarea.participantes = participantes.join();

            Database.request('POST', `EditarTarea/${tarea.id_tarea}`, tarea, 2, (error, response) => {
                if(error){
                    tareaSaveFailed(dispatch);
                } else{
                    let tareaObj = Helper.clrHtml(response[0].tarea);
                    let tareaEditada = tareaObj ? JSON.parse(tareaObj)[0] : [];  

                    for(const usuario of tareaEditada.participantes) {
                        usuario.txt_usuario = Helper.decode_utf8(Helper.htmlPaso(usuario.txt_usuario));
                    }

                    tareaEditada.txt_tarea = Helper.decode_utf8(Helper.htmlPaso(tareaEditada.txt_tarea));


                    tareaSaveSuccess(dispatch, { tarea: tareaEditada } );
                }
            });          
        }
        catch(err) {
            tareaSaveFailed(dispatch);
        }                 
    }    
}*/
/*
export const limpiarTareaActual = () => {
    return {
        type: TAREA_ACTUAL_LIMPIAR,
        payload: {}
    }    
}
*/
const tareaSaveFailed = (dispatch) => {
    dispatch({ type: TAREA_ACTUAL_GUARDAR_FAILED });
}

const tareaSaveSuccess = (dispatch, tarea) => {
    dispatch({
        type: TAREA_ACTUAL_GUARDAR_SUCESS,
        payload: tarea
    });
};

const tareaNuevaSaveFailed = (dispatch) => {
    dispatch({ type: TAREA_NUEVA_FAILED });
}

const tareaNuevaSaveSuccess = (dispatch, tarea) => {
    dispatch({
        type: TAREA_NUEVA_SUCCESS,
        payload: tarea
    });
};