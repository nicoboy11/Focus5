import { Database, Helper } from '../configuracion';
import {
    USUARIOS,
    USUARIO_RESPONSABLE,
    USUARIOS_PARTICIPANTES,
    USUARIOS_FAILED,
    USUARIOS_SUCCESS
} from './types';

/**
 * Carga lista de usuarios
 * @param {*} id_usuario_sesion
 */
export const listaUsuarios = (id_usuario_sesion) => {
    return (dispatch) => {
        dispatch({ type: USUARIOS });

        Database.request('GET', `usuarios/${id_usuario_sesion}`, {}, 2, (error, response) => {
            if(error){
                listaUsuariosFailed(dispatch);
              console.log(error);
            } else{
                for(const usuario of response) {
                    usuario.txt_usuario = Helper.decode_utf8(Helper.htmlPaso(usuario.txt_usuario));
                }

                listaUsuariosSuccess(dispatch, response);
            }
        });            
    }
};

const listaUsuariosFailed = (dispatch) => {
    dispatch({ type: USUARIOS_FAILED });
}

const listaUsuariosSuccess = (dispatch, proyectos) => {
    dispatch({
        type: USUARIOS_SUCCESS,
        payload: proyectos
    });
};