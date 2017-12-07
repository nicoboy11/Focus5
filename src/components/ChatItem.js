import React, { Component } from 'react';
import { Helper, Config } from '../configuracion';

class ChatItem extends Component {

    static defaultProps = {
        id_current_user: 0,
        id_usuario: 0,
        txt_comentario: '',
        id_tipo_comentario: 2,
        fec_comentario: '',
        loading: false
    }

    renderImage() {
        if(this.props.imagen !== "") {
            let loading = {};
            if(this.props.loading){
                loading = styles.loadingStyle;
            }
            return (
                <div>
                <img 
                    src={`${this.props.imagen}`} 
                    style={{ ...loading, borderRadius: '10px', objectFit: 'cover', width: '230px', height: '230px'}} 
                />
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
            imagen
        } = this.props;

        if(id_tipo_comentario === 2 ) {
            return (
                <div className="bitacora">{Helper.decode_utf8(Helper.htmlPaso(txt_comentario))}</div>
            );
        }

        if(id_current_user === id_usuario){
            return (
                    <div className="chatMessage">
                        <div style={styles.messageSelf}>
                            <div style={{ position:'relative' }}>
                                {this.renderImage()}
                                {txt_comentario}
                                {(progress !== undefined)?
                                <div style={styles.barra}>
                                    <div style={{...styles.progress,width: `${progress}%`}}>{progress}%</div>
                                </div>: null}                                
                            </div>
                            <div>
                                <div className="messageTimeSelf">{Helper.decode_utf8(Helper.prettyfyDate(fec_comentario).date)}</div>
                            </div>
                        </div>
                    </div>  
            );          
        }

        return  (
                <div className="chatMessage">
                    <div className="messageOther">
                        <div>
                            {Helper.decode_utf8(Helper.htmlPaso(txt_comentario))}
                        </div>
                        <div>
                            <div className="messageTimeOther">{Helper.prettyfyDate(fec_comentario).date}</div>
                        </div>
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
        maxWidth: '80%',
        padding: '10px',
        paddingBottom: '3px',
        color: '#FFF',
        float: 'right',
        margin: '10px'
    } 
}

export { ChatItem };