import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';
import { MenuTop } from './components';
import MenuBar from './components/MenuBar';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Chats, Personal, Ajustes } from './pages';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      datos: [],
      currentView: 'proyectos'
    };
  }

  componentDidMount(){
    
  }

  render() {

    return (
          <div className="App">
            <div id="main">
                <Route exact path="/proyectos" render={(props) =>(
                  <Proyectos datos={this.state.datos} />
                )} />
                <Route path="/proyectos/:id" component={Tareas} />              
                <Route path="/chats" component={Chats} />
                <Route path="/personal" component={Personal} />
                <Route path="/ajustes" component={Ajustes} />
            </div>
            <MenuTop />
            <MenuBar />          
          </div>
    );
  }
}

export default App;
