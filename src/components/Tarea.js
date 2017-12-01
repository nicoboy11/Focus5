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

    render(){
        const { participantes, txt_tarea, fec_limite, txt_proyecto } = this.props;

        return(<div data-id={this.props.id_tarea} onClick={this.onClick.bind(this)} className="tareaCard divideBottom">
                    <div className="c100 p50 tiny blue">
                        <span>50%</span>
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
                <div className="taskBottom chatContentBottom">
                    <UserList participantes={participantes} limit={3} />
                    <div className="taskFechaLimite chatContentDatetime" style={{ color: Helper.prettyfyDate(fec_limite).color }}>{Helper.prettyfyDate(fec_limite).date}</div>
                </div>
            </div>);
    }

}

export {Tarea};