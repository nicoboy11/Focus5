import React, {Component} from 'react';
import {UserList, Modal, Input, Radio, FormRow} from './';
import {Config, Helper} from '../configuracion';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/es'
import 'react-datepicker/dist/react-datepicker.css';

class Proyecto extends Component{
    static defaultProps = {
        id_proyecto: 0,
        txt_proyecto: 'Nuevo Proyecto',
        fec_inicio: '',
        fec_fin: '',
        participantes: [],
        tareas: []
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
        this.obtenerTotales()        
    }

    onMenuClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ modalVisible: true });
    }

    onClick(e){
        window.location = 'proyectos/' + this.props.id_proyecto;
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

    render(){

        const { 
            id_proyecto,
            txt_proyecto,
            fec_inicio,
            fec_fin,
            id_status,
            participantes,
            tareas
        } = this.props;

        const promedio = (this.state.terminadas/this.state.totalTareas)*100;

        if(id_status === 1 || id_status === 3){
            return( <div onClick={(e) => this.onClick(e) } data-id={id_proyecto} className="project w3-card w3-col">
                        <div className="projectTop">                     
                            <div className="cardTitle">{txt_proyecto}</div>   
                            {this.renderNotificaciones()}                                    
                            <i onClick={(e) => this.onMenuClick(e)} className="material-icons fadeColor">more_vert</i> 
                        </div> 
                        <div className="fadeColor fNormal">{Helper.prettyfyDate(fec_inicio).date} - {Helper.prettyfyDate(fec_fin).date}</div>
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
                            titulo={txt_proyecto}
                            onGuardar={() => {}}
                            onCerrar={() => {}}
                        >
                            <FormRow titulo='NOMBRE'>
                                <Input placeholder='Nombre del proyecto' value={this.state.txt_proyecto}/>  
                            </FormRow>
                            <FormRow titulo='DURACIÓN'>
                                <div style={{display:'flex', flexDirection: 'row', alignItems:'center'}}>
                                    <span className="txtSpan">De </span>
                                    <DatePicker 
                                        selected={this.state.startDate}
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        selectsStart
                                        onChange={(date) => {this.setState({startDate:date})}}
                                        locale="es"
                                        className="dateStyle"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        todayButton="Hoy"
                                    />    
                                    <span className="txtSpan">a</span>    
                                    <DatePicker 
                                        selected={this.state.endDate}
                                        selectsEnd
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        onChange={(date) => {this.setState({endDate:date})}}
                                        locale="es"
                                        className="dateStyle"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        todayButton="Hoy"
                                    />
                                </div>
                                <div style={{marginTop: '15px'}}>
                                    <Radio label="Abierta" id="rdbAbierta" /> 
                                </div>                                 
                            </FormRow>
                            <FormRow titulo='ESTADO'>
                                <Radio label="Activo" id="rdbActivo" /> 
                            </FormRow>
                        </ Modal>                          
                    </div>);
        }

        return <div />;

    }

}

export {Proyecto}