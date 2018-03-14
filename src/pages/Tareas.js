import React, { Component } from 'react';
import { Input, Modal, ContextMenu, FormRow, Chat, NewTask, Segmented, CheckList, Radio } from '../components';
import swal from 'sweetalert';
import Tarea from '../components/Tarea';
import Slider from 'react-rangeslider';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { Helper, Config } from '../configuracion';
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
    listaUsuarios, 
    actualizarGente, 
    guardarTarea,
    editarComentario,
    guardarComentario,
    editarArchivo,
    cancelarArchivo,
    enviarSocket,
    getTarea,
    clearSocket,
    clearTareaSocket,
    refreshTarea,
    loadMore,
    marcarLeida,
    crearSubtarea,
    borrarSubtarea,
    editarSubtarea,
    cargarMasTareas,
    buscarTexto
} from '../actions';

const { network } = Config;

class Tareas extends Component{
    constructor(props){
        super(props);
        this.state = {
            tareas: [],
            id_tarea_selected: null,
            currentComments: [],
            listaContext: [],
            mostrarContextMenu: false,
            tipoDetalle: 0,
            mostrarFiltros: false,
            filtroEstatus: null,
            filtroFecha: null
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
            this.props.changePage(network.basename,"");
            return;
        } else {
            sessionData = JSON.parse(localStorage.sessionData)
        }


        if(this.props.proyectoActual.id_proyecto === undefined) {
            this.props.listaProyectos(sessionData.id_usuario);
        } 

        if(this.props.proyectoActual.id_status == 2 && this.props.proyectoActual.tareas.length === 0){
            this.props.cargarMasTareas(this.props.proyectos,this.props.proyectoActual,JSON.parse(localStorage.sessionData).id_usuario);            
        }

        if(this.props.proyectoActual.id_status == 1 && this.props.proyectoActual.tareas.length === 0 && this.props.proyectoActual.taskCount > 0){
            this.props.cargarMasTareas(this.props.proyectos,this.props.proyectoActual,JSON.parse(localStorage.sessionData).id_usuario);            
        }        

        const id_tarea = this.props.tareaActual.id_tarea;

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
            const proyectoActual = nextProps.proyectos.filter(proyecto => proyecto.id_proyecto === parseInt(currentRoute.split("/")[currentRoute.split("/").length - 1]));
        
            //Si el proyecto no existe (es de otro usuario ó no tiene permisos) regresar a proyectos
            if(proyectoActual.length === 0){
                this.props.changePage(`${network.basename}/proyectos`,"");
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
        const {ChatComponent, CheckList, listaTareas} = this.refs;

        if(this.state.scrollTopListaTareas !== listaTareas.scrollTop){
            listaTareas.scrollTop = this.state.scrollTopListaTareas;
        }

        if(this.props.tareaActual.tareaRender === true){
            this.props.tareaRenderEnd();
            const proyecto = this.props.proyectos.filter(proyecto => proyecto.id_proyecto === this.props.proyectoActual.proyecto.id_proyecto);
            const tarea = proyecto[0].tareas.filter(tarea => tarea.id_tarea === this.props.tareaActual.id_tarea);
            
            this.props.refreshTarea(tarea[0]);     
        }

        if(ChatComponent !== undefined && this.state.lastTop <= 30 && ChatComponent.refs.chatScroll.scrollHeight !== this.state.lastHeight) {
            ChatComponent.setScrollTop(ChatComponent.refs.chatScroll.scrollHeight - this.state.lastHeight);   
            this.setState({ lastHeight: ChatComponent.refs.chatScroll.scrollHeight });
        } 

        //Poner el text cuando acaban de agregar subtarea para hacerlo más agil
        try{
            if(CheckList !== undefined && 
                this.props.tareaActual.subtareas !== undefined &&
                prevProps.tareaActual.subtareas !== undefined &&
                CheckList.refs.newCheck !== undefined && 
                JSON.stringify(prevProps.tareaActual) !== JSON.stringify(this.props.tareaActual)){
                    CheckList.refs.newCheck.refs.newTaskDiv.click();
            }
        } catch(err){
            this.setState({ tipoDetalle: 0 });
        }

    }

    componentDidMount(){
        const {ChatComponent, CheckList, listaTareas} = this.refs;

        if(this.props.proyectoActual.tareas.length > 0 && 
            this.props.proyectoActual.tareas.length !== this.props.proyectoActual.taskCount &&
            listaTareas.clientHeight == listaTareas.scrollHeight
        ){
            this.props.cargarMasTareas(this.props.proyectos,this.props.proyectoActual,JSON.parse(localStorage.sessionData).id_usuario);
        }      
    }

    /**
     * Abrir el contextMenu
     */
    onContextOpen(e, id_tarea){
        //Validar situación de la tarea (que menú se va a mostrar)
        const sessionData = JSON.parse(localStorage.sessionData);
        const tareaActual = this.props.proyectoActual.tareas.filter(tarea => tarea.id_tarea === id_tarea)[0];
        const roleId = parseInt(tareaActual.role_id);

        if(tareaActual === undefined){
            return;
        }

        //Generar lista
        const lista = [];        

        if(tareaActual.id_status === 1){
            switch(roleId){
                case 1:
                    lista.push({ nombre: 'Editar tarea', icono: null, evento: 'editar', enabled: true });
                    lista.push({ nombre: 'Marcar como atendida', icono: 'done', evento: 'atender', enabled: true });
                    lista.push({ nombre: 'Marcar como terminada', icono: 'done_all', evento: 'terminar', enabled: true });
                    break;
                case 2:
                    lista.push({ nombre: 'Editar tarea', icono: null, evento: 'editar', enabled: true });
                    lista.push({ nombre: 'Marcar como atendida', icono: 'done', evento: 'atender', enabled: true });
                    break;                
                case 3:
                    break;                
            }
        } else if(tareaActual.id_status === 2){
            switch(roleId){
                case 1:
                    lista.push({ nombre: 'Editar tarea', icono: null, evento: 'editar', enabled: true });
                    lista.push({ nombre: 'Marcar como atendida', icono: 'done', evento: 'atender', enabled: true });
                    lista.push({ nombre: 'Marcar como activa', icono: null, evento: 'activar', enabled: true });
                    break;
                case 2:
                    lista.push({ nombre: 'Editar tarea', icono: null, evento: 'editar', enabled: true });
                    lista.push({ nombre: 'Marcar como activa', icono: null, evento: 'activar', enabled: true });
                    break;                
                case 3:
                    break;                
            }            
        } else if(tareaActual.id_status === 3){
            switch(roleId){
                case 1:
                    lista.push({ nombre: 'Editar tarea', icono: null, evento: 'editar', enabled: true });
                    lista.push({ nombre: 'Reactivar tarea', icono: null, evento: 'activar', enabled: true });
                    lista.push({ nombre: 'Marcar como terminada', icono: 'done_all', evento: 'terminar', enabled: true });
                    break;
                case 2:
                    lista.push({ nombre: 'Reactivar', icono: null, evento: 'activar', enabled: true });
                    break;                
                case 3:
                    break;                
            }               
        }

        //Seleccionar Tarea
        this.props.seleccionarTarea(id_tarea, true, false);
        this.props.marcarLeida(this.props.proyectos,this.props.proyectoActual.id_proyecto, id_tarea,sessionData.id_usuario);

        let y = e.clientY;
        if(this.refs.listaTareas.scrollHeight - e.clientY < 250){
            y = e.clientY - 80;
        }

        //Mostrar menú
        this.setState({ mostrarContextMenu: true, listaContext: lista, posicion: {x: e.clientX, y} });

    }

    onContextClick(item) {

        switch(item.evento){
            case 'editar':
                this.setState({ mostrarModal: true });
                break;
            case 'atender':
                this.editarEstatus(3);
                break;
            case 'activar':
                this.editarEstatus(1);
                break;
            case 'terminar':
                this.editarEstatus(2);
                break;                
            default:
                break;
        }

        this.setState({ mostrarContextMenu: false });
    }

    editarEstatus(id_status){
        const tmpProyecto = this.props.proyectoActual;
        const tmpTarea = this.props.tareaActual;

        this.props.editarTarea({ prop: 'id_status', value: id_status, tmpProyecto, tmpTarea  }, (proyecto, tarea) => {
            this.props.guardarTarea(this.props.proyectos, proyecto.id_proyecto, tarea);
        });
    }

    /**
     * Guardar una tarea nuevo o editar uno
     */
    onGuardar(txt_tarea){

        if(this.props.tareaActual.isCalendarSync === 1 && this.props.tareaActual.fec_limite > this.props.tareaActual.fec_limiteCal){
            swal("Alerta", "Las horas en las fechas limites nos son validas.", "warning");
            return;
        }

        if(!this.props.gapi.auth2.getAuthInstance().isSignedIn.get()){
            swal("Alerta", "Debe conectarse a su cuenta de google para agregar al calendario. Revise la seccion de 'Ajustes'", "warning");
            return;
        }

        //Cuando la tarea es nueva el txt_tarea es undefined
        if(!txt_tarea) { //UPDATE
            this.props.guardarTarea(this.props.proyectos, this.props.proyectoActual.id_proyecto, this.props.tareaActual, false, (tarea) => {
                this.setState({ mostrarModal: false });
                if(tarea.isCalendarSync){
                    this.agregarCalendario(tarea);
                } else {
                    this.borrarCalendario(tarea);
                }
            });
        } else { //INSERT
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

    agregarCalendario({id_tarea, txt_tarea, fec_limite, fec_limiteCal}) {
            var event = {
                /*'id': 'focus' + id_tarea,*/
                'summary': txt_tarea,
                /*'location': '800 Howard St., San Francisco, CA 94103',*/
                'description': '[creado automaticamente por sistemafocus.com]-'+id_tarea,
                'start': {
                'dateTime': fec_limite.replace(" ","T") + '-06:00',
                'timeZone': 'America/Mexico_City'
                },
                'end': {
                'dateTime': fec_limiteCal.replace(" ","T") + '-06:00',
                'timeZone': 'America/Mexico_City'
                },
                /*'recurrence': [
                'RRULE:FREQ=DAILY;COUNT=2'
                ],
                'attendees': [
                {'email': 'esosarodriguez1@sheffield.ac.uk'}
                ],*/
                'reminders': {
                    'useDefault': true,
                    /*'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10}
                    ]*/
                }
            };

            var request = this.props.gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });

            request.execute(function(event) {
                console.log(event);
                //alert("agregado al calendario");
                //listEvents(true);
            });		
    }

    borrarCalendario({ id_tarea }) {
        const me = this;
        this.props.gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 250,
            'orderBy': 'startTime',
            'q': '[creado automaticamente por sistemafocus.com]'
          }).then(function(response) {
                const googleEvents = response.result.items;
                //Agrego icono a la tarea
                if (googleEvents.length > 0) {
                    for (let i = 0; i < googleEvents.length; i++) {
                        var event = googleEvents[i];
    
                        var id_tareaCal = event.description.split("-")[1];
    
                        if(id_tareaCal == id_tarea) {
                            var request = me.props.gapi.client.calendar.events.delete({
                                'calendarId': 'primary',
                                'eventId': event.id
                            });                        
                            
                            request.execute(function(event) {
                                console.log(event);
                                //alert("borrado del calendario");
                                //listEvents(true);
                            });		
                        }
                    }
                }
    
          });    
    }    

    /**
     * Load more comments
     */
    onLoadMore() {
        try{
            const { id_tarea, topComments, id_proyecto } = this.props.tareaActual;

            this.props.loadMore(this.props.proyectos,id_proyecto,id_tarea,topComments[topComments.length - 1].fec_comentario);
    
            const {ChatComponent} = this.refs;
            this.setState({ lastHeight: ChatComponent.refs.chatScroll.scrollHeight, lastTop: 0 });
        } catch(err){
            console.log(err);
        }


    }

    /**
     * Commentar
     */
    enviarComment(){
        const comentario = {
            id_usuario: JSON.parse(localStorage.sessionData).id_usuario,
            txt_comentario: this.props.comentario,
            imagen: this.props.archivo.file,
            txt_tarea: this.props.tareaActual.txt_tarea
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
                id_proyecto: this.props.proyectoActual.id_proyecto,
                id_usuario: `${usuario.id_usuario}`,
                sn_imagen: usuario.sn_imagen,
                txt_abbr: usuario.txt_abbr,
                mensaje,
                color: usuario.color
            }
        }

        if(this.props.ws.readyState === this.props.ws.OPEN) {
            this.props.ws.send(JSON.stringify(obj));        
        }
        
    }

    checkIfTyping(socket){
        if(socket.mensaje !== undefined && socket.id_tarea === this.props.tareaActual.id_tarea && socket.accion === "typing") {
            return { id_usuario: socket.id_usuario, mensaje: socket.mensaje, sn_imagen: socket.sn_imagen, txt_abbr: socket.txt_abbr, color: socket.color };
        }

        return "";
    }
    /**
     * Cargo el chat una vez que seleccionan la tarea
     * @param {*} id_tarea 
     */
    tareaClick(id_tarea){

        //Seleccionar Tarea
        const sessionData = JSON.parse(localStorage.sessionData);
        this.props.seleccionarTarea(id_tarea, false, true);
        this.props.marcarLeida(this.props.proyectos,this.props.proyectoActual.id_proyecto, id_tarea,sessionData.id_usuario, () => {
            this.wsComment("enviar",{ id_tarea });
        });
        this.props.editarComentario("", {});
        
    }

    /**
     * Checar si el scroll llegó hasta abajo
     */
    checkScroll(e){
        const { offsetHeight, scrollHeight, scrollTop} = e.target;
        if(scrollTop !== 0){
            this.setState({ scrollTopListaTareas: scrollTop })
        }

        if(offsetHeight + scrollTop === scrollHeight){
            if(this.props.proyectoActual.tareas.length !== this.props.proyectoActual.taskCount){
                this.props.cargarMasTareas(this.props.proyectos,this.props.proyectoActual,JSON.parse(localStorage.sessionData).id_usuario);
            }
        }
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
            avance,
            isCalendarSync,
            fec_limiteCal
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
        
        let usuarios = [];
        let usuariosPart = [];

        if(this.props.usuarios.usuarios !== undefined && this.props.usuarios.usuarios.length > 0) {
            usuarios = [ ...this.props.usuarios.usuarios ];
            usuariosPart = usuarios.filter(usuario => usuario.id_usuario !== responsable[0].id_usuario)
        }

        return (
            <Modal 
                type='FORM' 
                isVisible={this.state.mostrarModal} 
                titulo={Helper.htmlDecode(txt_tarea)}
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
                        value={Helper.htmlDecode(txt_tarea)}
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
                <FormRow titulo='ESTATUS'>
                    <Segmented 
                        value={id_status}
                        items={[
                            {value: 1, title:'Activa', icon:''},
                            {value: 3, title:'Atendida', icon:'done'},
                            {value: 2, title:'Terminada', icon:'done_all'}
                        ]}
                        onSelect={
                            value => this.props.editarTarea({ 
                                prop: 'id_status', 
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
                        options={usuarios}
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
                        options={usuariosPart}
                        multi={true}
                    />                    
                </FormRow>                      
                <FormRow titulo='FECHA LIMITE'>
                    <div style={{ display:'flex' }}>
                        <DatePicker 
                            selected={Helper.toDateM(fec_limite)}
                            onChange={
                                (date) => {
                                    this.props.editarTarea({ 
                                        prop: 'fec_limite', 
                                        value:date.format('YYYY-MM-DD HH:mm'),
                                        tmpProyecto,
                                        tmpTarea
                                    })
                                }
                            }
                            locale="es"
                            className="dateStyle"
                            showMonthDropdown
                            showYearDropdown
                            showTimeSelect={(isCalendarSync==1)?true:false}
                            timeFormat={(isCalendarSync==1)?"HH:mm":''}
                            timeIntervals={15}
                            dateFormat={(isCalendarSync==1)?"DD/MM/YYYY HH:mm":undefined}
                            timeCaption="Hora"                               
                            dropdownMode="select"
                            todayButton="Hoy"
                            placeholderText="Fecha limite"
                            minDate={moment()}
                        />  
                        <Radio 
                            label="Calendario"
                            id="rdbCalendario"
                            style={{ marginLeft: '20px', marginRight: '20px' }}
                            checked={(isCalendarSync == 0)?false:true}
                            onChange={(value) => {
                                    this.props.editarTarea({ 
                                        prop: 'isCalendarSync', 
                                        value:(value)?1:0,
                                        tmpProyecto,
                                        tmpTarea
                                    });                                                           
                            }}
                        />  
                        <DatePicker 
                            selected={(fec_limiteCal == "")?Helper.toDateM(fec_limite):Helper.toDateM(fec_limiteCal)}
                            onChange={
                                (date) => {
                                    this.props.editarTarea({ 
                                        prop: 'fec_limiteCal', 
                                        value:date.format('YYYY-MM-DD HH:mm'),
                                        tmpProyecto,
                                        tmpTarea
                                    })
                                }
                            }
                            locale="es"
                            className="dateStyle"
                            disabled={!isCalendarSync}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat='DD/MM/YYYY HH:mm'                            
                            timeCaption="Hora"                            
                            dropdownMode="select"
                            todayButton="Hoy"
                            placeholderText="Fecha limite"
                            minDate={Helper.toDateM(fec_limite)}
                            maxDate={Helper.toDateM(fec_limite)}
                            minTime={(Helper.toDateM(fec_limite)!== null)?moment().hours(Helper.toDateM(fec_limite).hour()).minutes(Helper.toDateM(fec_limite).minutes()+15):undefined}
                            maxTime={moment().hours(23).minutes(59)}
                        />                         
                    </div>
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
        if(this.props.tareas !== null && this.props.tareas !== undefined  ) {
            const me = this;
            const tmpTarea = this.props.tareaActual;
            const tmpProyecto = this.props.proyectoActual;

            let tareas = this.props.tareas.filter(tarea => tarea.txt_tarea.toLowerCase().includes(this.props.buscar));

            if(this.state.filtroEstatus !== null){
                tareas = tareas.filter(tarea => tarea.id_status === this.state.filtroEstatus);
            }

            if(this.state.filtroFecha !== null){
                tareas = tareas.filter(tarea => Helper.prettyfyDate(tarea.fec_limite).estado === this.state.filtroFecha);
            }            
            

            return tareas.map(tarea => {
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
                            nuevo={tarea.nuevo}
                            typing={typing}
                            id_status={tarea.id_status}
                            isCalendarSync={tarea.isCalendarSync}
                            editarTarea={({ prop, value }) => { 
                                    this.props.editarTarea({ prop, value,tmpProyecto, tmpTarea}, (proyecto, tarea) => {
                                        this.props.guardarTarea(this.props.proyectos, proyecto.id_proyecto, tarea, false, () => {
                                            this.setState({ mostrarModal: false });                
                                        });
                                    }); 
                            }}
                            onClick={this.tareaClick.bind(this)}
                            onMenuOpen={(e) => this.onContextOpen(e,tarea.id_tarea)}
                        />
                    )
            })/*.sort((a,b) => {
                return (a.props.notificaciones > b.props.notificaciones)?0:1
            })*/;
        }

    }

    renderTipoDetalle(usuario){
    
        const tmpTarea = this.props.tareaActual;
        const tmpProyecto = this.props.proyectoActual;
        const proyectos = this.props.proyectos;

        if(this.state.tipoDetalle === 0){
            return (
                <Chat 
                    ref={'ChatComponent'}
                    loadingFile={this.props.loadingFile}
                    loadingComentario={this.props.loading}
                    loadingMore={this.props.loadingMore}
                    fileProgress={this.props.fileProgress}
                    url={this.props.archivo.url}
                    comments={this.props.tareaActual.topComments}
                    participantes={this.props.tareaActual.participantes}
                    idCampo={'ultimoVisto'}
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
                    onScroll={(value) => { 
                        this.setState({ lastTop: value }); 
                    }}
                />            
            );            
        }

        return (<div style={{ margin: '100px', marginTop: '20px'}}>
                    <CheckList 
                        ref={'CheckList'}
                        data={tmpTarea.subtareas}
                        loading={this.props.loadingChecklist}
                        keyProp='idSubtarea'
                        descProp='subtarea'
                        checkedProp='id_status'
                        onChange={(item,change) => {
                            item.id_usuario = usuario.id_usuario;
                            switch(change){
                                case 'crear':
                                    this.props.crearSubtarea(proyectos, tmpProyecto, tmpTarea, item);
                                    break;
                                case 'editar':
                                    this.props.editarSubtarea(proyectos, tmpProyecto, tmpTarea, item);
                                    break;
                                case 'borrar':
                                    this.props.borrarSubtarea(proyectos, tmpProyecto, tmpTarea, item);
                                    break;
                                case 'textEdit':
                                    this.props.editarTarea({ prop: 'subtareas', value: item,tmpProyecto, tmpTarea});
                                    break;
                            }
                            
                        }}
                    />
                </div>);
    }

    renderLoadMore(){
        if(this.props.tareas !== null && this.props.tareas !== undefined) {
            if(this.props.tareas.length < this.props.proyectoActual.taskCount){
                return (
                    <div className="tareaCard" style={{ textAlign: 'center' }}>
                        <img style={{width: '50px', height: '50px'}} src={`${Config.network.server}/img/Spinner.gif`} />
                    </div>
                );
            } else {
                return null;
            }
        }
    }

    renderFilterButtons(filtro, color, icono, tipoFiltro, filtroActual){

        let estilo = {};
        if(filtroActual === filtro[tipoFiltro]){
            estilo = styles.selectedStyle;
        }

        return (<i 
                    style={{padding: '5px', ...estilo }} 
                    onClick={() => this.setState({ ...filtro }) } 
                    className={`material-icons ${color} botonGral`}
                >
                    {icono}
                </i>
                );

    }
    /**
     * Renderizo la pagina completa
     */
    render(){
        if(localStorage.sessionData === undefined){
            return null;
        }
        const usuario = JSON.parse(localStorage.sessionData);

        //Actualizar tarea avisada por socket
        if(Object.keys(this.props.socket).length > 0) {
            if(this.props.socket.accion === "enviar" || this.props.socket.accion === "enviarLeida") {
                this.props.clearSocket();            
                this.props.getTarea(this.props.proyectos,this.props.socket.id_tarea,usuario.id_usuario);
            }
        }

        //Actualizar tarea del socket
        if(Object.keys(this.props.tareaSocket).length > 0){
            this.props.refreshTarea(this.props.tareaSocket);                    
            this.props.clearTareaSocket();            
        }       

        return(
            <div className="detallesContainer divideTop">
                <div 
                    ref="listaTareas"
                    onScroll={this.checkScroll.bind(this)}
                    id="listaTareas" 
                    className="w3-third chatPanel lightBackground"
                >
                    <div style={{ padding: '19px',  borderBottom: '1px solid #F1F1F1' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <input 
                            placeholder="Buscar tareas..." 
                            style={{ lineHeight: '1em', border: 'none', outline: '0', flex: '1'}} 
                            onChange={({target}) => this.props.buscarTexto(target.value)}
                            value={this.props.buscar}
                        />  
                        {(this.state.mostrarFiltros) ?
                        <div style={{ display: 'flex', flex: '1', justifyContent: 'space-between'}}>
                            <div className="w3-animate-right">
                                <div className="fadeColor" style={{fontSize: '10px'}}>FILTRO POR ESTATUS</div>
                                <div style={{ display: 'flex', justifyContent: 'center'}}>
                                    {this.renderFilterButtons({filtroEstatus: 3},'clickableColor', 'done', 'filtroEstatus', this.state.filtroEstatus )}
                                    {this.renderFilterButtons({filtroEstatus: 2},'clickableColor', 'done_all', 'filtroEstatus', this.state.filtroEstatus )}
                                </div>
                            </div>                        
                            <div className="w3-animate-right">
                                <div className="fadeColor" style={{fontSize: '10px'}}>FILTRO POR FECHA</div>
                                <div style={{ display: 'flex', justifyContent: 'center'}}>
                                    {this.renderFilterButtons({filtroFecha: 'sin fecha'},'fadeColor', 'access_time', 'filtroFecha', this.state.filtroFecha )}
                                    {this.renderFilterButtons({filtroFecha: 'vencida'},'errorColor', 'access_time', 'filtroFecha', this.state.filtroFecha )}
                                    {this.renderFilterButtons({filtroFecha: 'ontime'},'mainColor', 'access_time', 'filtroFecha', this.state.filtroFecha )}
                                </div>
                            </div>
                            <div>
                                <i 
                                    style={{padding: '5px' }} 
                                    onClick={() => { this.setState({ mostrarFiltros: false, filtroEstatus: null, filtroFecha: null }) }}
                                    className="material-icons fadeColor botonGral"
                                >
                                    close
                                </i>
                            </div>
                        </div>
                         :                       
                        <div>
                            <i 
                                style={{padding: '5px' }} 
                                onClick={() => { this.setState({ mostrarFiltros: true }) }}
                                className="material-icons fadeColor botonGral"
                            >
                                filter_list
                            </i>
                        </div>                        
                        }
                    </div>
                    </div>
                    <div>
                    <NewTask 
                        onEnter={(txt_tarea) => this.onGuardar(txt_tarea)}
                    />
                    </div>
                    {this.renderTareas()}
                    {(this.props.loading)?
                        <div className="tareaCard" style={{ textAlign: 'center' }}>
                            <img style={{width: '50px', height: '50px'}} src={`${Config.network.server}/img/Spinner.gif`} />
                        </div>:null  }
                    {this.renderLoadMore()}
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
                    {(this.props.tareaActual.id_tarea !== null && this.props.tareaActual.id_tarea !== undefined)?
                    <Segmented
                        value={this.state.tipoDetalle} 
                        items={[{ value: 0, title: 'Chat', icon: 'chat' },{ value: 1, title: `Subtareas (${this.props.tareaActual.subtareas.length})`, icon: 'check_box' }]} 
                        onSelect={(value) => this.setState({ tipoDetalle: value })}                        
                    />:null}
                    {this.renderTipoDetalle(usuario)}
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
        socket: state.socket.socket,
        loadingMore: state.listaProyectos.loadingMore,
        loadingChecklist: state.listaProyectos.loadingChecklist,
        buscar: state.listaProyectos.buscar,
        gapi: state.login.gapi
    }
};

/**
 * Se utilizan los Action Creators para Cargar proyecto, seleccionar proyecto y para el cambio de página
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => bindActionCreators({
    listaProyectos, 
    seleccionarProyecto, 
    seleccionarTarea, 
    desseleccionarTarea,
    editarTarea,
    listaUsuarios, 
    actualizarGente, 
    guardarTarea, 
    editarComentario,
    guardarComentario,
    editarArchivo,
    cancelarArchivo,
    enviarSocket,
    getTarea,
    clearSocket,
    clearTareaSocket,
    loadMore,
    marcarLeida,
    crearSubtarea,
    borrarSubtarea,
    editarSubtarea,
    cargarMasTareas,
    buscarTexto,
    changePage: (page, id) => push(`${page}/${id}`)
}, dispatch)

const styles = {
    selectedStyle: {
        backgroundColor: '#F6F6F6',
        border: '1px solid #E2E2E2',
        borderRadius: '5px'
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tareas)