import { 
    COMMENT,
    COMMENT_CHANGED,
    COMMENT_SUCCESS,
    COMMENT_FAILED,
    COMMENT_FILE_CHANGED,
    COMMENT_LIST_UPDATE
} from '../actions/types'

const INITIAL_STATE = {
    comment: {},
    commentText: '',
    loading: false,
    error: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case COMMENT_CHANGED:
            return { ...state, commentText: action.payload }
        case COMMENT:
            return { ...state, loading: true, error: '' }
        case COMMENT_SUCCESS:
            return { ...state, comment: action.payload.comentario, commentText: '', loading: true }
        case COMMENT_FAILED:
            return { ...state, loading: false, error: action.payload }
        case COMMENT_LIST_UPDATE:
            return { ...state, loading: false, error: '', comment: {}}
        default:
            return state;
    }
}