import { combineReducers } from 'redux';
import ProyectosReducer from './ProyectosReducer';
import ProyectoActualReducer from './ProyectoActualReducer';
import TareaActualReducer from './TareaActualReducer';
import UsuariosReducer from './UsuariosReducer';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    listaProyectos: ProyectosReducer,
    proyectoActual: ProyectoActualReducer,
    tareaActual: TareaActualReducer,
    usuarios: UsuariosReducer,
    routing: routerReducer
});