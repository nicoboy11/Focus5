import React, { Component } from 'react';
import { Database, Helper } from '../configuracion';
import { Tarea, ChatItem, Input } from '../components'
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { cargarTareas, cargarProyectos, selectProyecto } from '../actions';

class Tareas extends Component{
    constructor(props){
        super(props);
        this.state = {
            tareas: [],
            id_tarea_selected: null,
            currentComments: []
        }
    }

    /**
     * Al inicio trato de cargar las tareas del proyecto seleccionado.
     * Pero si se llegó a la pantalla directamente con el link entonces tiene que buscar en la url y
     * cargar todos los proyectos y posteriormente seleccionarlos en ComponentWillReceiveProps
     */
    componentWillMount(){
        
        if(this.props.id_proyecto) {
            this.props.cargarTareas(this.props.proyectos, this.props.id_proyecto);
        } else {
            this.props.cargarProyectos(12);
        }
    }

    /**
     * Aqui primero checo si existe ya un proyecto seleccionado, en caso de que no, obtengo el IdProyecto de la url
     * y lo selecciono.
     * En caso de que sí cargo las tareas
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps){

        if (!nextProps.id_proyecto){
            const currentRoute = window.location.pathname;
            this.props.selectProyecto(parseInt(currentRoute.split("/")[2]));
        } else if ( nextProps.id_proyecto && nextProps.tareas.length == 0 && nextProps.tareas === this.props.tareas){
            this.props.cargarTareas(nextProps.proyectos, nextProps.id_proyecto);
        }

    }

    /**
     * Cuando seleccionan la tarea mando llamar el scroll
     * @param {*} prevProps 
     * @param {*} prevState 
     */
    componentDidUpdate(prevProps, prevState){
        this.scrollToBottom();
    }

    /**
     * Cargo el chat una vez que seleccionan la tarea
     * @param {*} id_tarea 
     */
    tareaClick(id_tarea){
        const currentTarea = this.props.tareas.filter(tarea => tarea.id_tarea === id_tarea);
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

    /**
     * Escrolleo al final de la lista del chat
     */
    scrollToBottom() {
        const {chatScroll} = this.refs;
        chatScroll.scrollTop = chatScroll.scrollHeight - chatScroll.clientHeight;
    }

    /**
     * Renderizar los comentarios
     */
    renderMessages(){
        //obtener tarea actual
        return this.state.currentComments;
    }

    /**
     * Renderizo las tareas si ya existen en el state
     */
    renderTareas(){
        if(this.props.tareas !== null) {
            return this.props.tareas.map(tarea => {
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

        return <div>loading...</div>;
    }

    /**
     * Renderizo la pagina completa
     */
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

const mapStateToProps = state => {
    return { 
        proyectos: state.proyectos.proyectos,
        tareas: state.proyectos.tareas, 
        ...state.proyectos.current_id_proyecto 
    }
};

//export { Proyectos };
export default withRouter(connect(mapStateToProps, { cargarTareas, cargarProyectos, selectProyecto })(Tareas))