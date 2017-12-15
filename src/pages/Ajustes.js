import React, { Component } from 'react';
import { Card } from '../components';

class Ajustes extends Component{

    componentWillMount(){
    }

    componentWillReceiveProps(nextProps){
    }

    render(){
        return(
            <div id="mainProyectos" style={{display:'block'}}>
                <button onClick={() => { localStorage.removeItem("sessionData"); } }>Cerrar Session</button>
                <Card 
                    titulo="Editar Perfil"
                    icono="person"
                />
                <Card 
                    titulo="Cambiar Contraseña"
                    icono="lock"
                />                
            </div>
        );        
    }

}

export { Ajustes };