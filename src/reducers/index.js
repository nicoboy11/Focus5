import { combineReducers } from 'redux';
import ProyectosReducer from './ProyectosReducer';
import SingleProyectReducer from './SingleProyectReducer';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    proyectos: ProyectosReducer,
    proyecto: SingleProyectReducer,
    routing: routerReducer
});