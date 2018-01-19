import React, {Component} from 'react';
import { Config } from '../configuracion';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const { menu } = Config;

class MenuBar extends Component{

    onClick(e, location){
        this.props.changePage(location);
    }

    renderMenu(menu){
        const {
            nombre,
            uri,
            icono
        } = menu;

        const currentRoute = window.location.pathname;
        let isSelected = false;

        if(currentRoute.includes(uri)){
            isSelected = true;
        }

        const selectedClass = isSelected ? "menuBarSelected" : "";
        const selectedColor = isSelected ? "mainColor" : "";        

        return(
            <div 
                id={"menuBar" + nombre}
                className={"menuBarItem " + selectedClass} 
                data-key={nombre} 
                onClick={(e) => this.onClick(e,uri)}
            >
                <i className={"material-icons menuBarIcon " + selectedColor}>{icono}</i>
                {nombre}
            </div>
        );
    }

    render(){

        return(
            <div id="menuBar">
                <div id="menuBarContainer">
                    {this.renderMenu(menu[0])}
                    {this.renderMenu(menu[1])}
                    {this.renderMenu(menu[2])}
                    {this.renderMenu(menu[3])}                
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { 
        proyectos: state.listaProyectos.proyectos
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({
    changePage: (location) => push(location),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);