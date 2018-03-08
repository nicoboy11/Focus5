import { Database, Helper } from '../configuracion';
import {
    PY_LIST,        PY_SELECT,      PY_UNSELECT,
    PY_EDIT,        PY_GUARDAR,     PY_SUCCESS,
    PY_FAIL,        TR_SELECT,      TR_UNSELECT,
    TR_EDIT,        TR_GUARDAR,     CM_EDIT,
    CM_GUARDAR,     CM_PROGRESS,    CM_SUCCESS,
    CM_FILE_CHANGE, CM_FILE_CANCEL, TR_CANCEL,    
    TR_SUCCESS,     CM_MORE,        TR_LEIDA,
    CK_SUCCESS,     PY_MORE_SUCCESS,TR_SUCCESS_SUB, 
    REFS,           TR_SUCCESS_SOCKET,PY_SUCCESS_INACT

} from './types';

/**
 * === PROYECTOS ================================================================================== 
  */
export const listaProyectos = (id_usuario, callback = () => {}) => {
    return (dispatch) => {
        dispatch({ type: PY_LIST });

        Database.request('GET', `contenido/${id_usuario}`, {}, 2, (error, response) => {
            if(error || response.status > 299){
                dispatch({ type: PY_FAIL, payload: 'No se pudieron cargar los proyectos' });
                console.log(response);
                errorLog(JSON.stringify(response),id_usuario);
            } else{
                const newResponse = handleReponsePY(response);
                callback(newResponse);
                dispatch({ type: PY_SUCCESS, payload: newResponse });
            }
        });            
    }
};

export const listaProyectosInactivos = (id_usuario, listaProyectos) => {
    return (dispatch) => {
        Database.request('GET', `contenido/${id_usuario}?statusTareas=${1}&statusProyectos=${2}`, {}, 2, (error, response) => {
            if(error || response.status > 299){
                dispatch({ type: PY_FAIL, payload: 'No se pudieron cargar los proyectos' })
                console.log(response);
                errorLog(JSON.stringify(response),id_usuario);
            } else {
                const newResponse = handleReponsePY(response);
                const proyectos = pyAppendList([...listaProyectos], newResponse);

                dispatch({ type: PY_SUCCESS_INACT, payload: proyectos })
            }
        });
    }
}

export const cargarMasTareas = (listaProyectos, proyecto, id_usuario) => {
    return (dispatch) => {
        const start = proyecto.tareas.length + 1;
        Database.request('GET', `GetMoreTareas/${proyecto.id_proyecto}?id_usuario=${id_usuario}&start=${start}`,{},2,(error,response) => {
            if(error || response.status > 299){
                dispatch({ type: PY_FAIL, payload: 'No se pudieron cargar más tareas' });
                console.log(response);
                errorLog(JSON.stringify(response),id_usuario);
            } else{
                const newResponse = handleReponsePY(response);
                const proyectoEditado = {...proyecto};

                for(const [i, tarea] of newResponse[0].tareas.entries()){
                    let tareaIndex = proyectoEditado.tareas.findIndex(x=>x.id_tarea === tarea.id_tarea);
                    if(tareaIndex !== -1){
                        newResponse[0].tareas.splice(i,1);
                    }
                }

                proyectoEditado.tareas = proyectoEditado.tareas.concat(newResponse[0].tareas);
                const proyectos = pyMerge([...listaProyectos], proyectoEditado);

                dispatch({ type: PY_MORE_SUCCESS, payload: { proyectos, proyectoEditado } });
            }
        });
    }
}

export const seleccionarProyecto = (proyecto) => {
    return {
        type: PY_SELECT,
        payload: proyecto
    };
}

export const desseleccionarProyecto = (proyecto) => {
    return {
        type: PY_UNSELECT
    };
}

export const editarProyecto = (ediciones) => {
    let proyecto = {};
    if(ediciones.constructor === Array){

        proyecto = { ...ediciones[0].tmpProyecto };
        ediciones.forEach(item => {
            const { prop, value } = item;       
            proyecto[prop] = value;             
        });

    } else {
        const { prop, value, tmpProyecto } = ediciones;       
        proyecto = { ...tmpProyecto };
        proyecto[prop] = value;      
    }

    return {
        type: PY_EDIT,
        payload: proyecto
    };   
}

export const guardarProyecto = (listaProyectos, proyecto, snNuevo, callback = () =>{}) => {
    
    //Dependiendo si es nuevo o edición usa diferentes rutas
    const ruta = snNuevo?'crearProyecto':`editarProyecto/${proyecto.id_proyecto}`;

    return (dispatch) => {
        dispatch({ type: PY_GUARDAR });
        try {
            proyecto["id_usuario"] = JSON.parse(localStorage.sessionData).id_usuario;
            Database.request('POST', ruta, proyecto, 2, (error, response) => {
                if(error || response.status > 299){
                    dispatch({ type: PY_FAIL, payload: error });
                    console.log(error);
                    errorLog(JSON.stringify(response),JSON.parse(localStorage.sessionData).id_usuario);
                } else{
                    //Limpiar datos
                    const newResponse = handleReponsePY(response);
                    //Marco este proyecto como nuevo
                    if(snNuevo){
                        newResponse[0].nuevo = true;
                    }
                    
                    //Agregar datos a la lista original
                    const newList = pyMerge([...listaProyectos], newResponse[0]);
                    callback();
                    //Actualizar State
                    dispatch({ type: PY_SUCCESS, payload: newList });
                }
            });           
        }
        catch(err) {
            dispatch({ type: PY_FAIL, payload: err });
        }                 
    }    
}

export const guardaRefs = (refList, ref) => {
    refList[ref.attributes[0].value] = ref;
    return {
        type: REFS,
        payload: refList
    };
}

/**
 * == TAREAS ======================================================================================
 */

export const seleccionarTarea = (id_tarea, editing, selected) => {
    //Al seleccionar tarea se indica si se seleccionó para editar o solo para mostrar el chat
    return {
        type: TR_SELECT,
        payload: { id_tarea, editing, selected }
    };
}

export const desseleccionarTarea = (listaProyectos, proyecto) => {

    const tmpProyecto = obtieneItemLimpio( listaProyectos, proyecto, "id_proyecto");

    return { 
        type: TR_UNSELECT,  
        payload: tmpProyecto
    };
}

export const editarTarea = ({ prop, value, tmpProyecto, tmpTarea }, callback = () =>{}) => {
    let proyecto = { ...tmpProyecto };
    const foundIndex = proyecto.tareas.findIndex(x=>x.id_tarea === tmpTarea.id_tarea);
    
    let tarea = { ...tmpTarea };
    tarea[prop] = value;

    proyecto.tareas[foundIndex] = tarea;

    callback(proyecto, tarea);

    return {
        type: 'tr_editar',
        payload: proyecto
    }
}

export const actualizarGente = ({ rolId, persona, tmpProyecto, tmpTarea }) => {
    let proyecto = { ...tmpProyecto };
    const foundIndex = proyecto.tareas.findIndex(x=>x.id_tarea === tmpTarea.id_tarea);
    let tarea = { ...tmpTarea };

    // Si el rol destino es "responsable"
    if(rolId === 2){
        // Borrar el responsable actual
        tarea.participantes = tarea.participantes.filter(participante => { 
            return participante.role_id !== 2 && participante.id_usuario !== persona.id_usuario 
        });

        //pongo la persona como responsable
        persona.role_id = 2;

        //la guardo en el array
        tarea.participantes.push(persona);

    } else {
        persona.map(usuario => {
            if(usuario.role_id !== 3) {
                usuario.role_id = 3;
            }
        });

        // Borrar el participantes actuales actual
        tarea.participantes = tarea.participantes.filter(participante => { 
            return participante.role_id !== 3 
        });

        tarea.participantes = tarea.participantes.concat(persona);
    }

    proyecto.tareas[foundIndex] = tarea;

    return {
        type: TR_EDIT,
        payload: proyecto
    };
}

export const guardarTarea = (listaProyectos, id_proyecto, tmpTarea, snNueva, callback = () =>{}) => {

    return (dispatch) => {
        dispatch({ type: TR_GUARDAR });
        try {
            let tarea = JSON.parse(JSON.stringify(tmpTarea));
            //El usuario que edita
            tarea.id_usuario = JSON.parse(localStorage.sessionData).id_usuario;

            //Obtengo array de participantes
            tarea.participantes = generarArrayParticipantes(tarea);

            tarea.txt_tarea = Helper.htmlEncode(tarea.txt_tarea);

            //Selecciono la ruta
            const ruta = snNueva?'CrearTarea':`EditarTarea/${tarea.id_tarea}`;

            Database.request('POST', ruta, tarea, 2, (error, response) => {
                if(error || response.status > 299){
                    dispatch({ type: PY_FAIL, payload: error })
                    errorLog(response,JSON.parse(localStorage.sessionData).id_usuario);
                } else{
                    let tareaObj = Helper.clrHtml(response[0].tarea);
                    let tareaEditada = tareaObj ? JSON.parse(tareaObj)[0] : [];  

                    for(const usuario of tareaEditada.participantes) {
                        usuario.txt_usuario = Helper.decode_utf8(Helper.htmlPaso(usuario.txt_usuario));
                    }

                    tareaEditada.txt_tarea = Helper.decode_utf8(Helper.htmlPaso(tareaEditada.txt_tarea));

                    if(snNueva){
                        tareaEditada.nuevo = true;
                    }

                    const proyectoActual = listaProyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0];
                    //Agregar a proyectos principales
                    const proyectos = pyMerge(listaProyectos, proyectoActual, tareaEditada);
                    callback(tareaEditada);
                    dispatch({ 
                        type: TR_SUCCESS, 
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0], 
                            tareaActual: { id_tarea: tarea.id_tarea, editing: false, selected: true }    
                        }           
                    })
                }
            });          
        }
        catch(err) {
            dispatch({ type: PY_FAIL, payload: err })
        }                 
    }    
}

export const marcarLeida = (listaProyectos, id_proyecto, id_tarea, id_usuario, callback = () => {}) => {
    
    return (dispatch) => {
        try {
            Database.request('POST', `MarcarLeida/${id_tarea}`, { id_usuario }, 2, (error, response) => {
                if(error || response.status > 299){
                    dispatch({ type: PY_FAIL, payload: error })
                    errorLog(JSON.stringify(response),JSON.parse(localStorage.sessionData).id_usuario);
                } else{
                    const proyectoActual = listaProyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0];
                    let tareaObj = Helper.clrHtml(response[0].tarea);
                    let tareaEditada = tareaObj ? JSON.parse(tareaObj)[0] : []; 
                    tareaEditada.notificaciones = 0;                        
                    //Agregar a proyectos principales
                    const proyectos = pyMerge(listaProyectos, proyectoActual, tareaEditada);
                    callback();
                    dispatch({ 
                        type: TR_SUCCESS, 
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectoActual, 
                            tareaActual: { id_tarea: id_tarea, editing: false, selected: true }    
                        }                        
                    });
                }
            });          
        }
        catch(err) {
            dispatch({ type: PY_FAIL, payload: err })
        }                 
    }    
}

export const getTarea = (listaProyectos, id_tarea, id_usuario, selected = false) => {
    return (dispatch) => {
        try {
            Database.request('GET', `tarea/${id_tarea}?id_usuario=${id_usuario}`, {}, 2, (error, response) => {
                if(error){
                    dispatch({ type: TR_CANCEL })
                } else{
                    let tareas = Helper.clrHtml(response[0].tarea);
                    let tareaSocket = tareas ? JSON.parse(tareas)[0] : [];  

                    let proyectoActual = listaProyectos.filter(proyecto => proyecto.id_proyecto === tareaSocket.id_proyecto)[0];
                    const proyectos = pyMerge(listaProyectos, proyectoActual, tareaSocket);
                    //Vuelvo a sacar proyecto y tarea ya con datos actualizados
                    proyectoActual = proyectos.filter(proyecto => proyecto.id_proyecto === tareaSocket.id_proyecto)[0];
                    dispatch({ 
                        type: TR_SUCCESS_SOCKET, 
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectoActual, 
                            tareaActual: { id_tarea: id_tarea, editing: false, selected }
                        } 
                    });
                }
            });    
        } catch (err) {

        }
    }
}

export const clearTareaSocket = () => {
    return {
        type: TR_CANCEL
    };
}

/**
 * == COMENTARIOS ===================================================================================
 */
export const editarComentario = (txt_comentario) => {
    return { type: CM_EDIT, payload: txt_comentario }
}

export const guardarComentario = (listaProyectos, id_proyecto, id_tarea, comentario, callback) => {
    return (dispatch) => {
        dispatch({ type: CM_GUARDAR });
        try {
            comentario.txt_comentario = Helper.htmlEncode(comentario.txt_comentario);
            
            Database.requestWithFile(`CreaComentario/${id_tarea}`, comentario, "archivos", (error, res) => {
                if(error) {
                    dispatch({ type: PY_FAIL, payload: error })
                    errorLog(JSON.stringify(res),comentario.id_usuario)
                } else {
                    switch(res.type) {
                        case "progress":
                            dispatch({ type: CM_PROGRESS, payload: res.progress });
                            break;
                        case "error":
                            dispatch({ type: PY_FAIL, payload: error })
                            break;
                        case "complete":
                            let commentEditado = res.data[0] ? JSON.parse(res.data[0].comentario) : [];
                            let proyectoActual = listaProyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0];
                            let tareaActual = proyectoActual.tareas.filter(tarea => tarea.id_tarea === id_tarea)[0];
                            //Actualizo la lista de proyectos
                            const proyectos = pyMerge(listaProyectos, proyectoActual, tareaActual, commentEditado);
                            //Vuelvo a sacar proyecto y tarea ya con datos actualizados
                            proyectoActual = proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0];
                            callback(id_tarea);
                            dispatch({ 
                                type: CM_SUCCESS, 
                                payload: { 
                                    proyectos, 
                                    tmpProyecto: proyectoActual, 
                                    tareaActual: { id_tarea: id_tarea, editing: false, selected: true }
                                } 
                            });
                            break;
                        default:
                            dispatch({ type: PY_FAIL, payload: error })
                            return;
                    }
                }
            });

        } catch(err){
            dispatch({ type: PY_FAIL, payload: err })
        }
    }
}

export const editarArchivo = (file, url) => {
    return({
        type: CM_FILE_CHANGE,
        payload: {file, url}
    });
}

export const cancelarArchivo = () => {
    return({
        type: CM_FILE_CANCEL
    });
}

export const loadMore = (listaProyectos,id_proyecto, id_tarea, fecha) => {
    return(dispatch) => {
        dispatch({type: CM_MORE});
        try {
            Database.request('GET', `GetMoreComments/${id_tarea}?fecha=${fecha}`, {}, 2, (error, response) => {
                if(error) {
                    dispatch({type: PY_FAIL, payload: error})
                } else {
                    let comentarios = response[0] ? JSON.parse(response[0].comentarios) : [];
                    let proyectoActual = listaProyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0];
                    let tareaActual = proyectoActual.tareas.filter(tarea => tarea.id_tarea === id_tarea)[0];
                    //Actualizo la lista de proyectos
                    const proyectos = pyMerge(listaProyectos, proyectoActual, tareaActual, comentarios);
                    //Vuelvo a sacar proyecto y tarea ya con datos actualizados
                    proyectoActual = proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto)[0];

                    dispatch({ 
                        type: CM_SUCCESS, 
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectoActual, 
                            tareaActual: { id_tarea: id_tarea, editing: false, selected: true }
                        } 
                    });                    
                }
            });            
        } catch(err) {
            dispatch({ type: PY_FAIL, payload: err })
        }
    }
}

/**
 * == CHECKLIST =====================================================================================
 */

 export const crearSubtarea = (listaProyectos, proyecto, tarea, item) => {
    return (dispatch) => {
        dispatch({ type: TR_EDIT });
        try {
            Database.request('POST', `CrearSubtarea/${tarea.id_tarea}`, item, 2, (error, response) => {
                if(error || response.status > 299){
                    console.log(response);
                    errorLog(JSON.stringify(response),JSON.parse(localStorage.sessionData).id_usuario);
                } else {

                    let tareaEditada = { ...tarea };
                    tareaEditada.subtareas = response[0].subtareas ? JSON.parse(response[0].subtareas) : [];

                    const proyectos = pyMerge(listaProyectos, proyecto, tareaEditada);
                    const proyectoActual = proyectos.filter(py => py.id_proyecto === proyecto.id_proyecto)[0];

                    dispatch({
                        type: TR_SUCCESS_SUB,
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectoActual, 
                            tareaActual: { id_tarea: tarea.id_tarea, editing: false, selected: true }
                        } 
                    })
                }
            })
        } catch (err) {

        }
    }
 }

 export const borrarSubtarea = (listaProyectos, proyecto, tarea, item) => {
    return (dispatch) => {
        dispatch({ type: TR_EDIT });
        try {
            Database.request('POST', `BorrarSubtarea/${tarea.id_tarea}`, item, 2, (error, response) => {
                if(error || response.status > 299){
                    console.log(response);
                    errorLog(JSON.stringify(response),JSON.parse(localStorage.sessionData).id_usuario);
                } else {

                    let tareaEditada = { ...tarea };
                    tareaEditada.subtareas = tareaEditada.subtareas.filter(subtarea => subtarea.idSubtarea !== item.idSubtarea);

                    const proyectos = pyMerge(listaProyectos, proyecto, tareaEditada);
                    const proyectoActual = proyectos.filter(proyecto => proyecto.id_proyecto === proyecto.id_proyecto)[0];

                    dispatch({
                        type: TR_SUCCESS,
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectoActual, 
                            tareaActual: { id_tarea: tarea.id_tarea, editing: false, selected: true }
                        } 
                    })
                }
            })
        } catch (err) {

        }
    }
 }

 export const editarSubtarea = (listaProyectos, proyecto, tarea, item) => {
    return (dispatch) => {
        dispatch({ type: TR_EDIT });
        try {
            Database.request('POST', `EditarSubtarea/${tarea.id_tarea}`, item, 2, (error, response) => {
                if(error || response.status > 299){
                    console.log(response);
                } else {

                    let tareaEditada = { ...tarea };
                    tareaEditada.subtareas = response[0].subtareas ? JSON.parse(response[0].subtareas) : [];

                    const proyectos = pyMerge(listaProyectos, proyecto, tareaEditada);
                    const proyectoActual = proyectos.filter(proyecto => proyecto.id_proyecto === proyecto.id_proyecto)[0];

                    dispatch({
                        type: TR_SUCCESS,
                        payload: { 
                            proyectos, 
                            tmpProyecto: proyectoActual, 
                            tareaActual: { id_tarea: tarea.id_tarea, editing: false, selected: true }
                        } 
                    })
                }
            })
        } catch (err) {

        }
    }
 }
/** Error Log
 * 
 */
    function errorLog(error,id_usuario){
        Database.request('POST', 'ErrorLog', { error, id_usuario }, 0, (error, response) => {
            console.log(response);
        });
    }
/** Limpiar respuesta de PY (hacer legible)
 * 
 * @param {*} response 
 */
    function handleReponsePY(response) {
        //convertir tareas a objetos
        for(const proyecto of response) {
            const datos = Helper.clrHtml(proyecto.tareas);
            //Si son enteros convertirlos
            proyecto.id_proyecto = parseInt(proyecto.id_proyecto);
            proyecto.id_status = parseInt(proyecto.id_status);
            //Si viene vacía crear array vacio
            proyecto.tareas = proyecto.tareas ? JSON.parse(datos) : [];  
            //limpiar html
            proyecto.txt_proyecto = Helper.decode_utf8(Helper.htmlPaso(proyecto.txt_proyecto));

            //Limpiar tareas
            for(const tarea of proyecto.tareas) {
                for(const usuario of tarea.participantes) {
                    usuario.txt_usuario = Helper.decode_utf8(Helper.htmlPaso(usuario.txt_usuario));
                }

                tarea.txt_tarea = Helper.decode_utf8(Helper.htmlPaso(tarea.txt_tarea));

                //Limpiar comentarios
                for(const comentario of tarea.topComments) {
                    let coment = Helper.decode_utf8(comentario.txt_comentario);
                    coment = Helper.htmlDecode(comentario.txt_comentario);
                    comentario.txt_comentario = coment;
                }
            }


        }

        return response;
    }


/** Obtener dato Limpio
 * 
 */
    function obtieneItemLimpio(listaLimpia, datoSucio, campo) {
        let tmpListaLimpia = JSON.parse(JSON.stringify(listaLimpia));
        const foundIndex = tmpListaLimpia.findIndex(x=>x[campo] === datoSucio[campo]);
        //Si no encuentra el proyecto en la lista lo inserta (nuevo proyecto)
        if(foundIndex === -1){
            return {};
        } else {
            return tmpListaLimpia[foundIndex];
        }            
    }

/** Generar array de participantes requeridos por la API 
 * 
 */
    function generarArrayParticipantes(tarea){
        if(tarea.participantes.length === 0) {
            return tarea.participantes;
        }
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
        return participantes.join();    
    }
/** Agregar tareas, proyectos y comentarios a la lista final
 * 
 */    
    function pyMerge(proyectos_old, proyecto_old, tarea_old, comentarios_old){

        let proyectos = proyectos_old?JSON.parse(JSON.stringify(proyectos_old)):[];
        let proyecto = proyecto_old?JSON.parse(JSON.stringify(proyecto_old)):{};
        let tarea = tarea_old?JSON.parse(JSON.stringify(tarea_old)):{};
        let comentarios = comentarios_old?JSON.parse(JSON.stringify(comentarios_old)):[];
    
        let foundIndex = proyectos.findIndex(x=>x.id_proyecto === proyecto.id_proyecto);
        let tareaIndex = proyecto.tareas.findIndex(x=>x.id_tarea === tarea.id_tarea);

        //En caso de que cambió de proyecto: borro tarea del proyecto y selecciono el nuevo proyecto
        if(tarea_old !== undefined){
            if(tarea.id_proyecto !== proyecto.id_proyecto) {
                //Elimino tarea de proyecto actual y actualizo la lista general
                proyecto.tareas.splice(tareaIndex,1);
                proyectos[foundIndex] = proyecto;
                //Me cambio de proyecto
                foundIndex = proyectos.findIndex(x=>x.id_proyecto === tarea.id_proyecto);
                proyecto = proyectos[foundIndex];
                //Me cambio de tarea
                tareaIndex = proyecto.tareas.findIndex(x=>x.id_tarea === tarea.id_tarea);
            }
        }

        //Agrega comentarios
        if(comentarios !== undefined) {
            //Si es mayor que 1 comentario esque son comentarios màs viejos
            if(comentarios.length > 1) {
                tarea.topComments = tarea.topComments.concat(comentarios);
            } else if (comentarios.length === 1){
                //si es = 1 puede ser nuevo ò viejo así que checo el id
                if(tarea.topComments.length > 0 && tarea.topComments[0].id_tarea_unique < comentarios[0].id_tarea_unique) {
                    tarea.topComments = comentarios.concat(tarea.topComments);
                } else {
                    tarea.topComments = tarea.topComments.concat(comentarios);
                }
            }
            
        }
    
        if(tarea_old !== undefined) {
            //Si no encuentra la tarea en la lista la inserta (nueva tarea)
            if(tareaIndex === -1) {
                proyecto.tareas.unshift(tarea);
            } else {
                proyecto.tareas[tareaIndex] = tarea;
            }

            proyecto.taskCount = proyecto.tareas.length;
            proyecto.taskCountTerminadas = proyecto.tareas.filter(tarea => tarea.id_status != 1).length;
        }
    
        //Si no encuentra el proyecto en la lista lo inserta (nuevo proyecto)
        if(foundIndex === -1){
            proyectos.push(proyecto);
        } else {
            proyectos[foundIndex] = proyecto;
        }
    
        return proyectos.sort((a,b) => { 
            if(a.txt_proyecto < b.txt_proyecto) return -1; 
            if(a.txt_proyecto > b.txt_proyecto) return 1; 
            return 0;
        });
    }
/** Agregar lista de proyectos a lista existente
 * 
 * @param {*} proyectos_old 
 * @param {*} proyectos_add 
 */
    function pyAppendList(proyectos_old, proyectos_add){

        const proyectosReturn = [...proyectos_old];

        for(const proyecto of proyectos_add){
            
            const prold = proyectos_old.find( p => {
                return p.id_proyecto === proyecto.id_proyecto;
            });

            if(prold === undefined){
                proyectosReturn.push(proyecto);
            }

        }

        return proyectosReturn;
    }