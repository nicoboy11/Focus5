import React, { Component } from 'react';
import { Card, Modal, FormRow, Input, Avatar } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editarPerfil } from '../actions';

class Ajustes extends Component{
    constructor(props){
        super(props);
        this.state = {
            mostrarModalPerfil: false
        }
    }

    componentWillMount(){
    }

    componentWillReceiveProps(nextProps){
    }

    render(){
        const tmp_perfil = this.props.perfil.tmp_perfil;
        return(
            <div id="mainProyectos" style={{display:'flex'}}>
                <Card 
                    titulo="Editar Perfil"
                    icono="person"
                    onClick={() => this.setState({ mostrarModalPerfil: true })}
                />
                <Card 
                    titulo="Cambiar Contraseña"
                    icono="lock"
                />       
                <Modal 
                    type='FORM' 
                    isVisible={this.state.mostrarModalPerfil} 
                    titulo='Editar Perfil'
                    loading={this.props.loading}
                    componenteInicial="txt_usuario"
                    onGuardar={() => { }}
                    onCerrar={() => { this.setState({ mostrarModalPerfil: false }) }}
                    >
                        <FormRow titulo='IMAGEN DE PERFIL'>                            
                                <Avatar 
                                    avatar="12.jpg"
                                    size="big"
                                />                        
                        </FormRow>                        
                        <FormRow titulo='NOMBRE'>                            
                                <Input 
                                    type="TEXT"
                                    placeholder='Nombre' 
                                    value={tmp_perfil.nombre}
                                    onChangeText={
                                        (value,error) => {
                                            this.props.editarPerfil({ prop: 'nombre', value, tmp_perfil });
                                        }
                                    }
                                />                              
                        </FormRow>    
                        <FormRow titulo='APELLIDOS'>                            
                                <Input 
                                    type="TEXT"
                                    placeholder='Apellidos' 
                                    value={tmp_perfil.apellidos}
                                    onChangeText={
                                        (value,error) => {
                                            this.props.editarPerfil({ prop: 'apellidos', value, tmp_perfil });
                                        }
                                    }
                                />                              
                        </FormRow>                                              
                        <FormRow titulo='NOMBRE CORTO'>
                            <Input 
                                type="EXTENDEDTEXT"
                                autoFocus={true}
                                placeholder='Nombre corto para desplegar en los chats' 
                                value={tmp_perfil.txt_usuario}
                                onChangeText={
                                    value => this.props.editarPerfil({ 
                                                prop: 'txt_usuario', 
                                                value, 
                                                tmp_perfil
                                            })
                                }
                            />  
                        </FormRow>
                        <FormRow titulo='EMAIL'>                            
                            <Input 
                                type="EMAIL"
                                placeholder='Email para inicio de sesión' 
                                value={tmp_perfil.txt_email}
                                replace={false}
                                onChangeText={
                                    (value,error) => {
                                        this.props.editarPerfil({ prop: 'txt_email', value, tmp_perfil });
                                    }
                                }
                            />                              
                        </FormRow>    
                        <FormRow titulo='TELEFONO'>                            
                            <Input 
                                type="NUMBER"
                                placeholder='Teléfono ó celular' 
                                value={tmp_perfil.txt_tel}
                                replace={false}
                                onChangeText={
                                    (value,error) => {
                                        this.props.editarPerfil({ prop: 'txt_tel', value, tmp_perfil });
                                    }
                                }
                            />                              
                        </FormRow>                           
                </Modal>                   
            </div>
        );        
    }

}

const mapStateToProps = (state) => {
    return {
        perfil: state.perfil
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    editarPerfil
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Ajustes);