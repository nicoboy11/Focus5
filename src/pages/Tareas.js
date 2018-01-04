import React, { Component } from 'react';
import { Tarea, Input, Modal, ContextMenu, FormRow, Chat, NewTask } from '../components';
import Slider from 'react-rangeslider';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Helper } from '../configuracion';
import DatePicker from 'react-datepicker';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import 'moment/locale/es'
import 'react-rangeslider/lib/index.css'

import { connect } from 'react-redux';
import { 
    //cargarTareas, 
    listaProyectos, 
    seleccionarProyecto, 
    seleccionarTarea, 
    desseleccionarTarea,
    editarTarea,

    //actualizarTarea, 
    listaUsuarios, 
    actualizarGente, 
    guardarTarea,
    editarComentario,
    guardarComentario,
    editarArchivo,
    cancelarArchivo,
    //guardarTareaNueva,
    //limpiarTareaActuallimpiarTareaActual,
    //actualizaListaTareas,
    //commentChanged,
    //commentGuardar,
    //commentListUpdate,
    //fileCancel,
    //fileChange,
    enviarSocket,
    getTarea,
    clearSocket,
    clearTareaSocket,
    refreshTarea,
    loadMore,
    //tareaRenderStart,
    //tareaRenderEnd,
    //proyect_refresh,
    //moreEnd
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


        if(!this.props.proyectoActual.id_proyecto) {
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

        if (nextProps.proyectoActual.id_proyecto === undefined && nextProps.loading === false){
            const currentRoute = window.location.pathname;

            //Seleccionar proyecto y obtener objeto
            const proyectoActual = nextProps.proyectos.filter(proyecto => proyecto.id_proyecto === parseInt(currentRoute.split("/")[2]));
        
            //Si el proyecto no existe (es de otro usuario ó no tiene permisos) regresar a proyectos
            if(proyectoActual.length === 0){
                this.props.changePage("/proyectos","");
                return;
            }

            //Guardar proyecto en el estate (Accion seleccionar)
            this.props.seleccionarProyecto(JSON.parse(JSON.stringify(proyectoActual[0])));     
            
            //Carga para usuarios
            const sessionData = JSON.parse(localStorage.sessionData)

            //Cargar usuarios
            this.props.listaUsuarios(sessionData.id_usuario);         

        } else if ( nextProps.proyectoActual.id_proyecto && 
                    nextProps.tareas.length === 0 && 
                    nextProps.tareas === this.props.tareas &&
                    nextProps.usuarios === this.props.usuarios
                ){
           // this.props.cargarTareas(nextProps.proyectos, nextProps.id_proyecto);
        }

    }

    componentDidUpdate(prevProps, prevState){
        const {ChatComponent} = this.refs;

        if(this.props.tareaActual.tareaRender === true){
            this.props.tareaRenderEnd();
            const proyecto = this.props.proyectos.filter(proyecto => proyecto.id_proyecto === this.props.proyectoActual.proyecto.id_proyecto);
            const tarea = proyecto[0].tareas.filter(tarea => tarea.id_tarea === this.props.tareaActual.id_tarea);
            
            this.props.refreshTarea(tarea[0]);     
        }

        if(this.state.lastTop === 0 && ChatComponent.refs.chatScroll.scrollHeight !== this.state.lastHeight) {
            ChatComponent.setScrollTop(ChatComponent.refs.chatScroll.scrollHeight - this.state.lastHeight);   
            this.setState({ lastHeight: ChatComponent.refs.chatScroll.scrollHeight });
        }
    }

    /**
     * Abrir el contextMenu
     */
    onContextOpen(e, id_tarea){
        //Validar situación de la tarea (que menú se va a mostrar)
        //.....

        //Seleccionar Tarea
        this.props.seleccionarTarea(id_tarea, true, false);

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
            this.props.guardarTarea(this.props.proyectos, this.props.proyectoActual.id_proyecto, this.props.tareaActual);
        } else {
            let tareaNueva = {
                    avance: 0,
                    fec_creacion: '',
                    fec_limite: '',
                    id_status: 1,
                    id_tarea: null,
                    notificaciones: 0,
                    participantes: [],
                    priority_id: 1,
                    topComments: [],
                    txt_tarea: txt_tarea,
                    id_proyecto: this.props.proyectoActual.id_proyecto,
                    id_usuario: JSON.parse(localStorage.sessionData).id_usuario,
                    id_responsable: JSON.parse(localStorage.sessionData).id_usuario
            };

            this.props.guardarTarea(this.props.proyectos, this.props.proyectoActual.id_proyecto, tareaNueva, true);
        }
        
    }   

    /**
     * Load more comments
     */
    onLoadMore() {
        const { id_tarea, topComments, id_proyecto } = this.props.tareaActual;
        this.props.loadMore(this.props.proyectos,id_proyecto,id_tarea,topComments[topComments.length - 1].fec_comentario);

        const {ChatComponent} = this.refs;
        this.setState({ lastHeight: ChatComponent.refs.chatScroll.scrollHeight, lastTop: 0 });

    }

    /**
     * Commentar
     */
    enviarComment(){
        const comentario = {
            id_usuario: JSON.parse(localStorage.sessionData).id_usuario,
            txt_comentario: this.props.comentario,
            imagen: this.props.archivo.file
        };

        const {ChatComponent} = this.refs;
        this.setState({ lastHeight: ChatComponent.refs.chatScroll.scrollHeight, lastTop: ChatComponent.refs.chatScroll.scrollTop });        

        this.props.guardarComentario(this.props.proyectos,this.props.proyectoActual.id_proyecto,this.props.tareaActual.id_tarea,comentario, (id_tarea) => {
            //Cuando guarde el comentario que envíe el socket            
            this.wsComment("typing","");
            this.wsComment("enviar",{ id_tarea });              
        });
    }

    wsComment(accion, mensaje){
        const usuario = JSON.parse(localStorage.sessionData);

        const obj = {
            accion,
            room: "tareas",
            id_usuario: `${usuario.id_usuario}`,
            datos: { 
                id_tarea: this.props.tareaActual.id_tarea,
                id_usuario: `${usuario.id_usuario}`,
                mensaje: mensaje
            }
        }
        this.ws.send(JSON.stringify(obj));        
    }

    checkIfTyping(socket){
        if(socket.mensaje !== undefined && socket.id_tarea === this.props.tareaActual.id_tarea && socket.accion === "typing") {
            return { id_usuario: socket.id_usuario, mensaje: socket.mensaje };
        }

        return "";
    }
    /**
     * Cargo el chat una vez que seleccionan la tarea
     * @param {*} id_tarea 
     */
    tareaClick(id_tarea){

        //Seleccionar Tarea
        this.props.seleccionarTarea(id_tarea, false, true);
        this.props.editarComentario("", {});
        this.wsComment("typing","");
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
        } = this.props.tareaActual;

        const tmpTarea = this.props.tareaActual;
        const tmpProyecto = this.props.proyectoActual;

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
                onCerrar={() => { 
                    this.setState({ mostrarModal: false }); 
                    this.props.desseleccionarTarea(this.props.proyectos, this.props.proyectoActual); 
                }}
            >
                {/*txt_tarea*/}            
                <FormRow titulo='NOMBRE'>
                    <Input 
                        type="EXTENDEDTEXT"
                        autoFocus={true}
                        placeholder='Nombre de la tarea' 
                        value={txt_tarea}
                        onChangeText={
                            value => this.props.editarTarea({ 
                                        prop: 'txt_tarea', 
                                        value,
                                        tmpProyecto,
                                        tmpTarea
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
                            value => this.props.editarTarea({ 
                                        prop: 'txt_descripcion', 
                                        value,
                                        tmpProyecto,
                                        tmpTarea
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
                                            tmpProyecto,
                                            tmpTarea
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
                                        tmpProyecto,
                                        tmpTarea
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
                                    this.props.editarTarea({ 
                                        prop: 'fec_limite', 
                                        value:date.format('YYYY-MM-DD'),
                                        tmpProyecto,
                                        tmpTarea
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
                        onChange={  value => this.props.editarTarea({ 
                                        prop: 'id_proyecto', 
                                        value: value.id_proyecto, 
                                        tmpProyecto,
                                        tmpTarea
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
                        onChange={value => this.props.editarTarea({ 
                                        prop: 'avance', 
                                        tmpProyecto,
                                        value, 
                                        tmpTarea
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
                    const selected = (tarea.id_tarea === me.props.tareaActual.id_tarea)?true:false;
                    const typing = (tarea.id_tarea === me.props.socket.id_tarea && me.props.socket.accion === "typing")?me.props.socket.mensaje:"";
                    return (
                        <Tarea 
                            key={tarea.id_tarea}
                            id_tarea={tarea.id_tarea}
                            participantes={tarea.participantes} 
                            txt_tarea={tarea.txt_tarea}
                            fec_limite={tarea.fec_limite}
                            notificaciones={tarea.notificaciones}
                            txt_proyecto={this.props.proyectoActual.txt_proyecto}
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
        const usuario = JSON.parse(localStorage.sessionData);

        //Actualizar tarea avisada por socket
        if(Object.keys(this.props.socket).length > 0) {
            if(this.props.socket.accion === "enviar") {
                this.props.clearSocket();            
                this.props.getTarea(this.props.proyectos,this.props.socket.id_tarea,usuario.id_usuario);
            }
        }

        //Actualizar tarea del socket
        if(Object.keys(this.props.tareaSocket).length > 0){
            this.props.refreshTarea(this.props.tareaSocket);                    
            this.props.clearTareaSocket();            
        }     


        //Actualizar tarea editada del modal
        if(Object.keys(this.props.tareaActual).length === 0 && this.state.mostrarModal === true){
            this.setState({ mostrarModal: false });
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
                    onClose={() => {
                        this.setState({ mostrarContextMenu: false });
                    }}
                />
                </div>
                <div className="w3-twothird chatPanel divideLeft" >
                    <Chat 
                        ref={'ChatComponent'}
                        loadingFile={this.props.loadingFile}
                        loadingComentario={this.props.loading}
                        loadingMore={this.props.loadingMore}
                        fileProgress={this.props.fileProgress}
                        url={this.props.archivo.url}
                        comments={this.props.tareaActual.topComments}
                        text={this.props.comentario}
                        fec_creacion={this.props.tareaActual.fec_creacion}
                        commentCount={this.props.tareaActual.commentCount}
                        commentChanged={(value) => {
                            this.props.editarComentario(value);
                            //Envío a gente para que sepan que estoy escribiendo
                            this.wsComment("typing",(value !== "")?`${usuario.txt_usuario} está escribiendo...`:"");
                        }}
                        enviarComment={this.enviarComment.bind(this)}
                        fileChange={(file, event) => this.props.editarArchivo(file, event)}
                        onLoadMore={this.onLoadMore.bind(this)}
                        //Recibir webSocket cuando alguien está escribiendo
                        typing={this.checkIfTyping(this.props.socket)}
                        scrollTop={this.state.lastTop}
                        onScroll={(value) => { this.setState({ lastTop: value }); }}
                    />

                </div>
            </div>
        );        
    }

}

const mapStateToProps = state => {

    //Declaro objetos de tareas tareas
    let tareaActual = {};
    let tareaNueva = {};

    //Filtro la tarea para trabajar con ella
    const filterTarea = state.listaProyectos.tmpProyecto.tareas.filter(tarea => tarea.id_tarea === state.listaProyectos.tareaActual.id_tarea );
    const filterTareaNueva = state.listaProyectos.tmpProyecto.tareas.filter(tarea => tarea.id_tarea === null );
    const proyecto = state.listaProyectos.proyectos.filter(proyecto => proyecto.id_proyecto === state.listaProyectos.tmpProyecto.id_proyecto);
    const tareas = proyecto[0]?proyecto[0].tareas:[];

    //Si existe la asigno
    if(filterTarea.length > 0) {    tareaActual = filterTarea[0];   }
    if(filterTareaNueva.length > 0) {    tareaNueva = filterTareaNueva[0];   }

    return { 
        proyectos: state.listaProyectos.proyectos,
        proyectoActual: state.listaProyectos.tmpProyecto,
        tareas,
        tareaActual,
        tareaNueva,
        seleccionTarea: state.listaProyectos.tareaActual,
        comentario: state.listaProyectos.comentarioNuevo,
        fileProgress: state.listaProyectos.progress,
        loading: state.listaProyectos.loading,
        archivo: state.listaProyectos.archivoNuevo,

        tareaSocket: state.listaProyectos.tareaSocket,
        usuarios: state.usuarios,
        loadingFile: state.listaProyectos.loadingFile,
        //url: state.comments.url,
        socket: state.socket.socket,
        loadingMore: state.listaProyectos.loadingMore
    }
};

/**
 * Se utilizan los Action Creators para Cargar proyecto, seleccionar proyecto y para el cambio de página
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => bindActionCreators({
    //cargarTareas, 
    listaProyectos, 
    seleccionarProyecto, 
    seleccionarTarea, 
    desseleccionarTarea,
    editarTarea,

    //actualizarTarea, 
    listaUsuarios, 
    actualizarGente, 
    guardarTarea, 
    editarComentario,
    guardarComentario,
    editarArchivo,
    cancelarArchivo,
    //guardarTareaNueva,
    //limpiarTareaActual,
   // actualizaListaTareas,
    //commentChanged,
    //commentGuardar,
    //commentListUpdate,
    //fileCancel,
    //fileChange,
    enviarSocket,
    getTarea,
    clearSocket,
    clearTareaSocket,
    //refreshTarea,
    loadMore,
    //tareaRenderEnd,
    //tareaRenderStart,
   // proyect_refresh,
    //moreEnd,
    changePage: (page, id) => push(`${page}/${id}`)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Tareas)