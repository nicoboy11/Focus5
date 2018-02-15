import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';
import './css/animate.css';

import { Chats } from './pages';
import { MenuTop } from './components';
import MenuBar from './components/MenuBar';

import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { cargarPerfil, filtraNotificaciones, guardaRefs, desseleccionarProyecto } from './actions'
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'

import Ajustes from './pages/Ajustes';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';
import Login from './pages/Login';
import Personal from './pages/Personal';

import 'react-datepicker/dist/react-datepicker.css';
import { Config } from './configuracion';

const { menu, network } = Config;


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
    document.title = 'Focus';
  }

  componentDidMount(){
    if(this.refs.ifmcontentstoprint !== undefined){
      this.props.guardaRefs(this.props.listaRef, this.refs.ifmcontentstoprint)
    }
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
          if(this.props.proyectoActual.id_proyecto === undefined) {
            title = "Proyectos";
          } else {
            title = this.props.proyectoActual.txt_proyecto;
            breadCrumb = "Proyectos";
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

    let notificaciones = 0;
    for(let proyecto of this.props.proyectos){
      for(let tarea of proyecto.tareas){
        notificaciones += tarea.notificaciones;
      }
    }
      
    return (
          <div className="App">
            <iframe ref="ifmcontentstoprint" id="ifmcontentstoprint" style={{height: '0px', width: '0px', position: 'absolute'}}></iframe>
            <div id="main">
                <Route exact path={`${network.basename}/`} component={Login} />
                <Route exact path={`${network.basename}/proyectos`} render={(props) =>(
                  <Proyectos datos={this.state.datos} />
                )} />
                <Route path={`${network.basename}/proyectos/:id`} component={Tareas} />              
                <Route path={`${network.basename}/chats`} component={Chats} />
                <Route path={`${network.basename}/personal`} component={Personal} />
                <Route path={`${network.basename}/ajustes`} component={Ajustes} />
            </div>
            {this.renderMenu(<MenuTop 
                                currentTitle={title} 
                                breadCrumb={breadCrumb} 
                                notificaciones={notificaciones}
                                notifSelected={this.props.fltrNtf}
                                refs2Print={this.props.listaRef}
                                onLogout={() =>{
                                  localStorage.removeItem("sessionData");
                                  window.location = `${network.basename}/`;
                                }}
                                onClick={() =>{
                                    this.props.changePage(`${network.basename}/proyectos`);
                                    this.props.desseleccionarProyecto();
                                }}
                                onNotifClick={() => {
                                  if(!this.props.fltrNtf){
                                    window.location.hash = '#notificaciones'
                                  } else {
                                    window.location.hash = ''
                                  }
                                  this.props.filtraNotificaciones(!this.props.fltrNtf);
                                }}
                            />)}
            {this.renderMenu(<MenuBar currentMenu={current.nombre} />)}
          </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  cargarPerfil,
  filtraNotificaciones,
  guardaRefs,
  desseleccionarProyecto,
  changePage: (location) => push(location)
}, dispatch)

const mapStateToProps = state => {
  return { 
      proyectos: state.listaProyectos.proyectos,
      proyectoActual: state.listaProyectos.tmpProyecto,
      //tareaActual: state.tareaActual,
      perfil: state.perfil,
      fltrNtf: state.listaProyectos.fltrNtf,
      listaRef: state.listaProyectos.listaRef
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));