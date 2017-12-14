import React, { Component } from 'react';
import { Tarea, ChatItem, Input, Modal, ContextMenu, FormRow, Chat, NewTask } from '../components';
import Slider from 'react-rangeslider';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Helper, Config } from '../configuracion';
import DatePicker from 'react-datepicker';
import { withRouter } from 'react-router-dom';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import 'moment/locale/es'
import 'react-rangeslider/lib/index.css'

import { connect } from 'react-redux';
import { 
    cargarTareas, 
    listaProyectos, 
    seleccionarProyecto, 
    seleccionarTarea, 
    actualizarTarea, 
    listaUsuarios, 
    actualizarGente, 
    guardarTarea,
    guardarTareaNueva,
    limpiarTareaActual,
    actualizaListaTareas,
    commentChanged,
    commentGuardar,
    commentListUpdate,
    fileCancel,
    fileChange,
    enviarSocket
} from '../actions';

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
        
        let sessionData = {};

        //Si no está logeado se manda a la pantalla de log in
        if(!localStorage.sessionData) {
            this.props.changePage("","");
            return;
        } else {
            sessionData = JSON.parse(localStorage.sessionData)
        }

        if(!this.props.proyectoActual.tmp_proyecto.id_proyecto) {
            this.props.listaProyectos(sessionData.id_usuario);
        } 

        //WebSocket
        this.ws = new WebSocket('ws://localhost:9998/task');
        this.ws.onmessage = (e) => {
            this.props.enviarSocket(JSON.parse(e.data));
        };

        this.ws.onopen = function(){
            this.send(`{"accion":"conectar",
            "room":"tareas",
            "mensaje":"conectado",
            "id_usuario":${sessionData.id_usuario}}`)
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
        
            //Si el proyecto no existe (es de otro usuario ó no tiene permisos) regresar a proyectos
            if(proyectoActual.length === 0){
                this.props.changePage("/proyectos","");
                return;
            }

            //Guardar proyecto en el estate (Accion seleccionar)
            this.props.seleccionarProyecto(proyectoActual[0], JSON.parse(JSON.stringify(proyectoActual[0])));     
            
            //Cargar usuarios
            this.props.listaUsuarios(294);         

        } else if ( nextProps.proyectoActual.tmp_proyecto.id_proyecto && 
                    nextProps.tareas.length === 0 && 
                    nextProps.tareas === this.props.tareas &&
                    nextProps.usuarios === this.props.usuarios
                ){
            this.props.cargarTareas(nextProps.proyectos, nextProps.id_proyecto);
        }

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
     * Guardar una tarea nuevo o editar uno
     */
    onGuardar(txt_tarea){
        //Cuando la tarea es nueva el txt_tarea es undefined
        if(!txt_tarea) {
            this.props.guardarTarea(this.props.tareaActual.tmp_tarea);
        } else {
            let tareaNueva = JSON.parse(JSON.stringify(this.props.tareaActual.tareaNueva));
            tareaNueva.txt_tarea = txt_tarea;
            tareaNueva.id_proyecto = this.props.proyectoActual.proyecto.id_proyecto;
            tareaNueva.id_usuario = JSON.parse(localStorage.sessionData).id_usuario;
            tareaNueva.id_responsable = JSON.parse(localStorage.sessionData).id_usuario;
            tareaNueva.participantes = '';
            this.props.guardarTareaNueva(tareaNueva);
        }
        
    }       

    /**
     * Commentar
     */
    enviarComment(){
        const comentario = {
            id_usuario: JSON.parse(localStorage.sessionData).id_usuario,
            txt_comentario: this.props.comments.commentText,
            imagen: this.props.archivo
        };

        this.props.commentGuardar(comentario, this.props.tareaActual.tmp_tarea.id_tarea);
    }

    wsComment(value){
        const usuario = JSON.parse(localStorage.sessionData);
        const mensaje = (value != "")?`${usuario.txt_usuario} está escribiendo...`:"";
        const obj = {
            accion: "enviar",
            room: "tareas",
            id_usuario: `${usuario.id_usuario}`,
            datos: { 
                id_tarea: this.props.tareaActual.tarea.id_tarea,
                mensaje: mensaje
            }
        }
        this.ws.send(JSON.stringify(obj));        
    }
    /**
     * Cargo el chat una vez que seleccionan la tarea
     * @param {*} id_tarea 
     */
    tareaClick(id_tarea){

        //Seleccionar Tarea
        const currentTarea = this.props.tareas.filter(tarea => tarea.id_tarea === id_tarea);
        this.props.seleccionarTarea(currentTarea[0],JSON.parse(JSON.stringify(currentTarea[0])));
        this.props.commentChanged("");
        this.wsComment("");
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
            participantes,
            avance
        } = this.props.tareaActual.tmp_tarea;

        const tmp_tarea = this.props.tareaActual.tmp_tarea;
        let responsable = [{id_usuario: null}];
        let participaTarea = [{id_usuario: null}];

        if(participantes !== undefined && participantes.length > 0 && !this.props.loading){
            responsable = participantes.filter(participante => participante.role_id === 2 || participante.role_id === 1);
            responsable = responsable.sort((a,b) => b.role_id - a.role_id);
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
                <FormRow titulo='RESPONSABLE'>                    
                    <Select 
                        name='selResponsable'
                        value={responsable[0].id_usuario}
                        onChange={  value => {
                                        this.props.actualizarGente({ 
                                            rolId: 2, 
                                            persona: value, 
                                            tmp_tarea,
                                            usuarios: this.props.usuarios.usuarios
                                        });
                                    }
                                }
                        valueKey="id_usuario"
                        labelKey="txt_usuario"
                        options={this.props.usuarios.usuarios}
                    />                    
                </FormRow>     
                <FormRow titulo='PARTICIPANTES'>                    
                    <Select 
                        name='selParticipantes'
                        value={participaTarea}
                        onChange={  value => this.props.actualizarGente({ 
                                        rol: 3, 
                                        persona: value, 
                                        tmp_tarea,
                                        usuarios: this.props.usuarios.usuarios
                                    })}
                        valueKey="id_usuario"
                        labelKey="txt_usuario"
                        options={this.props.usuarios.usuarios}
                        multi={true}
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
                <FormRow titulo='AVANCE'>
                    <div className='slider-vertical'>
                    <Slider
                        min={0}
                        max={100}
                        value={avance}
                        onChange={value => this.props.actualizarTarea({ 
                                        prop: 'avance', 
                                        value, 
                                        tmp_tarea
                                    })}
                    />
                    <div className='value'>{avance}%</div>
                    </div>
                </FormRow>                                                   
            </Modal>            
        )
    }

    /**
     * Renderizo las tareas si ya existen en el state
     */
    renderTareas(){
        if(this.props.tareas !== null && this.props.tareas !== undefined) {
            const me = this;
            return this.props.tareas.map(tarea => {
                    const selected = (tarea.id_tarea == me.props.tareaActual.tmp_tarea.id_tarea)?true:false;
                    const typing = (tarea.id_tarea == me.props.socket.id_tarea)?me.props.socket.mensaje:"";
                    return (
                        <Tarea 
                            key={tarea.id_tarea}
                            id_tarea={tarea.id_tarea}
                            participantes={tarea.participantes} 
                            txt_tarea={tarea.txt_tarea}
                            fec_limite={tarea.fec_limite}
                            notificaciones={tarea.notificaciones}
                            txt_proyecto={this.props.proyectoActual.proyecto.txt_proyecto}
                            avance={tarea.avance}
                            selected={selected}
                            typing={typing}
                            onClick={this.tareaClick.bind(this)}
                            onMenuOpen={(e) => this.onContextOpen(e,tarea.id_tarea)}
                        />
                    )
            }).sort((a,b) => {
                return (a.props.fec_limite > b.props.fec_limite)?0:1
            });
        }

        return <div>loading...</div>;
    }

    /**
     * Renderizo la pagina completa
     */
    render(){

        //Actualizar tarea editada del modal
        if(Object.keys(this.props.tareaActual.tmp_tarea).length === 0 && this.state.mostrarModal === true){
            this.setState({ mostrarModal: false });
            this.props.actualizaListaTareas(this.props.proyectos, this.props.proyectoActual.proyecto, this.props.tareaActual.tarea);
           // this.props.limpiarProyectoActual();
        }        

        //Actualizar tarea de comentarios
        if(Object.keys(this.props.comments.comment).length > 0) {
            this.props.commentListUpdate();
            this.wsComment("");
            this.props.actualizaListaTareas(this.props.proyectos, this.props.proyectoActual.proyecto, this.props.tareaActual.tarea, this.props.comments.comment);
        }

        //Actualizar tarea nueva
        if(this.props.tareaNueva.id_tarea !== null) {
            this.props.actualizaListaTareas(this.props.proyectos, this.props.proyectoActual.proyecto, this.props.tareaNueva);
            this.props.limpiarTareaActual();
        }
        

        return(
            <div className="detallesContainer divideTop">
                <div id="listaTareas" className="w3-third chatPanel lightBackground">
                <NewTask 
                    onEnter={(txt_tarea) => this.onGuardar(txt_tarea)}
                />
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
                    <Chat 
                        tareaActual={this.props.tareaActual}
                        loadingFile={this.props.loadingFile}
                        loadingComentario={this.props.loadingComentario}
                        fileProgress={this.props.fileProgress}
                        url={this.props.url}
                        comments={this.props.comments}
                        commentChanged={(value) => {
                            this.props.commentChanged(value);
                            this.wsComment(value);
                        }}
                        enviarComment={this.enviarComment.bind(this)}
                        fileChange={(file, event) => this.props.fileChange(file, event)}
                    />

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
        loading: state.tareaActual.loading,
        usuarios: state.usuarios,
        comments: state.comments,
        loadingComentario: state.comments.loading,
        fileProgress: state.comments.progress,
        loadingFile: state.comments.loadingFile,
        archivo: state.comments.archivo,
        url: state.comments.url,
        tareaNueva: state.tareaActual.tareaNueva,
        socket: state.socket.socket
    }
};

/**
 * Se utilizan los Action Creators para Cargar proyecto, seleccionar proyecto y para el cambio de página
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => bindActionCreators({
    cargarTareas, 
    listaProyectos, 
    seleccionarProyecto, 
    seleccionarTarea, 
    actualizarTarea, 
    listaUsuarios, 
    actualizarGente, 
    guardarTarea, 
    guardarTareaNueva,
    limpiarTareaActual,
    actualizaListaTareas,
    commentChanged,
    commentGuardar,
    commentListUpdate,
    fileCancel,
    fileChange,
    enviarSocket,
    changePage: (page, id) => push(`${page}/${id}`)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Tareas)