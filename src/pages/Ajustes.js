import React, { Component } from 'react';
import { Card, Modal, FormRow, Input, Avatar, ImagePicker } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    editarPerfil, 
    guardarPerfil, 
    cargarPerfil, 
    editarArchivo, 
    cancelarArchivo, 
    cambioPassword, 
    loginUser, 
    guardarPassword 
} from '../actions';
import swal from 'sweetalert';
import { Config } from '../configuracion';

const { network } = Config;

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

    onGuardar(tmp_perfil){
        const perfil = {
            ...tmp_perfil,
            imagen: this.props.archivo.file
        };

        this.props.guardarPerfil(perfil);
    }   

    onGuardarPassword(){
        const sessionData = JSON.parse(localStorage.sessionData)

        //Confirmar contraseña
        if(this.props.psw.password_nuevo !== this.props.psw.password_confirmacion){
            swal('Aviso','La nueva contraseña no coincide con la confirmación', 'warning');
            return;
        }

        //Checar contraseña actual con callback
        this.props.loginUser(sessionData.txt_email, this.props.psw.password_actual, (success) => {
            if(success){
                this.props.guardarPassword(sessionData.id_usuario, this.props.psw.password_nuevo, (success) => {
                    if(success){
                        swal('Guardado', 'La contraseña fué actualizada con éxito', 'success');
                    } else {
                        swal('Aviso', 'No fué posible actualizar la contraseña', 'warning');
                    }

                    this.setState({ mostrarModalPass: false });
                });
                return;
            } else {
                swal('Aviso', 'La contraseña es incorrecta', 'warning');
            }
        });

        //Cerrar Modal
    }

    renderModalPerfil(sessionData){
        const tmp_perfil = this.props.perfil.tmp_perfil;
        let image = "";
        
        if(this.props.archivo.url === ''){
            image = sessionData.sn_imagen===1?
                        `${network.server}usr/thumbs/small/${sessionData.id_usuario}.jpg?v=${new Date().getTime()}`:
                        sessionData.txt_abbr
        } else {
            image = this.props.archivo.url;
        }

        return(
            <Modal 
                type='FORM' 
                isVisible={this.state.mostrarModalPerfil} 
                titulo='Editar Perfil'
                loading={this.props.loadingPerfil}
                componenteInicial="txt_usuario"
                onGuardar={() => { this.onGuardar(tmp_perfil) }}
                onCerrar={() => { this.setState({ mostrarModalPerfil: false }) }}
                >
                    <FormRow titulo='IMAGEN DE PERFIL' style={{ alignItems: 'center' }}>                            
                            <Avatar 
                                avatar={image}
                                size="huge"
                                color={sessionData.color}
                            />  
                            <ImagePicker 
                                archivo={this.props.archivo}
                                fileChange={(file, event) => this.props.editarArchivo(file, event)}
                                endCrop={() => {  }}
                                cancelCrop={() => { this.props.cancelarArchivo() }}
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
        )
    }

    renderModalPassword(){
        return(
            <Modal 
                type='FORM' 
                isVisible={this.state.mostrarModalPass} 
                titulo='Cambiar password'
                componenteInicial="txt_usuario"
                onGuardar={() => { this.onGuardarPassword() }}
                onCerrar={() => { this.setState({ mostrarModalPass: false }) }}
            >
                <FormRow titulo='CONTRASEÑA ACTUAL'>                            
                    <Input 
                        type="PASSWORD"
                        placeholder='Contraseña actual' 
                        value={this.props.psw.password_actual}
                        replace={false}
                        onChangeText={
                            (value,error) => {
                                this.props.cambioPassword({ prop: 'password_actual', value });
                            }
                        }
                    />                              
                </FormRow>    
                <FormRow titulo='NUEVA CONTRASEÑA'>                            
                    <Input 
                        type="PASSWORD"
                        placeholder='Nueva contraseña' 
                        value={this.props.psw.password_nuevo}
                        replace={false}
                        onChangeText={
                            (value,error) => {
                                this.props.cambioPassword({ prop: 'password_nuevo', value });
                            }
                        }
                    />                              
                </FormRow>   
                <FormRow titulo='CONFIRMAR CONTRASEÑA'>                            
                    <Input 
                        type="PASSWORD"
                        placeholder='Confirmar contraseña' 
                        value={this.props.psw.password_confirmacion}
                        replace={false}
                        onChangeText={
                            (value,error) => {
                                this.props.cambioPassword({ prop: 'password_confirmacion', value });
                            }
                        }
                    />                              
                </FormRow>                                   
            </Modal>  
        )
      
    }

    render(){

        if(this.props.perfil.error){
            swal(":(", "No fué posible guardar, intente más tarde", "error");
        }

        if(this.props.perfil.tmp_perfil.id_usuario === undefined && this.state.mostrarModalPerfil === true) {
            this.setState({ mostrarModalPerfil: false });
            this.props.cargarPerfil();
        }

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
                    onClick={() => this.setState({ mostrarModalPass: true })}
                />       
                {this.renderModalPerfil(sessionData)} 
                {this.renderModalPassword()}                  
            </div>
        );        
    }

}

const mapStateToProps = (state) => {
    return {
        perfil: state.perfil,
        loadingPerfil: state.perfil.loading,
        fileProgress: state.listaProyectos.progress,
        loading: state.listaProyectos.loading,
        archivo: state.listaProyectos.archivoNuevo,
        psw: state.password
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    editarPerfil,
    guardarPerfil,
    cargarPerfil,
    editarArchivo,
    cancelarArchivo,
    cambioPassword,
    loginUser,
    guardarPassword
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Ajustes);