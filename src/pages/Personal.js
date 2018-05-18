import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listaUsuarios, mostrarHijos, seleccionarUsuario, editaUsuario, guardarUsuario, buscarTexto } from '../actions';
import { Avatar, Segmented, Modal, FormRow, Radio, Input } from '../components';
import Select from 'react-select';
import swal from 'sweetalert';
import { Config } from '../configuracion';

const { network } = Config;

class Personal extends Component{
    state = {
        tipoLista: 0,
        verEdit: false,
        mostrarModal: false,
        mostrarInvitacion: false,
        emailInvitacion: ''
    }

    componentWillMount(){
        let sessionData = {};
        
        //Si no está logeado se manda a la pantalla de log in
        if(!localStorage.sessionData) {
            this.props.changePage("","");
            return;
        } else {
            sessionData = JSON.parse(localStorage.sessionData)
        }    

        this.props.listaUsuarios();
    }

    componentWillReceiveProps(nextProps){
    }

    renderChildren(usuarios,usuario,red){
        this.props.mostrarHijos(usuarios, usuario,red);
    }

    renderUsuarios(red){

        try {
            const sessionData = JSON.parse(localStorage.sessionData)         

            if(this.props.usuarios === undefined) {
                return null;
            }

            const isOpen = `isOpen${(red)?'Red':''}`;
            const isVisible = `isVisible${(red)?'Red':''}`;

            let usuarios = [];
            //solo usuarios de mi red
            if(red){
                usuarios = this.props.usuarios.usuarios.filter(usuario => usuario.levelKey.includes(sessionData.levelKey));
            } else {
                usuarios = this.props.usuarios.usuarios;
            }

            usuarios = usuarios.filter(usuario => usuario.txt_usuario.toLowerCase().includes(this.props.buscar) || usuario.txt_login.toLowerCase().includes(this.props.buscar) )

            return usuarios.map(usuario => {
                const image = usuario.sn_imagen==1?
                                `${network.server}usr/thumbs/small/${usuario.id_usuario}.jpg?v=${new Date().getTime().toString().substr(0,7)}`:
                                usuario.txt_abbr

                if(this.state.tipoLista === 0){
                    return (
                        <div 
                            key={usuario.id_usuario} 
                            className="userItem" 
                            style={{ display: 'flex', minWidth: '150px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', position: 'relative'}}
                            onMouseOver={() => this.setState({ verEdit: usuario.id_usuario })}
                            onMouseLeave={() => this.setState({ verEdit: null })}
                            onClick={(e) =>{ 
                                        e.preventDefault; 
                                        if(red){
                                            this.props.seleccionarUsuario(usuario);
                                            this.setState({ mostrarModal: true })
                                        }
                                    }}                                
                        >
                            <Avatar 
                                avatar={image}
                                size="veryBig"
                                color={usuario.color}
                            />
                            <div style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{usuario.txt_usuario}</div>
                            <div style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#A2ABB2', fontSize: '10px'}}>{usuario.txt_email}</div>
                            {(this.state.verEdit === usuario.id_usuario && red=== true)?<i className="material-icons" style={{ fontSize: '18px', position: 'absolute', top: '5px', right: '5px' }}>edit</i>:null}
                        </div>
                    );
                }

                const nivelStyle = { marginLeft: `${usuario.nivel * 40}px` }
                const editStyle = { right: `10px` }
                const icon = (usuario[isOpen])?'keyboard_arrow_down':'chevron_right';

                if(usuario[isVisible]){
                    return (
                        <div 
                            key={usuario.id_usuario} 
                            className='userItem'
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'flex-start',
                                padding: '5px',
                                width:'600px',
                                position: 'relative',
                                ...nivelStyle
                            }}
                            onClick={() => this.renderChildren(usuarios,usuario,red)}
                            onMouseOver={() => this.setState({ verEdit: usuario.id_usuario })}
                            onMouseLeave={() => this.setState({ verEdit: null })}
                        >
                            {(usuario.sn_espadre ===1)?<i className="material-icons">{icon}</i>:null}
                            <Avatar 
                                avatar={image}
                                size="medium"
                                color={usuario.color}
                            />
                            <div style={{ marginLeft: '10px' }}>{usuario.txt_usuario}</div>
                            {(this.state.verEdit === usuario.id_usuario && red===true)?
                                <i 
                                    style={{ ...editStyle, position: 'absolute', borderRadius: '12px' }} 
                                    className="material-icons clickableColor"
                                    onClick={(e) =>{ 
                                        e.preventDefault; 
                                        this.props.seleccionarUsuario(usuario);
                                        this.setState({ mostrarModal: true })
                                    }}
                                >
                                    edit
                                </i>:null}
                            
                        </div>
                    );
                }

                return null;

            });
            




        } catch(err){
            console.log(err);
            return null;
        }

    }

    onGuardar(){
        this.props.guardarUsuario(this.props.usuarios.usuarios, this.props.usuarioActual);       
        this.setState({ mostrarModal: false }) 
    }

    renderInvitacion(){
        return (
            <Modal 
                type='FORM' 
                isVisible={this.state.mostrarInvitacion} 
                titulo='Invitar usuario'
                loading={this.props.loading}
                onGuardar={() => { this.onGuardar(); }}
                onCerrar={() => { 
                    this.setState({ mostrarInvitacion: false }); 
                }}
            >
                <FormRow titulo='EMAIL'>                    
                    <Input 
                        type="EMAIL"
                        autoFocus={true}
                        placeholder='Email del invitado' 
                        value={this.state.emailInvitacion}
                        onChangeText={value => this.setState({ emailInvitacion: value })}
                    />                 
                </FormRow>                           
            </Modal>
        );        
    }

    renderForma(){

        const {
            txt_usuario,
            id_status,
            id_usuario_superior
        } = this.props.usuarioActual

        const usuarioActual = this.props.usuarioActual;

        const sessionData = JSON.parse(localStorage.sessionData)  
        let usuariosRed = [];
        if(this.props.usuarios.usuarios !== undefined){
            usuariosRed = this.props.usuarios.usuarios.filter(usuario => usuario.levelKey.includes(sessionData.levelKey));
        } 
        
        
        return (
            <Modal 
                type='FORM' 
                isVisible={this.state.mostrarModal} 
                titulo={txt_usuario}
                loading={this.props.loading}
                componenteInicial="id_usuario_superior"
                onGuardar={() => { this.onGuardar(); }}
                onCerrar={() => { 
                    this.setState({ mostrarModal: false }); 
                    //this.props.desseleccionarUsuario(); 
                }}
            >
                <FormRow titulo='JEFE INMEDIATO'>                    
                    <Select 
                        name='jefeInmediato'
                        value={id_usuario_superior}
                        onChange={  value => {
                                        this.props.editaUsuario({ 
                                            prop: "id_usuario_superior", 
                                            value: value.id_usuario,
                                            usuario: usuarioActual
                                        });
                                    }
                                }
                        valueKey="id_usuario"
                        labelKey="txt_usuario"
                        options={usuariosRed}
                    />                    
                </FormRow>     
                <FormRow titulo='ESTADO'>
                    <Radio 
                        label="Activo" 
                        id="rdbActivo" 
                        checked={(id_status !== 2)?true:false}
                        onChange={
                            (value) => {
                                this.props.editaUsuario({ 
                                    prop: 'id_status', 
                                    value: (value)?1:2,
                                    usuario: usuarioActual
                                })
                            }
                        }
                    /> 
                </FormRow>                        
            </Modal>
        );
    }

    renderListaUsuarios(){
        if(this.state.tipoLista === 0){
            return (
                <div style={{ paddingLeft: '15px' }}>
                    <h2 style={{ display: 'flex', margin: '20px'}}>Mi Red</h2>
                    <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'row wrap', minHeight: '100px'  }}>
                        <div 
                            key='newUser' 
                            className="userItem" 
                            style={{ display: 'flex', minWidth: '150px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', position: 'relative', border: "1px dashed #C1C1C1", borderRadius: '5px' }}
                            onMouseOver={() => {}}
                            onMouseLeave={() => {}}
                            onClick={(e) =>{ 
                                this.setState({ mostrarInvitacion: true })
                            }}
                        >
                            <div className="w3-circle newItemBig">
                                <i className="material-icons barButton">add</i>
                            </div>
                            <div style={{ width: '150px', textAlign: 'center' }}>Invitar Usuario</div>
                        </div>
                        {this.renderUsuarios(true)}
                    </div>
                    <h2 style={{ margin: '20px', display: 'flex' }}>Organización</h2>
                    <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'row wrap', height: '0px'  }}>
                        {this.renderUsuarios()}
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h2 style={{ display: 'flex', margin: '20px'}}>Mi Red</h2>
                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    {this.renderUsuarios(true)}
                </div>
                <h2 style={{ margin: '20px', display: 'flex' }}>Organización</h2>
                <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column'  }}>
                    {this.renderUsuarios()}
                </div>
            </div>
        );        

    }

    render(){

        if(this.props.usuarios.error){
            swal("Error", "No fué posible efectuar la operación", 'error');
        }

        return(
            <div id="mainProyectos" style={{display:'flex', flexDirection: 'column', overflow: 'auto'}}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                    <Segmented 
                        value={this.state.tipoLista} 
                        items={[{ value: 0, title: 'Lista', icon: 'reorder' },{ value: 1, title: 'Jerarquía', icon: 'device_hub' }]} 
                        onSelect={(value) => this.setState({ tipoLista: value })}
                    />                
                </div>
                <Input 
                        placeholder="Buscar usuarios..." 
                        style={{ lineHeight: '2em', width: '20%', alignSelf: 'center', marginTop: '10px', maxHeight: '30px' }} 
                        styleContainer={{ flex: '' }}
                        onChangeText={(value) => this.props.buscarTexto(value)}
                        value={this.props.buscar}
                    />    
                {this.renderListaUsuarios()}
                {this.renderForma()}
                {this.renderInvitacion()}
            </div>
        );        
    }

}

const styles = {
    buttonStyle: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        flex: '1',
        justifyContent: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        usuarios: state.usuarios,
        usuarioActual: state.usuarios.usuarioActual,
        buscar: state.listaProyectos.buscar
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    listaUsuarios,
    mostrarHijos,
    seleccionarUsuario,
    editaUsuario,
    guardarUsuario,
    buscarTexto
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Personal);