import React, { Component } from 'react';
import { Helper } from '../configuracion';

class ChatItem extends Component {
    renderMessage(){
        const { 
            id_current_user, 
            id_usuario, 
            txt_comentario, 
            id_tipo_comentario, 
            fec_comentario
        } = this.props;

        if(id_tipo_comentario == 2 ) {
            return (
                <div className="bitacora">{txt_comentario}</div>
            );
        }

        if(id_current_user === id_usuario){
            return (
                    <div className="chatMessage">
                        <div className="messageSelf">
                            <div>
                                {txt_comentario}
                            </div>
                            <div>
                                <div className="messageTimeSelf">{Helper.prettyfyDate(fec_comentario).date}</div>
                            </div>
                        </div>
                    </div>  
            );          
        }

        return  (
                <div className="chatMessage">
                    <div className="messageOther">
                        <div>
                            {txt_comentario}
                        </div>
                        <div>
                            <div className="messageTimeOther">{Helper.prettyfyDate(fec_comentario).date}</div>
                        </div>
                    </div>
                </div>            
        );
    }

    render(){
        return(
            <div data-id={this.props.id_tarea_unique}>
                {this.renderMessage()}
            </div>
        );
    }
}

export { ChatItem };