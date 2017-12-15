import React, {Component} from 'react'
import { Config } from '../configuracion';

const { menu, network } = Config;

class MenuTop extends Component{
    renderBreadCrumb() {
        if(this.props.breadCrumb !== ""){
            return (
                <div style={{ display: 'flex'}}>
                    {this.props.breadCrumb}
                    <i class="material-icons fadeColor">keyboard_arrow_right</i>
                </div>
            );
        }
 
    }
    renderTitulo(){

            return (
                <div className="currentTitle">
                    {this.props.currentTitle}
                </div>            
            )

    }

    render(){
        if(localStorage.sessionData === undefined){
            return null;
        }
        return(
            <div id="topBar">
                <div id="marca">
                    <div id="avatar">
                            <div id="sessionAvatarContainer" className="fadeColor">
                                <img id="sessionAvatar" className="w3-circle" src={`${network.server}/avatars/${JSON.parse(localStorage.sessionData).id_usuario}.jpg`} alt="" />
                            </div>
                    </div>            
                </div>
                <div id="topBarContainer">
                    <div id="titulo">
                        <div className="breadCrumbs fadeColor">
                            {this.renderBreadCrumb()}
                        </div>
                        {this.renderTitulo()}
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