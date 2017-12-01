import React, { Component } from 'react';
import { Tarea, ChatItem, Input, Modal, ContextMenu, FormRow } from '../components';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Helper} from '../configuracion';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/es'

import { connect } from 'react-redux';
import { cargarTareas, listaProyectos, seleccionarProyecto, seleccionarTarea, actualizarTarea, listaUsuarios } from '../actions';

class Tareas extends Component{
    constructor(props){
        super(props);
        this.state = {
            tareas: [],
            id_tarea_selected: null,
            currentComments: [],
            listaContext: [],
            mostrarContextMenu: false
        }
    }

    /**
     * Si se llegó a la pantalla directamente con el link entonces tiene que buscar en la url y
     * cargar todos los proyectos y posteriormente seleccionarlos en ComponentWillReceiveProps
     */
    componentWillMount(){
        
        if(!this.props.proyectoActual.tmp_proyecto.id_proyecto) {
            this.props.listaProyectos(294);
            //this.props.listaUsuarios(294);            
        }
    }

    /**
     * Aqui primero checo si existe ya un proyecto seleccionado, en caso de que no, obtengo el IdProyecto de la url
     * y lo selecciono.
     * En caso de que sí cargo las tareas
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps){

        if (nextProps.proyectoActual.tmp_proyecto.id_proyecto === undefined){
            const currentRoute = window.location.pathname;

            //Seleccionar proyecto y obtener objeto
            const proyectoActual = nextProps.proyectos.filter(proyecto => proyecto.id_proyecto === parseInt(currentRoute.split("/")[2]));
        
            //Guardar proyecto en el estate (Accion seleccionar)
            this.props.seleccionarProyecto(proyectoActual[0], JSON.parse(JSON.stringify(proyectoActual[0])));            

        } else if ( nextProps.proyectoActual.tmp_proyecto.id_proyecto && nextProps.tareas.length === 0 && nextProps.tareas === this.props.tareas){
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
     * Abrir el contextMenu
     */
    onContextOpen(e, id_tarea){
        //Validar situación de la tarea (que menú se va a mostrar)
        //.....

        //Seleccionar Tarea
        const tarea = this.props.tareas.filter(tarea => tarea.id_tarea === id_tarea);
        this.props.seleccionarTarea(tarea[0],JSON.parse(JSON.stringify(tarea[0])));

        //Generar lista
        const lista = [];
        lista.push({ nombre: 'Editar tarea', icono: null, evento: 'onEditClick', enabled: true });
        lista.push({ nombre: 'Marcar como atendida', icono: null, evento: 'onEditClick', enabled: true });
        lista.push({ nombre: 'Marcar como terminada', icono: null, evento: 'onEditClick', enabled: true });

        //Mostrar menú
        this.setState({ mostrarContextMenu: true, listaContext: lista, posicion: {x: e.clientX, y: e.clientY} });

    }

    onContextClick(item) {

        switch(item.nombre){
            case 'Editar tarea':

                this.setState({ mostrarModal: true });
                break;
            default:
                break;
        }

        this.setState({ mostrarContextMenu: false });
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
                    key={parseInt(comment.id_tarea_unique)}
                    id_tipo_comentario={parseInt(comment.id_tipo_comentario)}
                    txt_comentario={comment.txt_comentario}
                    fec_comentario={comment.fec_comentario}
                    id_usuario={parseInt(comment.id_usuario)}
                    id_tarea_unique={parseInt(comment.id_tarea_unique)}
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
     * Mostrar Modal para editar/crear tareas
     */
    renderModalTareas(){
        const { 
            txt_tarea,
            txt_descripcion,
            fec_limite,
            id_proyecto,
            id_status,
            participantes
        } = this.props.tareaActual.tmp_tarea;

        const tmp_tarea = this.props.tareaActual.tmp_tarea;
        let responsable = [{id_usuario: null}];
        let participaTarea = [{id_usuario: null}];

        if(participantes !== undefined && participantes.length > 0){
            responsable = participantes.filter(participante => participante.role_id === 2 || participante.role_id === 1);
            participaTarea = participantes.filter(participante => participante.role_id === 3);
        }
        

        return (
            <Modal 
                type='FORM' 
                isVisible={this.state.mostrarModal} 
                titulo={txt_tarea}
                loading={this.props.loading}
                componenteInicial="txt_tarea"
                onGuardar={() => { this.onGuardar(); }}
                onCerrar={() => { this.setState({ mostrarModal: false }) }}
            >
                {/*txt_tarea*/}            
                <FormRow titulo='NOMBRE'>
                    <Input 
                        type="EXTENDEDTEXT"
                        autoFocus={true}
                        placeholder='Nombre de la tarea' 
                        value={txt_tarea}
                        onChangeText={
                            value => this.props.actualizarTarea({ 
                                        prop: 'txt_tarea', 
                                        value, 
                                        tmp_tarea
                                    })
                        }
                    />  
                </FormRow>
                {/*txt_descripcion*/}            
                <FormRow titulo='DESCRIPCIÓN'>
                    <Input 
                        type="EXTENDEDTEXT"
                        multiline={true}
                        autoFocus={true}
                        placeholder='Descripción de la tarea' 
                        value={txt_descripcion}
                        onChangeText={
                            value => this.props.actualizarTarea({ 
                                        prop: 'txt_descripcion', 
                                        value, 
                                        tmp_tarea
                                    })
                        }
                    />  
                </FormRow>      
                <FormRow titulo='FECHA LIMITE'>
                        <DatePicker 
                            selected={Helper.toDateM(fec_limite)}
                            onChange={
                                (date) => {
                                    this.props.actualizarTarea({ 
                                        prop: 'fec_limite', 
                                        value:date.format('YYYY-MM-DD'),
                                        tmp_tarea
                                    })
                                }
                            }
                            locale="es"
                            className="dateStyle"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            todayButton="Hoy"
                            placeholderText="Fecha limite"
                            minDate={moment()}
                        />    
                </FormRow>      
                <FormRow titulo='PROYECTO'>
                    <Select 
                        name='selProyecto'
                        value={id_proyecto}
                        onChange={  value => this.props.actualizarTarea({ 
                                        prop: 'id_proyecto', 
                                        value, 
                                        tmp_tarea
                                    })}
                        valueKey="id_proyecto"
                        labelKey="txt_proyecto"
                        options={this.props.proyectos}
                    />
                </FormRow>      
                <FormRow titulo='RESPONSABLE'>                    
                    <Select 
                        name='selResponsable'
                        value={responsable[0].id_usuario}
                        onChange={  value => this.props.actualizarTarea({ 
                                        prop: 'id_responsable', 
                                        value, 
                                        tmp_tarea
                                    })}
                        valueKey="id_usuario"
                        labelKey="txt_usuario"
                        options={this.props.usuarios.usuarios}
                    />                    
                </FormRow>     
                <FormRow titulo='PARTICIPANTES'>                    
                    <Select 
                        name='selParticipantes'
                        value={participaTarea}
                        onChange={  value => this.props.actualizarTarea({ 
                                        prop: 'participantes', 
                                        value, 
                                        tmp_tarea
                                    })}
                        valueKey="id_usuario"
                        labelKey="txt_usuario"
                        options={this.props.usuarios.usuarios}
                        multi={true}
                    />                    
                </FormRow>                                
            </Modal>            
        )
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
        if(this.props.tareas !== null && this.props.tareas !== undefined) {
            return this.props.tareas.map(tarea => {
                    return (
                        <Tarea 
                            key={tarea.id_tarea}
                            id_tarea={tarea.id_tarea}
                            participantes={tarea.participantes} 
                            txt_tarea={tarea.txt_tarea}
                            fec_limite={tarea.fec_limite}
                            notificaciones={tarea.notificaciones}
                            txt_proyecto={this.props.proyectoActual.proyecto.txt_proyecto}
                            onClick={this.tareaClick.bind(this)}
                            onMenuOpen={(e) => this.onContextOpen(e,tarea.id_tarea)}
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
                {this.renderModalTareas()}
                <ContextMenu 
                    lista={this.state.listaContext} 
                    visible={this.state.mostrarContextMenu} 
                    posicion={this.state.posicion}
                    onListClick={(item) => this.onContextClick(item)}
                    onClose={() => this.setState({ mostrarContextMenu: false })}
                />
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
        proyectos: state.listaProyectos.proyectos,
        proyectoActual: state.proyectoActual,
        tareas: state.proyectoActual.proyecto.tareas,
        tareaActual: state.tareaActual,
        usuarios: state.usuarios
    }
};

//export { Proyectos };
export default withRouter(connect(mapStateToProps, { cargarTareas, listaProyectos, seleccionarProyecto, seleccionarTarea, actualizarTarea, listaUsuarios })(Tareas))