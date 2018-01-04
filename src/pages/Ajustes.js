import React, { Component } from 'react';
import { Card, Modal, FormRow, Input, Avatar } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { editarPerfil, guardarPerfil, cargarPerfil } from '../actions';

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
        if(this.props.perfil.tmp_perfil.id_usuario === undefined && this.state.mostrarModalPerfil === true) {
            this.setState({ mostrarModalPerfil: false });
            this.props.cargarPerfil();
        }
        const tmp_perfil = this.props.perfil.tmp_perfil;
        const sessionData = JSON.parse(localStorage.sessionData)

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
                    loading={this.props.loadingPerfil}
                    componenteInicial="txt_usuario"
                    onGuardar={() => { this.props.guardarPerfil(tmp_perfil); }}
                    onCerrar={() => { this.setState({ mostrarModalPerfil: false }) }}
                    >
                        <FormRow titulo='IMAGEN DE PERFIL'>                            
                                <Avatar 
                                    avatar={sessionData.sn_imagen===1?`${sessionData.id_usuario}.jpg`:sessionData.txt_abbr}
                                    size="big"
                                    color={sessionData.color}
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
                                value={tmp_perfil.tel}
                                replace={false}
                                onChangeText={
                                    (value,error) => {
                                        this.props.editarPerfil({ prop: 'tel', value, tmp_perfil });
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
        perfil: state.perfil,
        loadingPerfil: state.perfil.loading
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    editarPerfil,
    guardarPerfil,
    cargarPerfil
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Ajustes);