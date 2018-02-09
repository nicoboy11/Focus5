import React, { Component } from 'react';
import Proyecto from '../components/Proyecto';
import { Modal, Input, Radio, FormRow, Segmented, UserList} from '../components';
import { Helper} from '../configuracion';
import DatePicker from 'react-datepicker';
import swal from 'sweetalert';
import moment from 'moment';
import 'moment/locale/es';
import { Config } from '../configuracion';

import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { 
    listaProyectos, 
    seleccionarProyecto, 
    editarProyecto, 
    guardarProyecto, 
    desseleccionarProyecto,
    listaUsuarios,
    buscarTexto,
    guardaRefs
} from '../actions';

const { network } = Config;

class Proyectos extends Component{
    constructor(props){
        super(props);
    
        this.state = {
          datos: [],
          currentView: 'proyectos',
          mostrarModal: false,
          tipoLista: 0
        };
    }

    /**
     * Al abrir esta pantalla por primera vez se cargan todos los proyectos y las tareas
     */
    componentWillMount(){
        if(localStorage.sessionData) {
            if(this.props.proyectos.length === 0){
                const sessionData = JSON.parse(localStorage.sessionData);
                this.props.listaProyectos(sessionData.id_usuario);
                this.props.listaUsuarios(sessionData.id_usuario);
            }
        } else {
            this.props.changePage(network.basename,"");
        }

    }
    
    componentWillReceiveProps(nextProps){
        const currentHash = window.location.hash;
        if(currentHash.split("#")[1] === "notificaciones" && !this.state.filterNotif){
            this.setState({ filterNotif: true });
        } 

        if(currentHash.split("#")[1] !== "notificaciones" && this.state.filterNotif){
            this.setState({ filterNotif: false });
        }         
    }

    /**
     * Cuando se selecciona un proyecto se manda al reducer para almacenar "current_id_proyecto" en el state
     * Después se cambia a la pagina de /proyects/:id
     * @param {*} id_proyecto 
     */
    onProyectoSelect(id_proyecto){
        //Seleccionar proyecto y obtener objeto
        const proyectoActual = this.props.proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto);
        
        //Guardar proyecto en el estate (Accion seleccionar)
        this.props.seleccionarProyecto(JSON.parse(JSON.stringify(proyectoActual[0])));

        //Cambiar de página
        this.props.changePage(`${network.basename}/proyectos`,proyectoActual[0].id_proyecto);
    }

    /**
     * Guardar un proyecto nuevo o editar uno
     */
    onGuardar(){
        //Si el proyecto no es nuevo es !== de null
        if(this.props.proyectoActual.id_status !== null) {
            if(this.props.proyectoActual.id_status === 2 && this.props.proyectoActual.taskCount > this.props.proyectoActual.taskCountTerminadas){
                swal("Alerta", "Debe dar por terminadas las tareas antes de inactivar un proyecto.", "warning");
                return;
            }
            this.props.guardarProyecto(this.props.proyectos, this.props.proyectoActual, false, () => {
                this.setState({ mostrarModal: false });
            });
        } else {
            this.props.guardarProyecto(this.props.proyectos, this.props.proyectoActual, true, () => {
                this.setState({ mostrarModal: false });
            });
        }
        
    }   
    
    /**
     * Cuando se da click en nuevo proyecto
     */
    onNuevoProyecto(){
        //Inicializar un proyecto actual
        const proyectoActual = { 
            txt_proyecto: '',
            fec_inicio: moment().format('YYYY-MM-DD'),
            fec_limite: null,
            fec_limite_disabled: true,
            id_status: null
        };

        //Guardar proyecto en el estate (Accion seleccionar)
        this.props.seleccionarProyecto(proyectoActual, JSON.parse(JSON.stringify(proyectoActual)));

        //Mostrar menu
        this.setState({ mostrarModal: true });        
    }

    /**
     * Cuando se abre el menú, se manda el id_proyecto seleccionado.
     * Tres pasos 
     * @param {*} id_proyecto 
     */
    onMenuOpen(id_proyecto){

        //Seleccionar proyecto y obtener objeto
        const proyectoActual = this.props.proyectos.filter(proyecto => proyecto.id_proyecto === id_proyecto);

        //Guardar proyecto en el estate (Accion seleccionar)
        this.props.seleccionarProyecto(proyectoActual[0], JSON.parse(JSON.stringify(proyectoActual[0])));

        //Mostrar menu
        this.setState({ mostrarModal: true });

    }    

    /**
     * Si ya hay proyectos en el state los renderiza, si no carga un "cargando..."
     */
    renderList(){
        
        if(this.props.loading){
            return <div>Cargando...</div>
        }

        let proyectos = this.props.proyectos.filter(proyecto => proyecto.txt_proyecto.toLowerCase().includes(this.props.buscar));

        if(this.state.filterNotif){
            proyectos = this.props.proyectos.filter(proyecto => {
                for(let tarea of proyecto.tareas){
                    if(tarea.notificaciones > 0){
                        return true;
                    }
                }

                return false;
            });
        }

        return proyectos.map(item => {
            return (
                <Proyecto 
                    key={item.id_proyecto} 
                    id_proyecto={item.id_proyecto}
                    txt_proyecto={item.txt_proyecto}
                    fec_inicio={item.fec_inicio}
                    fec_limite={item.fec_limite}
                    id_status={item.id_status}
                    participantes={item.participantes}
                    tareas={item.tareas}
                    total={item.taskCount}
                    terminadas={item.taskCountTerminadas}
                    nuevo={item.nuevo}
                    modificable={(item.id_proyecto===0?false:true)}
                    onProyectoSelect={() => this.onProyectoSelect(item.id_proyecto)}
                    onMenuOpen={() => this.onMenuOpen(item.id_proyecto)}
                />
            );
        });
    }

    renderColumnsDetalle(){
        if(this.props.loading){
            return <div>Cargando...</div>
        }

        let proyectos = this.props.proyectos.filter(proyecto => proyecto.txt_proyecto.toLowerCase().includes(this.props.buscar));

        if(this.state.filterNotif){
            proyectos = this.props.proyectos.filter(proyecto => {
                for(let tarea of proyecto.tareas){
                    if(tarea.notificaciones > 0){
                        return true;
                    }
                }

                return false;
            });
        }        

        return proyectos.map(proyecto => {
            return (
                    <div key={proyecto.id_proyecto} style={{ fontFamily: "'Montserrat', sans-serif", width: '300px', margin: '5px', overflowY: 'auto', flexDirection: 'column'}}>
                        <div className="w3-card" style={{backgroundColor: 'white', padding: '10px', fontWeight: 'bold'}}>
                            {proyecto.txt_proyecto}
                        </div>
                        {proyecto.tareas.map(tarea =>{
                            if(tarea.id_status == 2){
                                return null;
                            }

                            return (
                                <div key={tarea.id_tarea} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        backgroundColor: 'white',
                                        padding: '5px',
                                        borderBottom: '1px solid #F1F1F1', 
                                        paddingTop: '0px'
                                    }}
                                >
                                    <div style={{ padding: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} >{tarea.txt_tarea}</div>
                                    <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '5px', height: '16px'}}>
                                        <UserList participantes={tarea.participantes} limit={5} size="mini" />
                                        <div style={{ fontSize: '11px', color: Helper.prettyfyDate(tarea.fec_limite).color }}>
                                            {Helper.prettyfyDate(tarea.fec_limite).date}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            )
        });
    }

    /**
     * Mostrar el Modal
     */
    renderModal() {

        const {
            txt_proyecto,
            fec_inicio,
            fec_limite,
            fec_limite_disabled,
            id_status
        } = this.props.proyectoActual;

        const tmpProyecto = this.props.proyectoActual;

        return (
            <Modal 
            type='FORM' 
            isVisible={this.state.mostrarModal} 
            titulo={txt_proyecto}
            loading={this.props.loading}
            componenteInicial="txt_proyecto"
            onGuardar={() => { this.onGuardar(); }}
            onCerrar={() => { 
                this.setState({ mostrarModal: false });
                this.props.desseleccionarProyecto();
            }}
            >
                <FormRow titulo='NOMBRE'>
                    <Input 
                        type="EXTENDEDTEXT"
                        autoFocus={true}
                        placeholder='Nombre del proyecto' 
                        value={txt_proyecto}
                        onChangeText={
                            value => this.props.editarProyecto({ 
                                        prop: 'txt_proyecto', 
                                        value, 
                                        tmpProyecto
                                    })
                        }
                    />  
                </FormRow>
                <FormRow titulo='DURACIÓN'>
                    <div style={{display:'flex', flexDirection: 'row', alignItems:'center'}}>
                        <span className="txtSpan">De </span>
                        <DatePicker 
                            selected={Helper.toDateM(fec_inicio)}
                            startDate={Helper.toDateM(fec_inicio)}
                            endDate={Helper.toDateM(fec_limite)}
                            selectsStart
                            onChange={
                                (date) => {
                                    this.props.editarProyecto({ 
                                        prop: 'fec_inicio', 
                                        value:date.format('YYYY-MM-DD'),
                                        tmpProyecto
                                    })
                                }
                            }
                            locale="es"
                            className="dateStyle"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            todayButton="Hoy"
                            placeholderText="Inicio del proyecto"
                            minDate={moment()}
                        />    
                        <span className="txtSpan">a</span>    
                        <DatePicker 
                            selected={Helper.toDateM(fec_limite)}
                            selectsEnd
                            startDate={Helper.toDateM(fec_inicio)}
                            endDate={Helper.toDateM(fec_limite)}
                            disabled={(fec_limite_disabled !== undefined)?fec_limite_disabled:!fec_limite}
                            onChange={
                                (date) => {
                                    this.props.editarProyecto({ 
                                        prop: 'fec_limite', 
                                        value:date.format('YYYY-MM-DD'),
                                        tmpProyecto
                                    })
                                }
                            }
                            locale="es"
                            className="dateStyle"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            todayButton="Hoy"
                            placeholderText="Fin del proyecto"
                            minDate={Helper.toDateM(fec_inicio)}
                        />
                    </div>
                    <div style={{marginTop: '15px'}}>
                        <Radio 
                            label="Abierta" 
                            id="rdbAbierta" 
                            checked={(fec_limite_disabled !== undefined )?fec_limite_disabled:!fec_limite}
                            onChange={
                                (value) => {
                                    this.props.editarProyecto([
                                        { prop: 'fec_limite',             value: null,    tmpProyecto },
                                        { prop: 'fec_limite_disabled',    value,          tmpProyecto }
                                    ]);
                                }
                            }
                        /> 
                    </div>                                 
                </FormRow>
                {(id_status !== null) ?
                    <FormRow titulo='ESTADO'>
                        <Radio 
                            label="Activo" 
                            id="rdbActivo" 
                            checked={(id_status !== 2)?true:false}
                            onChange={
                                (value) => {
                                    this.props.editarProyecto({ 
                                        prop: 'id_status', 
                                        value: (value)?1:2,
                                        tmpProyecto
                                    })
                                }
                            }
                        /> 
                    </FormRow> :
                    null
                }
            </ Modal> 
        );     
    }

    renderGrid(){
        return (
            <div ref="listaProyectosDiv" id="list" style={styles.listWrap}>
                <div 
                    className="w3-col newProject w3-card" 
                    style={{...styles.project,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            maxHeight: '181px'}}
                    onClick={this.onNuevoProyecto.bind(this)}
                >
                    <div className="w3-circle newItem">
                        <i className="material-icons fHuge">add</i>
                    </div>
                    Nuevo Proyecto
                </div>                    
                {this.renderList()}
                {this.renderModal()}
            </div>
        );
    }

    renderColumns(){
        return (
            <div style={{ width: '100%', height: '85%', overflow: 'auto'}}>
                <div id="list" style={styles.listWrapCol}>
                    {this.renderColumnsDetalle()}
                </div>
            </div>
        );
    }

    /**
     * Renderiza la tarjeta de "Nuevo proyecto " y posteriormente la lista de proyectos
     */
    render(){

        if(this.refs.listaProyectosDiv !== undefined){
            this.props.guardaRefs(this.props.listaRef, this.refs.listaProyectosDiv);
        }
        

        if(this.props.error !== ''){
            swal('Aviso', this.props.error, 'error');
        }

        return(
            <div id="mainProyectos" style={{display:'block'}}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', paddingTop: '20px' }}>
                    <Segmented 
                        value={this.state.tipoLista} 
                        items={[{ value: 0, title: 'Grid', icon: 'view_module' },{ value: 1, title: 'Columnas', icon: 'view_week' }]} 
                        onSelect={(value) => this.setState({ tipoLista: value })}
                    />                  
                </div>
                <Input 
                    placeholder="Buscar proyectos..." 
                    style={{ lineHeight: '2em', width: '20%', alignSelf: 'center', marginTop: '10px', marginBottom:'10px' }} 
                    onChangeText={(value) => this.props.buscarTexto(value)}
                    value={this.props.buscar}
                />
                {(this.state.tipoLista === 0)?this.renderGrid():this.renderColumns()}      
            </div>
        );        
    }

}

/**
 * Los states que se usan en esta pagina son: la lista de proyectos y el proyecto seleccionado actualmente
 * @param {*} state 
 */
const mapStateToProps = state => {
    return { 
        proyectos: state.listaProyectos.proyectos, 
        error: state.listaProyectos.error,
        proyectoActual: state.listaProyectos.tmpProyecto,
        loading: state.listaProyectos.loading,
        id_proyecto: state.listaProyectos.current_id_proyecto,
        buscar: state.listaProyectos.buscar,
        fltrNtf: state.listaProyectos.fltrNtf,
        listaRef: state.listaProyectos.listaRef
    }
};

/**
 * Se utilizan los Action Creators para Cargar proyecto, seleccionar proyecto y para el cambio de página
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => bindActionCreators({
    listaProyectos,
    seleccionarProyecto,
    editarProyecto,
    guardarProyecto,
    desseleccionarProyecto,
    listaUsuarios,
    buscarTexto,
    guardaRefs,
    changePage: (page, id) => push(`${page}/${id}`)
}, dispatch)

const styles = {
    listWrap: {
        display: 'flex', 
        flexWrap: 'wrap',
        maxHeight: '800px',
        overflowY: 'auto'
    },
    listWrapCol: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap:'wrap',
        maxHeight: '100%'
    },    
    project: {
        backgroundColor: '#FFF',
        margin: '15px',
        padding: '5px',
        paddingBottom: '0px',
        minWidth: '180px',
        maxWidth: '250px',
        borderRadius: '3px',
        cursor: 'pointer'     
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Proyectos)