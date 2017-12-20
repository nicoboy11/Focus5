import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';

import { Chats, Personal } from './pages';
import { MenuTop } from './components';
import MenuBar from './components/MenuBar';

import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cargarPerfil, limpiarTareaActual } from './actions'
import { bindActionCreators } from 'redux';

import Ajustes from './pages/Ajustes';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';
import Login from './pages/Login';

import 'react-datepicker/dist/react-datepicker.css';
import { Config } from './configuracion';

const { menu } = Config;


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      datos: [],
      currentView: 'proyectos',
      sessionData: {}
    };
  }

  componentWillMount(){
    this.props.cargarPerfil();
  }

  renderMenu(jsx){
    /*if(this.props.sessionData === null){
      return null;
    }*/

    return jsx;
  }

  render() {

    let title = "";
    let breadCrumb = "";

    const currentRoute = window.location.pathname;
    let current = menu.filter(
        obj => currentRoute.includes(obj.uri)
    )[0];    

    if(current !== undefined) {
      switch(current.nombre) {
        case "Proyectos": 
          if(this.props.proyectoActual.proyecto.id_proyecto === undefined) {
            title = "Proyectos";
          } else {
            title = this.props.proyectoActual.proyecto.txt_proyecto;
            breadCrumb = "Proyectos";
          }
          if(this.props.tareaActual.tarea.id_tarea !== undefined && currentRoute.split('/').length < 3) {
            this.props.limpiarTareaActual();
          }
          break;
        case "Chats":
          title = "Chats"
          break;
        case "Personal":
          title = "Personal";
          break;
        case "Ajustes":
          title = "Ajustes";
          break;
        default:
          break;
      }
    } else {
      current = { nombre: '' }
    }

    
    return (
          <div className="App">
            <div id="main">
                <Route exact path="/" component={Login} />
                <Route exact path="/proyectos" render={(props) =>(
                  <Proyectos datos={this.state.datos} />
                )} />
                <Route path="/proyectos/:id" component={Tareas} />              
                <Route path="/chats" component={Chats} />
                <Route path="/personal" component={Personal} />
                <Route path="/ajustes" component={Ajustes} />
            </div>
            {this.renderMenu(<MenuTop 
                                currentTitle={title} 
                                breadCrumb={breadCrumb} 
                                onLogout={() =>{
                                  localStorage.removeItem("sessionData");
                                  window.location = '/';
                                }}
                              />)}
            {this.renderMenu(<MenuBar currentMenu={current.nombre} />)}
          </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  cargarPerfil,
  limpiarTareaActual
}, dispatch)

const mapStateToProps = state => {
  return { 
      proyectos: state.listaProyectos.proyectos,
      proyectoActual: state.proyectoActual,
      tareaActual: state.tareaActual,
      perfil: state.perfil
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));