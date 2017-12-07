import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';
import { MenuTop } from './components';
import MenuBar from './components/MenuBar';
import { Route, Switch } from 'react-router-dom';
import { Chats, Personal, Ajustes } from './pages';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';
import Login from './pages/Login';
import 'react-datepicker/dist/react-datepicker.css';

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
            {this.renderMenu(<MenuTop />)}
            {this.renderMenu(<MenuBar />)}
          </div>
    );
  }
}

export default App