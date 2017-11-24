import React, { Component } from 'react';
import { Config, Database } from '../configuracion';
import { Proyecto } from '../components';

class Proyectos extends Component{
    constructor(props){
        super(props);
    
        this.state = {
          datos: [],
          currentView: 'proyectos'
        };
    }

    componentWillMount(){
        if(this.props.datos){
            this.setState({ datos: this.props.datos});
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({ ...nextProps });
    }

    renderList(){
        const items = this.props.datos;
        return items.map(item => {
            return (
                <Proyecto 
                    key={item.id_proyecto} 
                    id_proyecto={item.id_proyecto}
                    txt_proyecto={item.txt_proyecto}
                    fec_inicio={item.fec_inicio}
                    fec_fin={item.fec_fin}
                    id_status={item.id_status}
                    participantes={item.participantes}
                    tareas={item.tareas}
                />
            );
        });
    }

    render(){
        return(
            <div id="mainProyectos" style={{display:'block'}}>
                <div id="list">
                    <div className="project w3-col newProject w3-card" style={{justifyContent: 'center', alignItems: 'center', maxHeight: '181px'}}>
                        <div className="w3-circle newItem">
                            <i className="material-icons fHuge">add</i>
                        </div>
                        Nuevo Proyecto
                    </div>                    
                    {this.renderList()}
                </div>       
            </div>
        );        
    }

}

export { Proyectos };