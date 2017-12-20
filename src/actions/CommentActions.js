import { 
    COMMENT,
    COMMENT_CHANGED,
    COMMENT_SUCCESS,
    COMMENT_FAILED,
    COMMENT_FILE_CHANGED,
    COMMENT_LIST_UPDATE,
    FILE_PROGRESS,
    FILE_CHANGE,
    FILE_CANCEL,
    MORE,
    MORE_FAILED,
    MORE_SUCCESS
} from './types';
import { Database, Helper } from '../configuracion';

export const commentChanged = (text) => {
    return {
        type: COMMENT_CHANGED,
        payload: text
    };
};

export const commentGuardar = (comentario, id_tarea) => {
    return (dispatch) => {
        dispatch({ type: COMMENT });
        try {
            comentario.txt_comentario = Helper.htmlEncode(comentario.txt_comentario);
            
            Database.requestWithFile(`CreaComentario/${id_tarea}`, comentario, (error, res) => {
                if(error) {
                    commentSaveFailed(dispatch, res);
                } else {
                    switch(res.type) {
                        case "progress":
                            fileUploadProgress(dispatch,res.progress);
                            break;
                        case "error":
                            commentSaveFailed(dispatch, res);
                            break;
                        case "complete":
                            let commentEditado = res.data[0] ? JSON.parse(res.data[0].comentario) : [];
                            commentSaveSuccess(dispatch, { comentario: commentEditado });
                            break
                        default:
                            commentSaveFailed(dispatch, res);
                            return;
                    }
                }
            });

            /*
            comentario.txt_comentario = Helper.htmlEncode(comentario.txt_comentario);

            Database.request('POST', `CreaComentario/${id_tarea}`, comentario, 2, (error, response) => {
                if(error) {
                    commentSaveFailed(dispatch);
                } else {
                    let commentEditado = response[0] ? JSON.parse(response[0].comentario)[0] : [];
                    commentSaveSuccess(dispatch, { comentario: commentEditado });
                }
            });
            */
        } catch(err){
            commentSaveFailed(dispatch);
        }
    }
}

export const commentListUpdate = (comentario, tarea, proyecto) => {
    return({
        type: COMMENT_LIST_UPDATE
    })
}

export const fileChange = (file, url) => {
    return({
        type: FILE_CHANGE,
        payload: {file, url}
    });
}

export const fileCancel = () => {
    return({
        type: FILE_CANCEL
    });
}

export const loadMore = (id_tarea, fecha) => {
    return(dispatch) => {
        try {
            Database.request('GET', `GetMoreComments/${id_tarea}?fecha=${fecha}`, {}, 2, (error, response) => {
                if(error) {
                    dispatch({type: MORE_FAILED, payload: error})
                } else {
                    let comentarios = response[0] ? JSON.parse(response[0].comentarios) : [];
                    dispatch({type: MORE_SUCCESS, payload: comentarios});
                }
            });            
        } catch(err) {
            dispatch({ type: MORE_FAILED, payload: err })
        }
    }
}

const fileUploadProgress = (dispatch, progress) => {
    dispatch({
        type: FILE_PROGRESS,
        payload: progress        
    });
}

const commentSaveFailed = (dispatch, error) => {
    dispatch({ type: COMMENT_FAILED, payload: error });
}

const commentSaveSuccess = (dispatch, comment) => {
    dispatch({
        type: COMMENT_SUCCESS,
        payload: comment
    });
};