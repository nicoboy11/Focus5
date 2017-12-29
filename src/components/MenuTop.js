import React, {Component} from 'react'
import { Config } from '../configuracion';

const { menu, network } = Config;

class MenuTop extends Component{
    renderBreadCrumb() {
        if(this.props.breadCrumb !== ""){
            return (
                <div 
                    style={{ display: 'flex'}}
                    onClick={() => {
                        this.props.onClick();
                    }}
                >                    
                    {this.props.breadCrumb}
                    <i className="material-icons fadeColor">keyboard_arrow_right</i>
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
                <div id="topBarContainer" style={styles.topBarStyle}>
                    <div id="titulo">
                        <div className="breadCrumbs fadeColor">
                            {this.renderBreadCrumb()}
                        </div>
                        {this.renderTitulo()}
                    </div>
                    <div style={styles.buttonStyle} id="searchBar">
                        <i className="material-icons fadeColor barButton">search</i>
                    </div>            
                    <div style={styles.buttonStyle} id="notification">
                        <i className="material-icons fadeColor barButton">notifications_none</i>
                    </div>        
                    <div 
                        style={styles.buttonStyle} 
                        id="cerrar" 
                        onClick={() => {
                            this.props.onLogout();
                        }}>
                        <i className="material-icons fadeColor barButton">power_settings_new</i>
                    </div>    
                </div>
            </div>            
        );
    }
}

const styles = {
    buttonStyle: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer'
    },
    topBarStyle: {
        display: 'flex',
        flex: 1,
        top: '0px',
        bottom: '0px',
        marginRight:'10px'
    }
}

export {MenuTop}