import React, {Component} from 'react'
import { Config } from '../configuracion';
import swal from 'sweetalert';

const { network } = Config;

class MenuTop extends Component{
    renderBreadCrumb() {
        if(this.props.breadCrumb !== ""){
            return (
                <div 
                    style={{ display: 'flex', cursor: 'pointer'}}
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
        if(localStorage.sessionData === undefined || localStorage.sessionData === 'undefined'){
            return null;
        }

        let notifStyle = {};
        if(this.props.notifSelected){
            notifStyle = styles.selectedMenu;
        }

        const currentHash = window.location.hash;
        if(currentHash.split("#")[1] === "notificaciones" && !this.props.notifSelected && this.refs.ntfButton !== undefined){
            this.refs.ntfButton.click();
        }         
        const refs2print = this.props.refs2Print;
        return(
            <div id="topBar">
                <div id="marca">
                    <div id="avatar">
                            <div id="sessionAvatarContainer" className="fadeColor">
                                <img id="sessionAvatar" className="w3-circle" src={`${network.server}usr/thumbs/small/${JSON.parse(localStorage.sessionData).id_usuario}.jpg`} alt="" />
                            </div>
                    </div>            
                </div>
                <div id="topBarContainer" style={styles.topBarStyle}>
                    <div id="titulo" style={{ ...styles.titulo }}>
                        <div className="breadCrumbs fadeColor">
                            {this.renderBreadCrumb()}
                        </div>
                        {this.renderTitulo()}
                    </div>
                    <div 
                        style={styles.buttonStyle} 
                        id="print"
                        onClick={() => {
                            try{
                                var content = refs2print["list"];
                                var pri = refs2print["ifmcontentstoprint"];
                                pri.contentDocument.open();
                                pri.contentDocument.write(content.innerHTML);
                                pri.contentDocument.close();
                                pri.focus();
                                pri.contentWindow.print();
                            } catch(err){
                                swal("Error de Impresion", "Este elemento no está configurado para imprimirse.","warning");
                            }

                        }}
                    >
                        <i className="material-icons fadeColor barBurron">print</i>
                    </div>
                    <div style={styles.buttonStyle} id="searchBar">
                        <i className="material-icons fadeColor barButton">search</i>
                    </div>            
                    <div 
                        ref="ntfButton"
                        style={styles.buttonStyle} 
                        id="notification" 
                        onClick={() => {
                            this.props.onNotifClick();
                        }}
                    >
                        <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'relative',
                                    padding: '10px',
                                    color: '#A2ABB2',
                                    ...notifStyle
                                }}
                        >
                        <i className="material-icons barButton">notifications_none</i>
                        {(this.props.notificaciones)>0?
                            <div style={{left: '25px', position:'absolute'}} className="badge">
                                {this.props.notificaciones}
                            </div>:
                            null
                        }
                        </div>
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
        cursor: 'pointer',
        flex: '1',
        justifyContent: 'center'
    },
    topBarStyle: {
        display: 'flex',
        flex: 1,
        top: '0px',
        bottom: '0px',
        marginRight:'10px'
    },
    selectedMenu:{
        backgroundColor: '#F6F6F6',
        border: '1px solid #F1F1F1',
        color: '#2196F3'
    },
    titulo: {
        display: 'flex',
        flex: '30',
        marginLeft: '15px',
        alignItems: 'center'
    }
}

export {MenuTop}