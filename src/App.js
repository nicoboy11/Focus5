import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';
import { List, MenuBar, MenuTop } from './components';
import { Config, Database } from './configuracion';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Proyectos, Chats, Personal, Ajustes, Tareas } from './pages';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      datos: [],
      currentView: 'proyectos'
    };
  }

  componentDidMount(){
      Database.request('GET', `contenido/${12}`, {}, 2, (error, response) => {
          if(error){
            console.log(error);
          } else{
            console.log(response);
            this.setState({ datos: response });
          }
      });        
  }

  render() {
    return (
      <Router>
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
      </Router>
    );
  }
}

export default App;
