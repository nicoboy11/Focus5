import { combineReducers } from 'redux';
import ProyectosReducer from './ProyectosReducer';
import ProyectoActualReducer from './ProyectoActualReducer';
//import TareaActualReducer from './TareaActualReducer';
import UsuariosReducer from './UsuariosReducer';
import LoginReducer from './LoginReducer';
import CommentReducer from './CommentReducer';
import SocketReducer from './SocketReducer';
import PerfilReducer from './PerfilReducers';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
    login: LoginReducer,
    listaProyectos: ProyectosReducer,
    proyectoActual: ProyectoActualReducer,
  //  tareaActual: TareaActualReducer,
    usuarios: UsuariosReducer,
    comments: CommentReducer,
    routing: routerReducer,
    socket: SocketReducer,
    perfil: PerfilReducer
});