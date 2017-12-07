import React, { Component } from 'react';
import { Tarea, ChatItem, Input, Modal, ContextMenu, FormRow } from '../components';
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
    actualizaListaTareas,
    commentChanged,
    commentGuardar,
    commentListUpdate
} from '../actions';

class Tareas extends Component{
    constructor(props){
        super(props);
        this.state = {
            tareas: [],
            id_tarea_selected: null,
            currentComments: [],
            listaContext: [],
            mostrarContextMenu: false,
            imageUrl:null
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
     * Guardar una tarea nuevo o editar uno
     */
    onGuardar(){
        //Cuando el proyecto es nuevo el id_status es null
        if(this.props.tareaActual.tmp_tarea.id_status !== null) {
            this.props.guardarTarea(this.props.tareaActual.tmp_tarea);
        } else {
            this.props.guardarTarea(this.props.tareaActual.tmp_tarea);
        }
        
    }       

    /**
     * Commentar
     */
    enviarComment(){
        const comentario = {
            id_usuario: JSON.parse(localStorage.sessionData).id_usuario,
            txt_comentario: this.props.comments.commentText,
            imagen: ""
        };

        this.props.commentGuardar(comentario, this.props.tareaActual.tmp_tarea.id_tarea, this.state.attachment)
    }

    /**
     * Cargo el chat una vez que seleccionan la tarea
     * @param {*} id_tarea 
     */
    tareaClick(id_tarea){

        //Seleccionar Tarea
        const currentTarea = this.props.tareas.filter(tarea => tarea.id_tarea === id_tarea);
        this.props.seleccionarTarea(currentTarea[0],JSON.parse(JSON.stringify(currentTarea[0])));
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
                        {(this.state.imageUrl !== null)?<img style={{height:'100%', border: '1px dashed gray'}} src={this.state.imageUrl} />:null}
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

    renderLoadingMessage(){
        const sessionData = JSON.parse(localStorage.sessionData)
        if(this.props.loadingComentario){
            return <ChatItem 
                txt_comentario={this.props.comments.comment.txt_comentario}
                loading={true}
                progress={this.props.fileProgress}
                id_usuario={parseInt(this.props.comments.comment.id_usuario)}
                id_current_user={sessionData.id_usuario}
            />            
        }

        if(this.props.loadingFile){
            return <ChatItem 
                        loading={true}
                        progress={this.props.fileProgress}
                        imagen={this.state.imageUrl}
                        id_usuario={sessionData.id_usuario}
                        id_current_user={sessionData.id_usuario}
                        id_tipo_comentario={1}
                    />      
        }

        return null;
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
                ruta = `${Config.network.server}/archivos/${comment.imagen}`                
            }
            return (
                <ChatItem 
                    key={parseInt(comment.id_tarea_unique)}
                    id_tipo_comentario={parseInt(comment.id_tipo_comentario)}
                    txt_comentario={comment.txt_comentario}
                    fec_comentario={comment.fec_comentario}
                    id_usuario={parseInt(comment.id_usuario)}
                    id_tarea_unique={parseInt(comment.id_tarea_unique)}
                    id_current_user={12}
                    imagen={ruta}
                />
            )
        }).reverse();
    }

    /**
     * Renderizo las tareas si ya existen en el state
     */
    renderTareas(){
        if(this.props.tareas !== null && this.props.tareas !== undefined) {
            return this.props.tareas.map(tarea => {
                    const selected = (tarea.id_tarea == this.props.tareaActual.tmp_tarea.id_tarea)?true:false;
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

        //Actualizar tarea editada del modal
        if(Object.keys(this.props.tareaActual.tmp_tarea).length === 0 && this.state.mostrarModal === true){
            this.setState({ mostrarModal: false });
            this.props.actualizaListaTareas(this.props.proyectos, this.props.proyectoActual.proyecto, this.props.tareaActual.tarea);
           // this.props.limpiarProyectoActual();
        }        

        //Actualizar tarea de comentarios
        if(Object.keys(this.props.comments.comment).length > 0) {
            this.props.commentListUpdate();
            this.props.actualizaListaTareas(this.props.proyectos, this.props.proyectoActual.proyecto, this.props.tareaActual.tarea, this.props.comments.comment);
        }

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
                        {this.renderLoadingMessage()}
                        </div>
                    </div>
                    {this.renderChatFooter()}
                </div>
            </div>
        );        
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
                    let archivo = '';
                    me.setState({ imageUrl: evt.target.result });
                    const attachment = {
                                            uri: evt.target.result,
                                            name: filename,
                                            type: filetype
                                        }
                    me.setState({ attachment: files[0] });

                }

                reader.readAsDataURL(f);
            }
        } catch(err){

        }
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
        fileProgress: state.fileProgress.progress,
        loadingFile: state.fileProgress.loading
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
    actualizaListaTareas,
    commentChanged,
    commentGuardar,
    commentListUpdate,
    changePage: (page, id) => push(`${page}/${id}`)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Tareas)