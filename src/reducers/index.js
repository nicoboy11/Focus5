import { combineReducers } from 'redux';
import ProyectosReducer from './ProyectosReducer';
import { routerReducer } from 'react-router-redux'

export default combineReducers({
    proyectos: ProyectosReducer,
    routing: routerReducer
});