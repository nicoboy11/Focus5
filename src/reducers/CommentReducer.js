import { 
    COMMENT,
    COMMENT_CHANGED,
    COMMENT_SUCCESS,
    COMMENT_FAILED,
    COMMENT_FILE_CHANGED,
    COMMENT_LIST_UPDATE,
    FILE_PROGRESS,
    FILE_CHANGE,
    FILE_CANCEL
} from '../actions/types'

const INITIAL_STATE = {
    comment: {},
    commentText: '',
    loading: false,
    error: '',
    progress: -1,
    loadingFile: false,
    archivo: null,
    url: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case COMMENT_CHANGED:
            return { ...state, commentText: action.payload }
        case COMMENT:
            return { ...state, loading: true, error: '' }
        case COMMENT_SUCCESS:
            return { ...state, comment: action.payload.comentario, commentText: '', loading: false, loadingFile: false, archivo: null, url: '' }
        case COMMENT_FAILED:
            return { ...state, loading: false, error: action.payload, loadingFile: false }
        case COMMENT_LIST_UPDATE:
            return { ...state, loading: false, error: '', comment: {}}
        case FILE_PROGRESS:
            return { ...state, progress: action.payload, loadingFile: true }     
        case FILE_CHANGE:
            return { ...state, archivo: action.payload.file, url: action.payload.url } 
        case FILE_CANCEL:
            return { ...state, archivo: null, url: '' }                   
        default:
            return state;
    }
}