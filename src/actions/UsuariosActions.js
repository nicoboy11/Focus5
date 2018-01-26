import { Database, Helper } from '../configuracion';
import {
    USUARIOS,
    USUARIOS_FAILED,
    USUARIOS_SUCCESS,
    USR_EDIT,
    USR_SELECT,
    USR_GUARDAR
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
                    usuario.isOpen = false;
                    usuario.isVisible = false;
                    usuario.isOpenRed = false;
                    usuario.isVisibleRed = false;                    

                    if(JSON.parse(localStorage.sessionData).id_usuario === usuario.id_usuario || usuario.nivel === 1){
                        usuario.isVisible = true;
                        usuario.isVisibleRed = true;
                    }
                }

                listaUsuariosSuccess(dispatch, response);
            }
        });            
    }
};

export const mostrarHijos = (usuarios, usuario,red) => {

    const _usuarios = [...usuarios];
    const isOpening = !usuario.isOpen;
    const isOpeningRed = !usuario.isOpenRed;

    //Hago un loop en todos los usuarios
    for(const usr of _usuarios) {
        //Si pertenece a una llave (es decir, es hijo del papá) lo hago visible
        if(usr.levelKey.includes(usuario.levelKey) && usr.nivel > usuario.nivel){
            //Si va a cerrarse hay que esconder a los hijos
            if(red){
                if(isOpeningRed && usr.nivel === usuario.nivel +1){
                    usr.isVisibleRed = true;
                } else {
                    usr.isVisibleRed = false;
                    usr.isOpenRed = false;
                }
            } else {
                if(isOpening && usr.nivel === usuario.nivel +1){
                    usr.isVisible = true;
                } else {
                    usr.isVisible = false;
                    usr.isOpen = false;
                }
            }
        }

        //El usuario actual se mostrará como "abierto"
        if(red){
            if(usr.id_usuario === usuario.id_usuario){
                usr.isOpenRed = !usr.isOpenRed;
            }            
        } else {
            if(usr.id_usuario === usuario.id_usuario){
                usr.isOpen = !usr.isOpen;
            }
        }
    }

    return {
        type: USR_EDIT,
        payload: _usuarios
    }
}

export const seleccionarUsuario = (usuario) => {
    return {
        type: USR_SELECT,
        payload: usuario
    }
}

export const editaUsuario = ({ prop, value, usuario }) => {
    const _usuario = {...usuario};
    _usuario[prop] = value;

    return {
        type: USR_SELECT,
        payload: _usuario
    }
}

export const guardarUsuario = (listaUsuarios, usuario) => {
    return (dispatch) => {
        dispatch({ type: USR_GUARDAR});

        Database.request('POST', `EditarUsuario/${usuario.id_usuario}`, usuario, 2, (error, response) => {
            if(error || response.status > 299){
                console.log(response);
                listaUsuariosFailed(dispatch);
            } else {

                const usuarios = [...listaUsuarios];
                let foundIndex = usuarios.findIndex(x=>x.id_usuario === usuario.id_usuario);
                usuarios[foundIndex] = response[0];

                listaUsuariosSuccess(dispatch, usuarios);
            }
        });
    }
}

const listaUsuariosFailed = (dispatch) => {
    dispatch({ type: USUARIOS_FAILED });
}

const listaUsuariosSuccess = (dispatch, usuarios) => {
    dispatch({
        type: USUARIOS_SUCCESS,
        payload: usuarios
    });
};