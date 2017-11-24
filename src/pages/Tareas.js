import React, { Component } from 'react';
import { Config, Database, Helper } from '../configuracion';
import { Tarea, ChatItem, Input } from '../components'

class Tareas extends Component{
    constructor(props){
        super(props);
        this.state = {
            tareas: [],
            id_tarea_selected: null,
            currentComments: []
        }
    }

    componentWillMount(){
        const currentRoute = window.location.pathname;
        Database.request('GET', `contenido/${12}?id_proyecto=${currentRoute.split("/")[2]}`, {}, 2, (error, response) => {
            if(error){
              console.log(error);
            } else{
                const datos = Helper.clrHtml(response[0].tareas);
                const tareas = response[0].tareas ? JSON.parse(datos) : []; 
                this.setState({ tareas });
            }
        });      
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps);
    }

    componentDidUpdate(prevProps, prevState){
        this.scrollToBottom();
    }

    tareaClick(id_tarea){
        const currentTarea = this.state.tareas.filter(tarea => tarea.id_tarea === id_tarea);
        const chat = currentTarea[0].topComments;
        const currentComments = chat.map(comment => {
            return (
                <ChatItem 
                    key={comment.id_tarea_unique}
                    id_tipo_comentario={comment.id_tipo_comentario}
                    txt_comentario={comment.txt_comentario}
                    fec_comentario={comment.fec_comentario}
                    id_usuario={comment.id_usuario}
                    id_tarea_unique={comment.id_tarea_unique}
                    id_current_user={12}
                />
            )
        }).reverse();

        this.setState({
            currentComments
        });
    }

    scrollToBottom() {
        const {chatScroll} = this.refs;
        chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll.clientHeight;
    }

    renderMessages(){
        //obtener tarea actual
        

        return this.state.currentComments;
    }

    renderTareas(){
        if(this.state.tareas !== null) {
            return this.state.tareas.map(tarea => {
                    return (
                        <Tarea 
                            key={tarea.id_tarea}
                            id_tarea={tarea.id_tarea}
                            participantes={tarea.participantes} 
                            txt_tarea={tarea.txt_tarea}
                            fec_limite={tarea.fec_limite}
                            notificaciones={tarea.notificaciones}
                            onClick={this.tareaClick.bind(this)}
                        />
                    )
            });
        }

        return <div>loading</div>;
    }

    render(){
        return(
            <div className="detallesContainer divideTop">
                <div id="listaTareas" className="w3-third chatPanel lightBackground">
                {this.renderTareas()}
                </div>
                <div className="w3-twothird chatPanel divideLeft" >
                    <div ref={'chatScroll'} style={{height: '100%', overflow:'auto'}}>
                        <div id="chatMessageContainer" className="chatMessages">
                        {this.renderMessages()}
                        </div>
                    </div>
                    <footer className="chatSender divideTop">
                        <div className="chatTextAreaContainer">
                            <Input multiline={true} placeholder="Escribe un mensaje..." />
                        </div>
                        <div className="iconContainer">
                            <i className="material-icons fadeColor">attach_file</i>
                        </div>
                        <div className="iconContainer">
                            <i className="material-icons mainColor">send</i>
                        </div>
                    </footer>
                </div>
            </div>
        );        
    }

}

export { Tareas };