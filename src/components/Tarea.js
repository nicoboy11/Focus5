import React, { Component } from 'react';
import {UserList} from './';
import { Helper } from '../configuracion';

class Tarea extends Component{

    componentWillMount(){
        console.log('entró');
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
    render(){
        const { participantes, txt_tarea, fec_limite, txt_proyecto, avance, selected, typing, status } = this.props;

        return(<div data-id={this.props.id_tarea} onClick={this.onClick.bind(this)} style={(selected)?styles.selectedStyle:null} className="tareaCard divideBottom">
                    <div className={`c100 p${avance} tiny blue`}>
                        <span>{avance}%</span>
                        <div className="slice">
                            <div className="bar"></div>
                            <div className="fill"></div>
                        </div>
                    </div>
                    <div className="chatItemContent">
                        <div className="chatContentTop">
                            <div className="chatContentTitle" title={Helper.decode_utf8(txt_tarea)}>{Helper.decode_utf8(txt_tarea)}</div>
                            {this.renderNotificaciones()}
                            <i onClick={(e) => this.onMenuClick(e)} className="material-icons fadeColor">more_vert</i>
                        </div>
                        <div className="chatContentBottom">
                            <div className="chatContentStatus fadeColor">
                                {txt_proyecto}
                            </div>
                        </div>
                    </div>
                    {this.renderStatus(status)}                    
                <div className="taskBottom chatContentBottom">
                    <UserList participantes={participantes} limit={3} />
                    <div style={styles.typingStyle}>{typing}</div>
                    <div className="taskFechaLimite chatContentDatetime" style={{ color: Helper.prettyfyDate(fec_limite).color }}>{Helper.prettyfyDate(fec_limite).date}</div>
                </div>
            </div>);
    }

}

const styles = {
    selectedStyle: {
        borderLeft: "5px solid #1ABC9C",
        backgroundColor: "#F6F6F6"
    },
    typingStyle: {
        fontSize: '12px',
        color: '#1ABC9C'
    }
}

export {Tarea};