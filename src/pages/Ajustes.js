import React, { Component } from 'react';
import { Card, Modal, FormRow, Input } from '../components';

class Ajustes extends Component{

    componentWillMount(){
    }

    componentWillReceiveProps(nextProps){
    }

    render(){
        return(
            <div id="mainProyectos" style={{display:'flex'}}>
                <Card 
                    titulo="Editar Perfil"
                    icono="person"
                />
                <Card 
                    titulo="Cambiar Contraseña"
                    icono="lock"
                />       
                <Modal 
                    type='FORM' 
                    isVisible={this.state.mostrarModal} 
                    titulo='Editar Perfil'
                    loading={this.props.loading}
                    componenteInicial="txt_usuario"
                    onGuardar={() => { }}
                    onCerrar={() => { }}
                    >
                        <FormRow titulo='NOMBRE CORTO'>
                            <Input 
                                type="EXTENDEDTEXT"
                                autoFocus={true}
                                placeholder='Nombre corto para desplegar en los chats' 
                                value={txt_usuario}
                                onChangeText={
                                    value => this.props.actualizarUsuario({ 
                                                prop: 'txt_usuario', 
                                                value, 
                                                tmp_usuario
                                            })
                                }
                            />  
                        </FormRow>      
                </Modal>                   
            </div>
        );        
    }

}

export { Ajustes };