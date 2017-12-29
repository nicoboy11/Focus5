import React, { Component } from 'react';
import { Helper, Config } from '../configuracion';

class ChatItem extends Component {

    static defaultProps = {
        id_current_user: 0,
        id_usuario: 0,
        txt_comentario: '',
        id_tipo_comentario: 2,
        fec_comentario: '',
        loading: false,
        imagen: '',
        progress: undefined,
        userName: '',
        userColor: '#333'
    }

    renderImage() {
        if(this.props.imagen !== "") {
            let loading = {};
            if(this.props.loading){
                loading = styles.loadingStyle;
            }
            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img 
                        src={`${this.props.imagen}`} 
                        style={{ ...loading, marginBottom: '10px', borderRadius: '10px', objectFit: 'cover', width: '230px', height: '230px'}} 
                    />
                    <br />
                    <br />
                </div>
            );
        }
    }

    renderMessage(){
        const { 
            id_current_user, 
            id_usuario, 
            txt_comentario, 
            id_tipo_comentario, 
            fec_comentario,
            loading,
            progress,
            imagen,
            userName,
            userColor
        } = this.props;

        let text = txt_comentario;
        text = Helper.decode_utf8(text);
        text = Helper.htmlPaso(text);


        if(id_tipo_comentario === 2 ) {
            return (
                <div className="bitacora">{Helper.htmlPaso(Helper.decode_utf8(txt_comentario))}</div>
            );
        }
        //Se usa == en vez de === para que compara el valor y no el tipo
        if(id_current_user == id_usuario){
            const loadingStyle = (loading && !progress)?styles.loadingStyle:null;
            return (
                    <div className="chatMessage" style={{...loadingStyle, ...styles.chatItemStyle, ...styles.rightItemStyle}}>
                        <div style={styles.messageSelf}>
                            <div style={{ margin: '10px', position:'relative' }}>
                                  {this.renderImage()}
                                {Helper.decode_utf8(txt_comentario)}
                                {(progress !== undefined)?
                                <div style={styles.barra}>
                                    <div style={{...styles.progress,width: `${progress}%`}}>{progress}%</div>
                                </div>: null}                                
                            </div>
                        </div>
                        <div style={styles.datetimeStyle}>
                            <div style={styles.messageTimeSelf} className="messageTimeSelf fadeColor">{Helper.decode_utf8(Helper.prettyfyDate(fec_comentario).datetime)}</div>
                        </div>                        
                    </div>  
            );          
        }

        return  (
                <div className="chatMessage" style={{...styles.chatItemStyle, ...styles.leftItemStyle}}>
                    <div style={styles.messageOther}>
                        <div style={{...styles.chatTitle, color: userColor}}>{Helper.htmlDecode(Helper.decode_utf8(userName))}</div>  
                        <div style={{ marginLeft: '10px', position:'relative' }}>                     
                            {this.renderImage()}
                            {Helper.decode_utf8(txt_comentario)}
                        </div>
                    </div>
                    <div style={styles.datetimeStyle}>
                        <div style={styles.messageTimeSelf} className="messageTimeSelf fadeColor">{Helper.decode_utf8(Helper.prettyfyDate(fec_comentario).datetime)}</div>
                    </div>                    
                </div>            
        );
    }

    render(){
        return(
            <div data-id={this.props.id_tarea_unique}>
                {this.renderMessage()}
            </div>
        );
    }
}

const styles = {
    loadingStyle:{
        opacity: '0.3'

    },
    barra:{
        height: '15px',
        width: '200px',
        zIndex: '9999',
        borderRadius: '5px',
        backgroundColor: 'white',
        position: 'absolute',
        top: '50%',
        left: '15px'        
    },
    progress: {
        backgroundColor: '#307BBB',
        height: '100%',
        fontSize: '8px',
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px',
        paddingLeft: '5px',
        display:'flex',
        alignItems: 'center'
    },
    messageSelf: {
        backgroundColor: '#1ABC9C',
        borderRadius: '10px',   
        borderTopRightRadius: '0px',
        minWidth: '120px',
        /*maxWidth: '80%',*/
        paddingRight: '10px',
        paddingTop: '0px',
        paddingLeft: '0px',
        paddingBottom: '3px',
        color: '#FFF',
        float: 'right',
        margin: '10px'
    },
    messageOther: {
        backgroundColor: '#E9E9E9',
        borderRadius: '10px',   
        borderTopLeftRadius: '0px',
        minWidth: '120px',
        /*maxWidth: '80%',*/
        paddingRight: '10px',
        paddingTop: '0px',
        paddingLeft: '0px',
        paddingBottom: '3px',
        color: '#535353',
        float: 'left',
        margin: '10px'
    },      
    chatItemStyle: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%'
    },
    rightItemStyle: {
        float:'right'
    },
    leftItemStyle:{
        float:'left'
    },
    datetimeStyle: {
        marginRight: '15px',
        marginTop: '-10px'
    },
    messageTimeSelf: {
        float: 'right',
        fontSize: '8px'    
    },
    chatTitle: {
        marginLeft: '5px',
        fontSize: '10px',
        marginTop: '5px',
        marginBottom: '5px',
        fontWeight: 'bold',
        maxWidth: '130px',
        whiteSpace: 'nowrap',
        overflow:'hidden',
        textOverflow: 'ellipsis'
    }
}

export { ChatItem };