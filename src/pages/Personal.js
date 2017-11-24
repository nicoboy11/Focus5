import React, { Component } from 'react';
import { Config, Database } from '../configuracion';

class Personal extends Component{
    constructor(props){
        super(props);

    }

    componentWillMount(){
    }

    componentWillReceiveProps(nextProps){
    }

    render(){
        return(
            <div id="mainProyectos" style={{display:'block'}}>
                personal        
            </div>
        );        
    }

}

export { Personal };