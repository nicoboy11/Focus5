import React, { Component } from 'react';
import { ChatItem, Input } from './';
import { Config, Helper } from '../configuracion';


class Chat extends Component{
    static defaultProps = {
        tareaActual: {},
        loadingFile: false,
        loadingComentario: false,
        fileProgress: -1,
        url: '',
        typing: '',
        comments: {},
        commentChanged: () => {},
        enviarComment: () => {},
        fileChange: () => {}
    }

    /**
     * Cuando seleccionan la tarea mando llamar el scroll
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState){
        if(JSON.stringify(prevProps.tareaActual.tarea.topComments) !== JSON.stringify(this.props.tareaActual.tarea.topComments)){
            this.scrollToBottom();
        }
    }    
    /**
     * Escrolleo al final de la lista del chat
     */
    scrollToBottom() {
        const {chatScroll} = this.refs;
        chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll.clientHeight;
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
        if(this.props.tareaActual.tarea.id_tarea === undefined) {
            return null;
        }

        if(this.props.tareaActual.tarea.commentCount > this.props.tareaActual.tarea.topComments.length) {
            return (<button 
                        onClick={this.props.onLoadMore}
                        style={styles.loadMore}
                    >
                        Cargar más...
                    </button>
                    );
        }

        return <div style={styles.topLog}>{`Tarea creada el ${Helper.prettyfyDate(this.props.tareaActual.tarea.fec_creacion).date}`}</div>;
    }
    /**
     * Renderizar los comentarios
     */    
    renderMessages(){
        if(this.props.tareaActual.tarea.topComments === undefined){
            return null;
        }
        //obtener tarea actual
        return this.props.tareaActual.tarea.topComments.map(comment => {
            let ruta = "";
            if(comment.imagen !== ""){
                ruta = `${Config.network.server}archivos/${comment.imagen}`                
            }
            return (
                <ChatItem 
                    key={parseInt(comment.id_tarea_unique)}
                    id_tipo_comentario={parseInt(comment.id_tipo_comentario)}
                    txt_comentario={comment.txt_comentario}
                    fec_comentario={comment.fec_comentario}
                    id_usuario={parseInt(comment.id_usuario)}
                    id_tarea_unique={parseInt(comment.id_tarea_unique)}
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
                            txt_comentario={this.props.comments.commentText}
                            loading={true}
                            id_tipo_comentario={1}
                            id_usuario={sessionData.id_usuario}
                            id_current_user={sessionData.id_usuario}
                        />            
                }

                if(this.props.typing !== ""){
                    return <div style={{ color: '#1ABC9C', fontWeight: 'bold', margin: '20px', fontSize: '14px'}}>{this.props.typing}</div>
                }
        
                return null;        
    }

    /**
     * Renderizar ó no el textbox del chat
     */    
    renderChatFooter() {
        
        if(this.props.tareaActual.tarea.id_tarea === undefined) {
            return null;
        }
            
        return(
            <footer className="chatSender divideTop">
                <div className="chatTextAreaContainer">
                    <Input 
                        multiline={true} 
                        placeholder="Escribe un mensaje..." 
                        value={this.props.comments.commentText}
                        onChangeText={(value) => this.props.commentChanged(value)} 
                    />
                </div>
                <div className="iconContainer">
                    <div style={{height:'48px', width:'48px'}}>
                        {(this.props.url !== null)?<img style={{height:'100%', border: '1px dashed gray'}} src={this.props.url} />:null}
                    </div>
                </div>
                <div className="iconContainer">
                    <label id="lblUp" htmlFor="up_file_even" style={{ cursor:"pointer" }}>
                        <i className="material-icons fadeColor">attach_file</i>
                    </label>
                    <input onChange={this.mostrarImagen.bind(this)} type="file" id="up_file_even" name="up_file_even" style={{ display:'none' }} />
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
                <div ref={'chatScroll'} style={{height: '100%', overflow:'auto'}}>
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
        marginBottom: '10px'
    }
}

export { Chat };