import { 
    COMMENT,
    COMMENT_CHANGED,
    COMMENT_SUCCESS,
    COMMENT_FAILED,
    COMMENT_FILE_CHANGED,
    COMMENT_LIST_UPDATE,
    FILE_PROGRESS
} from './types';
import { Database, Helper } from '../configuracion';

export const commentChanged = (text) => {
    return {
        type: COMMENT_CHANGED,
        payload: text
    };
};

export const commentGuardar = (comentario, id_tarea, attachment) => {
    return (dispatch) => {
        try {

            Database.fileUpload(attachment, (error, res) => {
                if(error) {

                } else {
                    switch(res.type) {
                        case "progress":
                            fileUploadProgress(dispatch,res.progress);
                        default:
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

const fileUploadProgress = (dispatch, progress) => {
    dispatch({
        type: FILE_PROGRESS,
        payload: progress        
    });
}

const commentSaveFailed = (dispatch) => {
    dispatch({ type: COMMENT_FAILED });
}

const commentSaveSuccess = (dispatch, comment) => {
    dispatch({
        type: COMMENT_SUCCESS,
        payload: comment
    });
};