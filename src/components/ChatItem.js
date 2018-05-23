import React, { Component } from 'react';
import { Helper } from '../configuracion';
import Link from 'react-linkify';

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

    constructor(props){
        super(props);
        this.state = {
            display: { display: 'none' }
        }
    }

    obtieneNombreArchivo(archivo){
        //quitar la extensión
        const woExt = archivo.split("-2")[0];
        //separo la url
        const wurl = woExt.split("/");
        //regreso el nombre del archivo
        return wurl[wurl.length - 1] + "." + this.obtieneExtensionArchivo(archivo);
    }

    obtieneExtensionArchivo(archivo){
        //quitar la extensión
        const woExt = archivo.split(".");
        //regreso la extension
        return woExt[woExt.length - 1];
    }    

    mostrarLinks(str){

        const rgx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
        return str.replace(rgx, '<a href="#">$1</a>');
    }

    renderImage() {
        if(this.props.imagen !== "") {
            let loading = {};
            if(this.props.loading){
                loading = styles.loadingStyle;
            }

            if((/\.(gif|jpg|jpeg|tiff|png)$/i).test(this.props.imagen) || (/data:image\/([a-zA-Z]*);base64,([^\"]*)/g).test(this.props.imagen)){
                return (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img 
                            onClick={() => this.setState({ display: { display: 'flex' } })}
                            src={`${this.props.imagen}`} 
                            style={{ ...loading, cursor:'pointer', marginBottom: '10px', borderRadius: '10px', objectFit: 'cover', width: '230px', height: '230px'}} 
                        />
                        <br />
                        <br />
                        <div
                            onClick={() => { this.setState({ display: {display: 'none'} }); }} 
                            style={{ 
                                ...this.state.display, 
                                position: 'fixed', 
                                width: '100%', 
                                height: '100%',
                                background: 'rgba(50,50,50,0.5)',
                                top: '0',
                                left: '0',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: '99'
                            }}
                        >
                            <div style={{ 
                                            maxWidth: '900px', 
                                            top: '0', 
                                            left: '0'
                                        }}
                            >
                                <div style={{display:'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <a href={this.props.imagen} download>
                                        <div
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="material-icons" style={{marginLeft: '5px', color: 'white'}}>file_download</i>
                                        </div>                                    
                                    </a>
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { this.setState({ display: {display: 'none'} }); }}                                    
                                    >
                                        <i className="material-icons" style={{marginLeft: '5px', color: 'white'}}>close</i>
                                    </div>
                                </div>                          
                                <img 
                                    style={{width: '100%'}}
                                    src={`${this.props.imagen}`} 
                                />                             
                            </div>                        
                        </div>

                    </div>
                );
            }

            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div 
                        style={{background: 'rgba(100,100,100,.5)', padding: '10px', marginBottom: '10px', borderRadius:'5px'}}
                    > 
                        <a style={{ display: 'flex', color: 'white', alignItems: 'center', textDecoration: 'none' }} href={this.props.imagen} download>
                            <div>{this.obtieneNombreArchivo(this.props.imagen)}</div>
                            <i className="material-icons" style={{marginLeft: '5px'}}>file_download</i>
                        </a>
                    </div>
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
            userName,
            userColor,
            seen
        } = this.props;

        if(id_tipo_comentario === 2 ) {
            return (
                <div className="bitacora">{Helper.htmlDecode(Helper.htmlPaso(Helper.decode_utf8(txt_comentario)))}</div>
            );
        }

        

        let wimageStyle = {};
        if(this.props.imagen !== ""){
            wimageStyle = { marginBottom: '0px' };
        }
        //Se usa == en vez de === para que compara el valor y no el tipo
        if(id_current_user == id_usuario){
            const loadingStyle = (loading && !progress)?styles.loadingStyle:null;
            return (
                    <div className="chatMessage" style={{...loadingStyle, ...styles.chatItemStyle, ...styles.rightItemStyle}}>
                        <div style={styles.messageSelf}>
                            <div style={{ margin: '10px', ...wimageStyle, position:'relative' }}>
                                {this.renderImage()}
                                <pre style={{ whiteSpace: 'pre-wrap'}}>
                                    <Link properties={{target: '_blank' }}>{Helper.htmlDecode(Helper.decode_utf8(txt_comentario))}</Link>
                                </pre>
                                {(progress !== undefined && progress < 100)?
                                <div style={styles.barra}>
                                    <div style={{...styles.progress,width: `${progress}%`}}>{progress}%</div>
                                </div>: null}                                
                            </div>
                        </div>
                        <div style={styles.datetimeStyle}>
                            <div style={styles.messageTimeSelf} className="messageTimeSelf fadeColor">{Helper.decode_utf8(Helper.prettyfyDate(fec_comentario).datetime)}</div>
                            {(seen)?
                                <div><i style={{ fontSize: '10px', marginLeft: '3px'}} className="material-icons clickableColor">done_all</i></div>:
                                <div><i style={{ fontSize: '10px', marginLeft: '3px'}} className="material-icons fadeColor">done</i></div>}
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
                            <pre style={{ whiteSpace: 'pre-wrap'}} >
                            <Link properties={{target: '_blank' }}>{Helper.htmlDecode(Helper.decode_utf8(txt_comentario))}</Link>
                            </pre>
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
        backgroundColor: '#008FBE',
        borderRadius: '10px',   
        borderTopRightRadius: '0px',
        minWidth: '120px',
        /*maxWidth: '80%',
        paddingRight: '10px',
        paddingTop: '0px',
        paddingLeft: '0px',
        paddingBottom: '3px',*/
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
        marginTop: '-10px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
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