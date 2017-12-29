import {
    PY_LIST,    PY_SUCCESS,     PY_FAIL,
    PY_SELECT,  PY_UNSELECT,    PY_EDIT,
    PY_GUARDAR, TR_SELECT,      TR_UNSELECT,
    TR_EDIT,    TR_GUARDAR,     TR_NEW_TXT,
    CM_EDIT,    CM_GUARDAR,     CM_PROGRESS,
    CM_SUCCESS, CM_FILE_CHANGE, CM_FILE_CANCEL,
    TR_SUCCESS, TR_CANCEL
} from '../actions/types';

const INITIAL_STATE = { 
    proyectos: [], 
    tmpProyecto: { tareas: []}, 
    tareaNuevaTxt: '', 
    tareaSocket: {},
    comentarioNuevo: '',
    archivoNuevo: {file: {}, url: ''},
    tareaActual: { id_tarea: null, editing: false, selected: false },
    loading: false,
    progress: null,
    error: ''
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PY_LIST:
            return { ...state, loading: true }
        case PY_SUCCESS:
            return { ...state, ...INITIAL_STATE, proyectos: action.payload }
        case PY_FAIL:
            return { ...state, loading: false, progress: null }
        case PY_SELECT:
            return { ...state, tmpProyecto: action.payload }
        case PY_UNSELECT:
            return { ...state, tmpProyecto: {} }
        case PY_EDIT:
            return { ...state, tmpProyecto: action.payload }
        case PY_GUARDAR:
            return { ...state, loading: true }
        /** TAREAS */
        case TR_SELECT:
            return { ...state, tareaActual: action.payload }
        case TR_UNSELECT:
            return { ...state, tmpProyecto: action.payload }
        case TR_GUARDAR:
            return { ...state, loading: true }
        case TR_NEW_TXT:
            return { ...state, tareaNuevaTxt: action.payload }
        case TR_SUCCESS:
            return { ...state, proyectos: action.payload }
        case TR_CANCEL:
            return { ...state }
        /** COMENTARIOS */
        case CM_EDIT:
            return { ...state, comentarioNuevo: action.payload }
        case CM_GUARDAR:
            return { ...state, loading: true }
        case CM_PROGRESS:
            return { ...state, progress: action.payload }
        case CM_SUCCESS:
            return { ...state, ...INITIAL_STATE, proyectos: action.payload.proyectos, tareaActual: action.payload.tareaActual, tmpProyecto: action.payload.tmpProyecto}
        case CM_FILE_CHANGE:
            return { ...state, archivoNuevo: action.payload }
        default:
            return state;
    }
};