import React, {Component} from 'react';
import { Helper, Config} from '../configuracion';
import { Avatar } from './';

const { network } = Config;

class Proyecto extends Component{
    static defaultProps = {
        id_proyecto: null,
        txt_proyecto: '',
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
            modalVisible: false
        }
    }

    /**
     * Al cargar sacar los totales de las tareas
     */
    componentWillMount(){
        this.obtenerTotales(this.props);
    }

    componentWillReceiveProps(nextProps){
        if(JSON.stringify(nextProps) !== JSON.stringify(this.props)){
            this.obtenerTotales(nextProps);
        }
    }

    /**
     * Cuando se aplana el boton de menu se regresa el evento al padre
     * @param {*} e 
     */
    onMenuClick(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.onMenuOpen();
    }

    /**
     * Cuando se da click en el proyecto se regresa el evento al padre
     * @param {*} e 
     */
    onClick(e){
        this.props.onProyectoSelect();
    }

    /**
     * Se obtienen los totales de la prop tarea y también si hay tareas vencidas
     */
    obtenerTotales(props){
        const totalTareas = props.total;
        let terminadas = props.terminadas;
        let notificaciones = 0;
        let vencidas = false;

        for(let tarea of props.tareas){
            notificaciones += tarea.notificaciones;
            
            if(Helper.prettyfyDate(tarea.fec_limite).vencida && tarea.id_status !== 2){
                vencidas = true;
            }
        }

        this.setState({ terminadas, totalTareas, notificaciones, vencidas })
    }    

    /**
     * Mostrar indicador si hay tareas vencidas
     */
    renderVencidas(){
        if(this.state.vencidas > 0){
            return (
                <i className="material-icons" style={{ fontSize:'22px', color: '#e74c3c' }}>error_outline</i>
            )
        }
    }

    /**
     * Mostrar las notificaciones
     */
    renderNotificaciones(){
        if(this.state.notificaciones > 0){
            return(
                <div className="badge">{this.state.notificaciones}</div>
            )
        }

        return null;
    }    

    /**
     * Para mostrar ó no el boton de menú
     */
    renderMenu(){
        if(this.props.modificable){
            return <i onClick={(e) => this.onMenuClick(e)} className="material-icons fadeColor">more_vert</i> 
        }

        return null;
    }

    /**
     * Renderizar el proyecto
     */
    render(){
        const { 
            id_proyecto,
            txt_proyecto,
            fec_inicio,
            fec_limite,
            id_status,
            typing
            //participantes,
            //tareas
        } = this.props;
        
        const promedio = Math.floor((this.state.terminadas/this.state.totalTareas)*100);
        let nuevoStyle = {};
        if(this.props.nuevo) {
            nuevoStyle = {
                backgroundColor: '#FFFDCC',
                border: '1px solid lightgray'
            };
        }

        const imagen = this.props.typing.sn_imagen===1?
            `${network.server}usr/thumbs/small/${this.props.typing.id_usuario}.jpg?v=${new Date().getTime()}`:
            this.props.typing.txt_abbr

        if(id_status === 1 || id_status === 3){
            return( <div onClick={(e) => this.onClick(e) } data-id={id_proyecto} style={{ ...styles.project, ...nuevoStyle }} className="w3-card w3-col">
                        <div className="projectTop">                     
                            <div className="cardTitle">{txt_proyecto}</div>   
                            {this.renderVencidas()}
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
                        
                            {(typing.mensaje !== "" && typing.mensaje !== undefined) ?
                            <div className="projectBottom divideTop">
                                <Avatar 
                                    avatar={imagen}
                                    size="small"
                                    color={this.props.typing.color}
                                />                             
                                <div style={styles.typingStyle}>{typing.mensaje}</div>
                            </div>
                            : null     
                        }

                               
                    </div>);
        }

        return <div />;

    }

}

const styles = {
    project: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFF',
        margin: '15px',
        padding: '5px',
        paddingBottom: '0px',
        minWidth: '180px',
        maxWidth: '250px',
        minHeight: '183px',
        borderRadius: '3px',
        cursor: 'pointer'     
    },
    typingStyle: {
        fontSize: '12px',
        color: '#1ABC9C',
        display: 'flex',
        flex: '1',
        marginLeft: '5px'
    }
}

export default (Proyecto);