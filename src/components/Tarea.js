import React, { Component } from 'react';
import {UserList} from './';
import { Helper, Config } from '../configuracion';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/es'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Tarea extends Component{

    componentWillMount(){
        console.log('entró');
    }

    /**
     * Verificar si es necesario redibujar la tarea
     */
    shouldComponentUpdate(nextProps, nextState){
        const tareaActual = nextProps.tareas.filter(tarea => tarea.id_tarea === this.props.id_tarea)[0];

        for(const prop of Object.keys(this.props)) {
            if(tareaActual[prop] !== undefined) {
                if(tareaActual[prop] !== this.props[prop]){
                    return true;
                }
            }
        }

        if(nextProps.typing !== this.props.typing){
            return true;
        }

        if(nextProps.loadingTarea !== this.props.loadingTarea){
            return true;
        }        

        return false;
    }

    /**
     * Cuando se aplana el boton de menu se regresa el evento al padre
     * @param {*} e 
     */
    onMenuClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.onMenuOpen(e);
    }    

    onClick() {
        this.props.onClick(this.props.id_tarea);
    }

    renderNotificaciones(){
        if(this.props.notificaciones > 0){
            return(
                <div className="badge">{this.props.notificaciones}</div>
            )
        }

        return null;
    }
    renderStatus(status){
        if(status == 2){
            return <i title="Terminada" className="material-icons clickableColor" style={{position:'absolute', right: '10px'}}>done_all</i>;
        } 

        if(status == 3){
            return <i title="Atendida" className="material-icons clickableColor" style={{position:'absolute', right: '10px'}}>done</i>;
        }

        return null;
    }

    renderLoading() {
        if((this.props.loading || this.props.loadingTarea) === true && this.props.tareaSeleccionada.id_tarea === this.props.id_tarea){
            return <img style={{width: '24px', height: '24px'}} src={`${Config.network.server}/img/Spinner.gif`} />
        }

        return null;
    }

    renderCalendar() {
        if(this.props.isCalendarSync){
            return <img style={{ width: '24px', height: '24px', margin: '0px', marginLeft: '5px', marginRight: '5px' }} src={`${Config.network.server}/img/calendaricon.png`} />
        }
    }

    renderSubtareaResumen(){
        if(this.props.subtareas.length > 0){

            let terminadas = 0;
            for(let subtarea of this.props.subtareas){
                if(subtarea.id_status == 2){
                    terminadas++;
                }
            }

            return (
                <div 
                    className='fadeColor'
                    style={{
                        margin: '0px', 
                        marginLeft: '5px', 
                        marginRight: '5px', 
                        display:'flex', 
                        alignItems: 'center',
                        fontSize: '14px'
                    }}>
                        <i title="Subtareas" style={{ fontSize: '16px' }} className="material-icons fadeColor">check_box</i>{`(${terminadas}/${this.props.subtareas.length})`}</div>
            );
        }
    }

    render(){
        const tareaActual = this.props.tareas.filter(tarea => tarea.id_tarea === this.props.id_tarea)[0];
        
        const { participantes, txt_tarea, txt_proyecto, avance, selected, typing } = this.props;

        const fec_limite = (tareaActual)?tareaActual.fec_limite:this.props.fec_limite;
        const fec_limiteCal = (tareaActual)?tareaActual.fec_limiteCal:this.props.fec_limiteCal;
        const isCalendarSync = (tareaActual)?tareaActual.isCalendarSync:this.props.isCalendarSync;
        const id_status = (tareaActual)?tareaActual.id_status:this.props.id_status;

        const opacidad = (id_status===2)?{ opacity: '0.4'}:{};
        const selectedStyle = (selected)?styles.selectedStyle:{};
        let nuevoStyle = {};
        if(this.props.nuevo) {
            nuevoStyle = {
                backgroundColor: '#FFFDCC',
                border: '1px solid lightgray'
            };
        }

        return(<div data-id={this.props.id_tarea} onClick={this.onClick.bind(this)} style={{ ...opacidad,...selectedStyle, ...nuevoStyle }} className="tareaCard divideBottom">
                    <div className={`c100 p${avance} tiny blue`}>
                        <span>{avance}%</span>
                        <div className="slice">
                            <div className="bar"></div>
                            <div className="fill"></div>
                        </div>
                    </div>
                    <div className="chatItemContent">
                        <div className="chatContentTop">
                            <div className="chatContentTitle" title={Helper.htmlDecode(Helper.decode_utf8(txt_tarea))}>{Helper.htmlDecode(Helper.decode_utf8(txt_tarea))}</div>
                            {this.renderCalendar()}
                            {this.renderNotificaciones()}
                            {this.renderLoading()}
                            {this.renderSubtareaResumen()}
                            <i onClick={(e) => this.onMenuClick(e)} className="material-icons fadeColor">more_vert</i>
                        </div>
                        <div className="chatContentBottom">
                            <div className="chatContentStatus fadeColor">
                                {txt_proyecto}
                            </div>
                        </div>
                    </div>
                    {this.renderStatus(id_status)}                    
                <div className="taskBottom chatContentBottom">
                    <UserList participantes={participantes} limit={3} />
                    <div style={styles.typingStyle}>{typing}</div>
                    <DatePicker
                        customInput={<ButtonDate color={Helper.prettyfyDate(fec_limite).color} date={Helper.prettyfyDate(fec_limite).date} />}
                        selected={Helper.toDateM(fec_limite)}
                        onChange={
                                (date) => {

                                    let fec_limiteCalEdit = Helper.toDateM(fec_limiteCal);
                                    let format = 'YYYY-MM-DD';

                                    if(isCalendarSync){
                                        const diff = date.clone().startOf('day').diff(fec_limiteCalEdit.clone().startOf('day'),'days');
                                        format = 'YYYY-MM-DD HH:mm';
                                        fec_limiteCalEdit = fec_limiteCalEdit.add(diff,'days').format(format);
                                    }


                                    this.props.editarTarea([
                                        { 
                                            prop: 'fec_limite', 
                                            value:date.format(format)
                                        },
                                        {
                                            prop: 'fec_limiteCal',
                                            value: fec_limiteCalEdit
                                        }
                                    ])
                                }
                            }
                        popperPlacement='left-start'
                        locale="es"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        todayButton="Hoy"                        
                    />
                </div>
            </div>);
    }

}

class ButtonDate extends React.Component {
    static defaultProps = {
        onClick: () => {},
        value: 'Sin fecha',
        date: null,
        color: '#CCC'
    }    

      render () {
        return (
            <div 
                onClick={this.props.onClick}
                className="taskFechaLimite chatContentDatetime" 
                style={{ color: this.props.color }}
            >
                {this.props.date}
            </div>
          
        )
      }
    }
    

const styles = {
    selectedStyle: {
        opacity: '1',
        borderLeft: "5px solid #1ABC9C",
        backgroundColor: "#F6F6F6"
    },
    typingStyle: {
        fontSize: '12px',
        color: '#1ABC9C',
        display: 'flex',
        flex: '1'
    }
}

const mapStateToProps = state => {
    const proyecto = state.listaProyectos.proyectos.filter(proyecto => proyecto.id_proyecto === state.listaProyectos.tmpProyecto.id_proyecto);
    const tareas = proyecto[0]?proyecto[0].tareas:[];
    
    return {
        tareas,
        loading: state.listaProyectos.loadingTarea,
        tareaSeleccionada: state.listaProyectos.tareaActual
    }
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Tarea)
