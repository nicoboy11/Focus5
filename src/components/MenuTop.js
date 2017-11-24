import React, {Component} from 'react'
import { Config } from '../configuracion';

const { menu } = Config;

class MenuTop extends Component{
    renderBreadCrumbs(){
        const currentRoute = window.location.pathname;
        const current = menu.filter(
            obj => currentRoute.includes(obj.uri)
        );

        return (
            <div className="currentTitle">
                {current[0].nombre}
            </div>            
        )
    }

    render(){
        return(
            <div id="topBar">
                <div id="marca">
                    <div id="avatar">
                            <div id="sessionAvatarContainer" className="fadeColor">
                                <img id="sessionAvatar" className="w3-circle" src="img/avatar/12.jpg" alt="" />
                            </div>
                    </div>            
                </div>
                <div id="topBarContainer">
                    <div id="titulo">
                        <div className="breadCrumbs fadeColor">
                        </div>
                        {this.renderBreadCrumbs()}
                    </div>
                    <div id="searchBar">
                            <i className="material-icons fadeColor">search</i>
                        </div>            
                    <div id="notification">
                        <i className="material-icons fadeColor">notifications_none</i>
                    </div>            
                </div>
            </div>            
        );
    }
}

export {MenuTop}