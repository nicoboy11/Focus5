import { 
    FILE_PROGRESS
} from '../actions/types'

const INITIAL_STATE = {
    file: {},
    progress: '',
    loading: false,
    error: ''
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case FILE_PROGRESS:
            return { ...state, progress: action.payload, loading: true }
        default:
            return state;
    }
}