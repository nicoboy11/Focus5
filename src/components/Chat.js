import React, { Component } from 'react';
import { ChatItem, Input, Avatar, Modal } from './';
import { Config, Helper } from '../configuracion';

const { network } = Config;


class Chat extends Component{
    static defaultProps = {
        loadingFile: false,
        loadingComentario: false,
        fileProgress: -1,
        url: '',
        typing: '',
        comments: [],
        participantes: [],
        commentChanged: () => {},
        enviarComment: () => {},
        fileChange: () => {},
        onScroll: () => {},
        scrollTop: 0,
        idCampo: 'id'
    }

    constructor(props){
        super(props);
        this.state = {
            imgPreview: false,
            fileType: '',
            fileName: ''
        }
    }    

    /**
     * Cuando seleccionan la tarea mando llamar el scroll
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState){
        if(JSON.stringify(prevProps.comments) !== JSON.stringify(this.props.comments) || 
            (this.props.typing.mensaje !== undefined && this.props.typing.mensaje !== "" && this.props.scrollTop === prevProps.scrollTop)
        )
        {
            this.scrollToBottom();
        }
    }    

    componentDidMount(){
        this.scrollToBottom();        
    }
    /**
     * Escrolleo al final de la lista del chat
     */
    scrollToBottom() {
        const {chatScroll} = this.refs;
        chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll.clientHeight;
    }

    setScrollTop(value) {
        const {chatScroll} = this.refs;
        chatScroll.scrollTop = value;
    }

    getScrollData(){
        const {chatScroll} = this.refs;
        this.props.scrollData(chatScroll);        
    }

    onScroll(evt){

        if(evt.target.scrollTop === 0 && this.props.comments.length !== this.props.commentCount){
            this.props.onLoadMore();
        }

        this.props.onScroll(evt.target.scrollTop);
    }

    mostrarImagen(evt){
        try{
            const files = evt.target.files;
            const filename = files[0].name;
            const filetype = files[0].type;

            for (let i = 0, f; f = files[i]; i++) {

                let reader = new FileReader();
                const me = this;
                reader.onload = function (evt) {

                    me.props.fileChange(files[0], evt.target.result);
                    me.setState({ imgPreview: true, fileName: filename, fileType: filetype.replace('application/','') })

                }

                reader.readAsDataURL(f);
            }
        } catch(err){

        }
    }    

    enviarComment() {
        this.props.enviarComment();        
    }

    renderMore() {
        if(this.props.loadingMore) {
            return (
                <div className="tareaCard" style={{ textAlign: 'center' }}>
                    <img style={{width: '50px', height: '50px'}} src={`${Config.network.server}/img/Spinner.gif`} />
                </div>                 
            );
        }

        if(this.props.fec_creacion === undefined) {
            return null;
        }

        if(this.props.commentCount > this.props.comments.length) {
            return (<button 
                        onClick={this.props.onLoadMore}
                        style={styles.loadMore}
                    >
                        MAS
                    </button>
                    );
        }

        return <div style={styles.topLog}>{`Tarea creada el ${Helper.prettyfyDate(this.props.fec_creacion).date}`}</div>;
    }

    /**
     * Renderizar los comentarios
     */    
    renderMessages(){
        if(this.props.comments === undefined || this.props.comments.length === 0){
            return null;
        }
        //obtener tarea actual
        return this.props.comments.map(comment => {
            let ruta = "";
            if(comment.imagen !== ""){
                ruta = `${Config.network.server}archivos/${comment.imagen}`                
            }

            let seenBy = 0;

            for(let participante of this.props.participantes){
                if(participante.ultimoVisto >= comment.id_tarea_unique){
                    seenBy++;
                }
            }

            return (
                <ChatItem 
                    key={parseInt(comment.id_tarea_unique)}
                    id_tipo_comentario={parseInt(comment.id_tipo_comentario)}
                    txt_comentario={comment.txt_comentario}
                    fec_comentario={comment.fec_comentario}
                    id_usuario={parseInt(comment.id_usuario)}
                    id_tarea_unique={parseInt(comment.id_tarea_unique)}
                    seen={(seenBy===this.props.participantes.length)}
                    id_current_user={JSON.parse(localStorage.sessionData).id_usuario}
                    imagen={ruta}
                    userName={comment.txt_usuario}
                    userColor={comment.color}
                />
            )
        }).reverse();
    }

    renderLoadingMessage() {
        const sessionData = JSON.parse(localStorage.sessionData)
        
                if(this.props.loadingFile){
                    return <ChatItem 
                                loading={true}
                                progress={this.props.fileProgress}
                                imagen={this.props.url}
                                id_usuario={sessionData.id_usuario}
                                id_current_user={sessionData.id_usuario}
                                id_tipo_comentario={1}
                            />      
                }        
        
                if(this.props.loadingComentario){
                    return <ChatItem 
                            txt_comentario={this.props.text}
                            loading={true}
                            id_tipo_comentario={1}
                            id_usuario={sessionData.id_usuario}
                            id_current_user={sessionData.id_usuario}
                        />            
                }
                const imagen = this.props.typing.sn_imagen===1?
                                `${network.server}usr/thumbs/small/${this.props.typing.id_usuario}.jpg?v=${new Date().getTime()}`:
                                this.props.typing.txt_abbr

                if(this.props.typing.mensaje !== undefined && this.props.typing.mensaje !== ""){
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
                            <Avatar 
                                avatar={imagen}
                                size="small"
                                color={this.props.typing.color}
                            />  
                            <img style={{ height: '10px', marginLeft: '10px', marginTop: '-5px' }} src={Config.network.server + 'img/800.gif'} />
                        </div>
                    );
                }
        
                return null;        
    }

    /**
     * Renderizar ó no el textbox del chat
     */    
    renderChatFooter() {
        
        if(this.props.fec_creacion === undefined) {
            return null;
        }
            
        return(
            <footer className="chatSender divideTop">
                <div className="chatTextAreaContainer">
                    <Input 
                        multiline={true} 
                        placeholder="Escribe un mensaje..." 
                        value={this.props.text}
                        onChangeText={(value) => this.props.commentChanged(value)} 
                        onEnter={(value) => {
                            if(this.props.text !== ""){
                                this.enviarComment()}
                            }
                        }
                    />
                </div>
                <div className="iconContainer">
                    <div style={{height:'48px', width:'48px'}}>
                        <Modal 
                            type='FORM'
                            isVisible={this.state.imgPreview}
                            titulo='Enviar'
                            //style: {},
                            onCerrar={() => {
                                this.setState({ imgPreview: false, fileType: '', fileName: '' });
                                this.refs.fileInput.value = '';
                            }}
                            onGuardar={() => {
                                this.setState({ imgPreview: false, fileType: '', fileName: '' })
                                this.enviarComment(); 
                            }}
                        >
                            {(/(gif|jpg|jpeg|tiff|png)/i).test(this.state.fileType) ?
                            <img style={{height:'100%', width:'100%', border: '1px dashed gray'}} src={this.props.url} /> :
                            (/(vnd|zip|rar|exe|htm|html)/i).test(this.state.fileType) ?
                                <div style={{ fontSize: '40px', display:'flex', alignItems: 'center'}}><i style={{ fontSize: '40px'}} className="material-icons fadeColor">attach_file</i>{this.state.fileName}</div>:
                                <embed style={{ width: '100%', minHeight: '400px' }}  src={this.props.url} /> 

                            }
                        </Modal>                        
                    </div>
                </div>
                <div className="iconContainer">
                    <label id="lblUp" htmlFor="up_file_even" style={{ cursor:"pointer" }}>
                        <i className="material-icons fadeColor">attach_file</i>
                    </label>
                    <input ref={'fileInput'} onChange={this.mostrarImagen.bind(this)} type="file" id="up_file_even" name="up_file_even" style={{ display:'none' }} />
                </div>
                <div onClick={() => this.enviarComment()} className="iconContainer" style={{cursor:'pointer'}}>
                    <i className="material-icons mainColor">send</i>
                </div>
            </footer>
        );
    }    

    render(){
        return (
            <div style={{ display: 'flex', flex: '1', flexDirection: 'column'}}>
                <div ref={'chatScroll'} onScroll={this.onScroll.bind(this)} style={{height: '100%', overflow:'auto'}}>
                    <div id="chatMessageContainer" className="chatMessages">
                        {this.renderMore()}
                        {this.renderMessages()}
                        {this.renderLoadingMessage()}
                    </div>
                </div>
                {this.renderChatFooter()}                
            </div>
        );
    }

}

const styles = {
    topLog: {
        display: 'flex',
        alignSelf: 'center',
        backgroundColor: '#6C9BD4',
        color: 'white',
        maxWidth: '300px',
        fontSize: '11px',
        borderRadius: '15px',
        padding: '5px',
        paddingRight: '10px',
        paddingLeft: '10px',
        margin: '10px'
    },
    loadMore: {
        padding: '5px',
        marginBottom: '10px',
        width: '36px',
        height: '36px',
        borderRadius: '18px',
        border: '1px solid #CACACA',
        backgroundColor: 'white',
        fontSize: '10px',
        alignItems: 'center',
        display: 'flex',
        alignSelf: 'center',
    }
}

export { Chat };