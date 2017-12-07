import React, {Component} from 'react';
import { Helper} from '../configuracion';

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
        this.obtenerTotales();
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
     * Se obtienen los totales de la prop tarea
     */
    obtenerTotales(){
        const totalTareas = this.props.tareas.length;
        let terminadas = 0;
        let notificaciones = 0;

        for(let tarea of this.props.tareas){
            if(tarea.id_status === 2 || tarea.id_status === 3){
                terminadas ++;
            }

            notificaciones += tarea.notificaciones;
        }

        this.setState({ terminadas, totalTareas, notificaciones })
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
            id_status
            //participantes,
            //tareas
        } = this.props;

        const promedio = (this.state.terminadas/this.state.totalTareas)*100;

        if(id_status === 1 || id_status === 3){
            return( <div onClick={(e) => this.onClick(e) } data-id={id_proyecto} style={styles.project} className="w3-card w3-col">
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
        borderRadius: '3px',
        cursor: 'pointer'     
    }
}

export default (Proyecto);