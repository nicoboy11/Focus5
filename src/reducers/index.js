import { combineReducers } from 'redux';
import ProyectosReducer from './ProyectosReducer';
import UsuariosReducer from './UsuariosReducer';
import LoginReducer from './LoginReducer';
import SocketReducer from './SocketReducer';
import PerfilReducer from './PerfilReducers';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    login: LoginReducer,
    listaProyectos: ProyectosReducer,
    usuarios: UsuariosReducer,
    routing: routerReducer,
    socket: SocketReducer,
    perfil: PerfilReducer
});