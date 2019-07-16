import React, { Component } from 'react';
import { Input, Modal } from '../components'
import { emailChanged, passwordChanged, loginUser, cargarPerfil, loginLocalStorage } from '../actions'
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import { Config } from '../configuracion';

import '../css/loginStyles.css';

const { network } = Config;

class Login extends Component{

    state = {
        mostrarModal: false
    }


    componentWillMount(){
        if(localStorage.sessionData !== undefined){
            this.props.loginLocalStorage(JSON.parse(localStorage.sessionData));
        }
    }

    render(){
        return(
            <div className="limiter">
                <div className="container-login100" style={{ backgroundImage: `url('${Config.network.server}/img/img-01.jpg')` }}>
                    <div className="wrap-login100 p-t-150 p-b-30">
                        <div className="login100-form validate-form">
                            <span className="login100-form-title p-t-20 p-b-45">
                                Focus
                            </span>

                            <div className="wrap-input100 validate-input m-b-10" data-validate = "Username is required">
                                <input 
                                    className="input100" 
                                    type="text" 
                                    name="username" 
                                    placeholder="Email" 
                                    value={this.props.email}
                                    onChange={(value) => {
                                        this.props.emailChanged(value.target.value);
                                    }}
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="material-icons" style={{ fontSize: '18px' }}>person</i>
                                </span>
                            </div>

                            <div className="wrap-input100 validate-input m-b-10" data-validate = "Password is required">
                                <input 
                                    className="input100" 
                                    type="password" 
                                    name="pass"
                                    placeholder="Contraseña" 
                                    value={this.props.password}
                                    onChange={(value) => {
                                        this.props.passwordChanged(value.target.value);
                                    }}    
                                />
                                <span className="focus-input100"></span>
                                <span className="symbol-input100">
                                    <i className="material-icons" style={{ fontSize: '18px' }}>lock</i>
                                </span>
                            </div>

                            <div className="container-login100-form-btn p-t-10">
                                <button 
                                    onClick={() => {
                                        this.props.loginUser(this.props.email, this.props.password, (success, sessionData) => {
                                            if(success) {
                                                this.props.cargarPerfil(sessionData);
                                                this.props.loginSuccess();
                                            }
                                            else {
                                                swal("Alerta", "Error de inicio de sesión", "error");
                                            }
                                        })
                                    }}
                                    className="login100-form-btn"
                                >
                                    Entrar
                                </button>
                            </div>

                            <div className="text-center w-full p-t-25 p-b-180">
                                <a href="#" className="txt1">
                                    Olvidó contraseña?
                                </a>
                            </div>

                            <div className="text-center w-full">
                                <a className="txt1" href="#">
                                    Solicitar nueva cuenta		
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
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
    loginLocalStorage,
    loginSuccess: () => push('proyectos')
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)