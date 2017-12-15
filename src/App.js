import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';
import { MenuTop } from './components';
import MenuBar from './components/MenuBar';
import { Route, Switch } from 'react-router-dom';
import { Chats, Personal, Ajustes } from './pages';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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

  componentDidMount(){
    
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

const mapStateToProps = state => {
  return { 
      proyectos: state.listaProyectos.proyectos,
      proyectoActual: state.proyectoActual,
      tareaActual: state.tareaActual
  }
};

export default withRouter(connect(mapStateToProps, {})(App));