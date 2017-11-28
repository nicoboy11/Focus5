import React, { Component } from 'react';
import { Proyecto } from '../components';
import { withRouter } from 'react-router-dom';

import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cargarProyectos, selectProyecto } from '../actions';

class Proyectos extends Component{
    constructor(props){
        super(props);
    
        this.state = {
          datos: [],
          currentView: 'proyectos'
        };
    }

    /**
     * Al abrir esta pantalla por primera vez se cargan todos los proyectos y las tareas
     */
    componentWillMount(){
       this.props.cargarProyectos(12);
    }

    /**
     * Cuando se selecciona un proyecto se manda al reducer para almacenar "current_id_proyecto" en el state
     * Después se cambia a la pagina de /proyects/:id
     * @param {*} id_proyecto 
     */
    onProyectoSelect(id_proyecto){
        this.props.selectProyecto(id_proyecto);
        this.props.changePage(id_proyecto);
    }

    /**
     * Si ya hay proyectos en el state los renderiza, si no carga un "cargando..."
     */
    renderList(){
        const items = this.props.proyectos;

        if(items.length === 0){
            return <div>Cargando...</div>
        }

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
                    onProyectoSelect={() => this.onProyectoSelect(item.id_proyecto)}
                />
            );
        });
    }

    /**
     * Renderiza la tarjeta de "Nuevo proyecto " y posteriormente la lista de proyectos
     */
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

/**
 * Los states que se usan en esta pagina son: la lista de proyectos y el proyecto seleccionado actualmente
 * @param {*} state 
 */
const mapStateToProps = state => {
    return { 
        proyectos: state.proyectos.proyectos, 
        id_proyecto: state.proyectos.current_id_proyecto 
    }
};

/**
 * Se utilizan los Action Creators para Cargar proyecto, seleccionar proyecto y para el cambio de página
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => bindActionCreators({
    cargarProyectos,
    selectProyecto,
    changePage: (id_proyecto) => push(`proyectos/${id_proyecto}`)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Proyectos)