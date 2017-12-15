import React, { Component } from 'react';
import { Input, Modal } from '../components'
import { emailChanged, passwordChanged, loginUser, cargarPerfil } from '../actions'
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Login extends Component{

    state = {
        mostrarModal: false
    }

    componentWillMount(){
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.error !== '' && this.state.mostrarModal === false){
            this.setState({ mostrarModal: true });
        }        

        if(nextProps.sessionData !== null && window.location.pathname === "/"){
            this.props.cargarPerfil(nextProps.sessionData);
            this.props.loginSuccess();
        }
    }

    render(){
        return(
            <div id="mainLogin" style={{display:'block', backgroundColor: 'white', position:'fixed', top:'0px', left: '0px', width:'100%', height: '100%', zIndex: '9999'}}>
                <Input 
                    value={this.props.email}
                    onChangeText={(value) => {
                        this.props.emailChanged(value);
                    }}
                />
                <Input 
                    value={this.props.password}
                    type="PASSWORD" 
                    onChangeText={(value) => {
                        this.props.passwordChanged(value);
                    }}                    
                />
                <button 
                    onClick={() => this.props.loginUser(this.props.email, this.props.password) }
                >
                    LogIn
                </button>
                <Modal 
                    type="MENSAJE"
                    titulo="Error de inicio de sesión"
                    mensaje={this.props.error} 
                    onCerrar={() => this.setState({ mostrarModal: false })}
                    isVisible={this.state.mostrarModal}
                />
            </div>
        );        
    }

}

const mapStateToProps = state => {
    return {
        email: state.login.email,
        password: state.login.password,
        error: state.login.error,
        sessionData: state.login.sessionData
    }
};

/**
 * Se utilizan los Action Creators para Cargar proyecto, seleccionar proyecto y para el cambio de página
 * @param {*} dispatch 
 */
const mapDispatchToProps = dispatch => bindActionCreators({
    emailChanged,
    passwordChanged,
    loginUser,
    cargarPerfil,
    loginSuccess: () => push('proyectos')
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)