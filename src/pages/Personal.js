import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { listaUsuarios } from '../actions';
import { Avatar, Segmented } from '../components';
import { Config } from '../configuracion';

const { network } = Config;

class Personal extends Component{
    state = {
        tipoLista: 0
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

    renderUsuarios(red){

        try {
            const sessionData = JSON.parse(localStorage.sessionData)         

            if(this.props.usuarios === undefined) {
                return null;
            }

            let usuarios = [];
            //solo usuarios de mi red
            if(red){
                usuarios = this.props.usuarios.usuarios.filter(usuario => usuario.levelKey.includes(sessionData.levelKey));
            } else {
                usuarios = this.props.usuarios.usuarios.filter(usuario => !usuario.levelKey.includes(sessionData.levelKey));
            }
    
            return usuarios.map(usuario => {
                const image = usuario.sn_imagen===1?
                                `${network.server}usr/thumbs/small/${usuario.id_usuario}.jpg?v=${new Date().getTime()}`:
                                usuario.txt_abbr
    
                return (
                    <div style={{ display: 'flex', minWidth: '150px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '20px'}}>
                        <Avatar 
                            avatar={image}
                            size="veryBig"
                            color={usuario.color}
                        />
                        <div style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{usuario.txt_usuario}</div>
                        <div style={{textAlign: 'center', width: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#A2ABB2', fontSize: '10px'}}>{usuario.txt_email}</div>
                    </div>
                );
            })
        } catch(err){
            console.log(err);
            return null;
        }

    }

    render(){
        return(
            <div id="mainProyectos" style={{display:'flex', flexDirection: 'column'}}>
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                    <Segmented 
                        value={this.state.tipoLista} 
                        items={[{ value: 0, title: 'Lista', icon: 'reorder' },{ value: 1, title: 'Jerarquía', icon: 'device_hub' }]} 
                        onSelect={(value) => this.setState({ tipoLista: value })}
                    />
                </div>
                <h2 style={{ display: 'flex', margin: '20px'}}>Mi Red</h2>
                <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'row wrap', minHeight: '100px'  }}>
                    {this.renderUsuarios(true)}
                </div>
                <h2 style={{ margin: '20px', display: 'flex' }}>Organización</h2>
                <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'row wrap', height: '0px'  }}>
                    {this.renderUsuarios()}
                </div>
        </div>
        );        
    }

}

const mapStateToProps = (state) => {
    return {
        usuarios: state.usuarios
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    listaUsuarios
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(Personal);