import {
    PY_LIST,    PY_SUCCESS,     PY_FAIL,
    PY_SELECT,  PY_UNSELECT,    PY_EDIT,
    PY_GUARDAR, TR_SELECT,      TR_UNSELECT,
    TR_GUARDAR, TR_NEW_TXT,
    CM_EDIT,    CM_GUARDAR,     CM_PROGRESS,
    CM_SUCCESS, CM_FILE_CHANGE, 
    TR_SUCCESS, TR_CANCEL,      CM_MORE,
    TR_LEIDA,   CM_FILE_CANCEL, TR_EDIT,
    PY_MORE_SUCCESS, BSR_EDIT,  TR_SUCCESS_SUB,
    FLTR_NTF,   REFS, TR_SUCCESS_SOCKET
} from '../actions/types';

const INITIAL_STATE = { 
    proyectos: [], 
    tmpProyecto: { tareas: []}, 
    tareaNuevaTxt: '', 
    checkText: '',
    tareaSocket: {},
    comentarioNuevo: '',
    archivoNuevo: {file: {}, url: ''},
    tareaActual: { id_tarea: null, editing: false, selected: false },
    loading: false,
    loadingFile: false,
    loadingMore: false,
    loadingChecklist: false,
    loadingTarea: false,
    loadingProyecto: false,
    progress: null,
    error: '',
    buscar: '',
    fltrNtf: false,
    listaRef: []
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case PY_LIST:
            return { ...state, error: '', fltrNtf: false, loading: true }
        case PY_SUCCESS:
            return { ...state, error: '', fltrNtf: false, ...INITIAL_STATE, proyectos: action.payload }
        case PY_MORE_SUCCESS:
            return { ...state, error: '', fltrNtf: false, proyectos: action.payload.proyectos, tmpProyecto: action.payload.proyectoEditado }            
        case PY_FAIL:
            return { ...state, error: action.payload, fltrNtf: false, loading: false, loadingTarea: false, loadingProyecto: false, loadingFile: false, loadingMore: false, progress: null }
        case PY_SELECT:
            return { ...state, error: '', fltrNtf: false, tmpProyecto: action.payload }
        case PY_UNSELECT:
            return { ...state, error: '', fltrNtf: false, tmpProyecto: {} }
        case PY_EDIT:
            return { ...state, error: '', fltrNtf: false, tmpProyecto: action.payload }
        case PY_GUARDAR:
            return { ...state, error: '', fltrNtf: false, loadingProyecto: true }
        /** TAREAS */
        case TR_SELECT:
            return { ...state, error: '', fltrNtf: false, tareaActual: action.payload }
        case TR_UNSELECT:
            return { ...state, error: '', fltrNtf: false, tmpProyecto: action.payload }
        case TR_GUARDAR:
            return { ...state, error: '', fltrNtf: false, loadingTarea: true }
        case TR_NEW_TXT:
            return { ...state, error: '', fltrNtf: false, tareaNuevaTxt: action.payload }
        case TR_EDIT:
            return { ...state, error: '', fltrNtf: false, loadingChecklist: true }
        case TR_SUCCESS:
            let tareaActual = {};
            if(action.payload.tareaActual.selected){
                tareaActual = { tareaActual: action.payload.tareaActual }
            }
            return { ...state, error: '', fltrNtf: false, proyectos: action.payload.proyectos, ...tareaActual, tmpProyecto: action.payload.tmpProyecto, loadingTarea: false, loadingChecklist: false, loading: false/*, tmpProyecto: { tareas: []}*/ }
        case TR_SUCCESS_SOCKET:
            return { ...state, proyectos: action.payload.proyectos }
        case TR_SUCCESS_SUB:
            let tareaActual_sub = {};
            if(action.payload.tareaActual.selected){
                tareaActual_sub = { tareaActual: action.payload.tareaActual }
            }
            return { ...state, error: '', fltrNtf: false, proyectos: action.payload.proyectos, ...tareaActual_sub, tmpProyecto: action.payload.tmpProyecto, loadingTarea: false, loadingChecklist: false, loading: false }            
        case TR_CANCEL:
            return { ...state, error: '', fltrNtf: false }
        /** COMENTARIOS */
        case CM_EDIT:
            return { ...state, error: '', fltrNtf: false, comentarioNuevo: action.payload }
        case CM_GUARDAR:
            return { ...state, error: '', fltrNtf: false, loading: true }
        case CM_MORE:
            return { ...state, loadingMore: true, fltrNtf: false}            
        case CM_PROGRESS:
            return { ...state, error: '', fltrNtf: false, progress: action.payload, loadingFile: true }
        case CM_SUCCESS:
            return { ...state, ...INITIAL_STATE, proyectos: action.payload.proyectos, tareaActual: action.payload.tareaActual, tmpProyecto: action.payload.tmpProyecto}
        case CM_FILE_CHANGE:
            return { ...state, error: '', fltrNtf: false, archivoNuevo: action.payload }
        case CM_FILE_CANCEL:
            return { ...state, error: '', fltrNtf: false, archivoNuevo: { file: {}, url: '' }}       
        case BSR_EDIT:
            return { ...state, buscar: action.payload, fltrNtf: false }     
        case FLTR_NTF:
            return { ...state, fltrNtf: action.payload}   
        case REFS:
            return { ...state, listaRef: action.payload}      
        default:
            return { ...state };
    }
};