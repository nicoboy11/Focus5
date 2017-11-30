import { combineReducers } from 'redux';
import ProyectosReducer from './ProyectosReducer';
import ProyectoActualReducer from './ProyectoActualReducer';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    listaProyectos: ProyectosReducer,
    proyectoActual: ProyectoActualReducer,
    routing: routerReducer
});