import React, {Component} from 'react';
import { Modal, Input, Radio, FormRow} from './';
import { Helper} from '../configuracion';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/es'
import 'react-datepicker/dist/react-datepicker.css';

import { connect } from 'react-redux';
import { proyect_update, proyect_save, updateProyectos } from '../actions';

class Proyecto extends Component{
    static defaultProps = {
        id_proyecto: 0,
        txt_proyecto: 'Nuevo Proyecto',
        fec_inicio: '',
        fec_limite: '',
        participantes: [],
        tareas: [],
        modificable: false
    }

    constructor(props){
        super(props);
        this.state = {
            ...props,
            modalVisible: false,
            startDate: moment(),
            endDate: moment(new Date()).add(1,'days')
        }
    }

    componentWillMount(){
        this.obtenerTotales();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.guardando && nextProps.proyectoEdit !== undefined && nextProps.id_proyecto === nextProps.proyectoEdit.id_proyecto) {
            this.setState({ modalVisible: false });
            this.props.proyect_update({ prop: 'guardando', value: false });
            this.props.onEdited(nextProps.proyectoEdit);
        }
    }

    onMenuClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.proyect_update({ prop: 'txt_proyecto_text', value: this.props.txt_proyecto });
        this.props.proyect_update({ prop: 'fec_inicio_text', value: this.props.fec_inicio });
        this.props.proyect_update({ prop: 'fec_fin_text', value: this.props.fec_limite });
        this.props.proyect_update({ prop: 'id_status_text', value: this.props.id_status });
        
        if(Helper.toDateM(this.props.fec_fin) !== null){
            this.props.proyect_update({ prop: 'fec_abierta', value: false });
        } else {
            this.props.proyect_update({ prop: 'fec_abierta', value: true });
        }

        this.setState({ modalVisible: true });
    }

    onClick(e){
        this.props.onProyectoSelect();
    }

    onGuardar(){
        const { id_proyecto, txt_proyecto_text, fec_inicio_text, fec_fin_text, id_status_text } = this.props;
        this.props.proyect_update({ prop: 'guardando', value: true });
        this.props.proyect_save({ 
            id_proyecto, 
            txt_proyecto: txt_proyecto_text, 
            fec_inicio: fec_inicio_text, 
            fec_limite: fec_fin_text, 
            id_status:id_status_text,
            id_usuario: 12
        });
        
    }

    onChangeFecAbierta(value){
        this.props.proyect_update({ prop: 'fec_abierta', value }); 
        
        if(value) {
            this.props.proyect_update({ prop: 'fec_fin_text', value: null });
            this.props.proyect_update({ prop: 'fec_fin_disabled', value: true });
        } else {
            this.props.proyect_update({ prop: 'fec_fin_disabled', value: false });
        }
    }

    obtenerTotales(){
        const datos = Helper.clrHtml(this.props.tareas);
        const tareas = this.props.tareas ? JSON.parse(datos) : [];
        const totalTareas = tareas.length;
        let terminadas = 0;
        let notificaciones = 0;

        for(let tarea of tareas){
            if(tarea.id_status === 2 || tarea.id_status === 3){
                terminadas ++;
            }

            notificaciones += tarea.notificaciones;
        }

        this.setState({ terminadas, totalTareas, notificaciones })
    }    

    renderNotificaciones(){
        if(this.state.notificaciones > 0){
            return(
                <div className="badge">{this.state.notificaciones}</div>
            )
        }

        return null;
    }    

    renderMenu(){
        if(this.props.modificable){
            return <i onClick={(e) => this.onMenuClick(e)} className="material-icons fadeColor">more_vert</i> 
        }

        return null;
    }

    render(){

        const { 
            id_proyecto,
            txt_proyecto,
            fec_inicio,
            fec_limite,
            id_status,
            txt_proyecto_text
            //participantes,
            //tareas
        } = this.props;

        const promedio = (this.state.terminadas/this.state.totalTareas)*100;

        if(id_status === 1 || id_status === 3){
            return( <div onClick={(e) => this.onClick(e) } data-id={id_proyecto} className="project w3-card w3-col">
                        <div className="projectTop">                     
                            <div className="cardTitle">{txt_proyecto}</div>   
                            {this.renderNotificaciones()}     
                            {this.renderMenu()}                               
                        </div> 
                        <div className="fadeColor fNormal">{Helper.prettyfyDate(fec_inicio).date} - {Helper.prettyfyDate(fec_limite).date}</div>
                        <div className="projectCenter">
                            <div className={"c100 p" + promedio + " small blue"}>
                                <span>{this.state.terminadas} / {this.state.totalTareas}</span>
                                <div className="slice">
                                    <div className="bar"></div>
                                    <div className="fill"></div>
                                </div>
                            </div>      
                        </div>   
                        <div className="projectBottom divideTop">
                            {/* <UserList participantes={participantes} limit={3} /> */}
                        </div>       
                        <Modal 
                            type='FORM' 
                            isVisible={this.state.modalVisible} 
                            titulo={txt_proyecto_text}
                            onGuardar={() => { this.onGuardar(); }}
                            onCerrar={() => { this.setState({ modalVisible: false }) }}
                        >
                            <FormRow titulo='NOMBRE'>
                                <Input 
                                    placeholder='Nombre del proyecto' 
                                    value={this.props.txt_proyecto_text}
                                    onChangeText={value => this.props.proyect_update({ prop: 'txt_proyecto_text', value })}
                                />  
                            </FormRow>
                            <FormRow titulo='DURACIÓN'>
                                <div style={{display:'flex', flexDirection: 'row', alignItems:'center'}}>
                                    <span className="txtSpan">De </span>
                                    <DatePicker 
                                        selected={Helper.toDateM(this.props.fec_inicio_text)}
                                        startDate={Helper.toDateM(this.props.fec_inicio_text)}
                                        endDate={Helper.toDateM(this.props.fec_fin_text)}
                                        selectsStart
                                        onChange={(date) => {this.props.proyect_update({ prop: 'fec_inicio_text', value:date.format('YYYY-MM-DD') })}}
                                        locale="es"
                                        className="dateStyle"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        todayButton="Hoy"
                                    />    
                                    <span className="txtSpan">a</span>    
                                    <DatePicker 
                                        selected={Helper.toDateM(this.props.fec_fin_text)}
                                        selectsEnd
                                        startDate={Helper.toDateM(this.props.fec_inicio_text)}
                                        endDate={Helper.toDateM(this.props.fec_fin_text)}
                                        disabled={this.props.fec_fin_disabled}
                                        onChange={(date) => {this.props.proyect_update({ prop: 'fec_fin_text', value:date.format('YYYY-MM-DD') })}}
                                        locale="es"
                                        className="dateStyle"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        todayButton="Hoy"
                                    />
                                </div>
                                <div style={{marginTop: '15px'}}>
                                    <Radio 
                                        label="Abierta" 
                                        id="rdbAbierta" 
                                        onChange={this.onChangeFecAbierta.bind(this)}
                                    /> 
                                </div>                                 
                            </FormRow>
                            <FormRow titulo='ESTADO'>
                                <Radio 
                                    label="Activo" 
                                    id="rdbActivo" 
                                    checked={(this.props.id_status_text !== 2)?true:false}
                                    onChange={(value) => { this.props.proyect_update({ prop: 'id_status_text', value: (value)?1:2 }); }}
                                /> 
                            </FormRow>
                        </ Modal>                          
                    </div>);
        }

        return <div />;

    }

}

const mapStateToProps = (state) => {
    const { 
        txt_proyecto_text, 
        fec_inicio_text, 
        fec_fin_text, 
        fec_abierta, 
        fec_fin_disabled, 
        id_status_text,
        guardando,
        proyectoEdit
    } = state.proyecto;

    return { 
        txt_proyecto_text, 
        fec_inicio_text, 
        fec_fin_text, 
        fec_abierta, 
        fec_fin_disabled, 
        id_status_text,
        guardando,
        proyectoEdit
    };
};

export default connect(mapStateToProps, { proyect_update, proyect_save, updateProyectos })(Proyecto);