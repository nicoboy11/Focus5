import React, { Component } from 'react';

class Modal extends Component {

    static defaultProps = {
        type: 'FORM',//o MENSAJE
        isVisible: false,
        titulo: '',
        onGuardar: () => {},
        onCancelar: () => {},
        loading: false

    }

    onCerrar(e){
        this.stopPropagation(e);
        this.props.onCerrar();
    }

    onGuardar(e){
        this.stopPropagation(e);
        this.props.onGuardar();
    }

    stopPropagation(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    renderContent(){
        const {
            content,
            mensaje,
            form
        } = styles;

        if(this.props.type==='FORM'){
            return (
                <div className="w3-animate-top" onClick={(e) => { this.stopPropagation(e); } } style={{...content, ...form}}>
                    <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                        <i style={styles.button} onClick={this.onCerrar.bind(this)} className="material-icons clickableColor">arrow_back</i>
                        <div style={styles.title}>{this.props.titulo}</div>
                        {   this.props.loading ? 
                            <i style={styles.button} onClick={this.onGuardar.bind(this)} className="material-icons clickableColor w3-spin">cached</i> :
                            <i style={styles.button} onClick={this.onGuardar.bind(this)} className="material-icons clickableColor">check</i>
                        }
                        
                    </div>
                    <div style={{ flex: 1, padding: '20px'}}>
                        {this.props.children}
                    </div>
                </div>
            );
        }

        return (
            <div style={{...content, ...mensaje}}>holsdfsda</div>
        )
    }

    render(){
        if(this.props.isVisible){
            return (
                <div style={{ display:'flex', justifyContent: 'center', position: 'fixed', width: '100%', height: '100%', zIndex: 999, top: 0, left: 0 }}>
                    {this.renderContent()}
                    <div onClick={this.onCerrar.bind(this)} style={styles.background}></div>
                </div>
            );
        }

        return null;

    }
}

const styles = {
    background:{
        position: 'absolute',
        backgroundColor:'black',
        opacity:'0.4',
        width: '100%',
        height: '100%',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
        
    },
    content:{
        backgroundColor:'white',
        zIndex: 1,
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
        cursor:'default'
    },
    mensaje:{
        flex: 1,
        marginLeft: '35%',
        marginRight: '35%',
        height: '200px',
        padding: '20px'
    },
    form:{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90%',
        minWidth: '40%',
        height: 'fit-content'
    },
    button:{
        margin: '10px',
        cursor: 'pointer'
    },
    title: {
        display: 'flex', 
        flex: 1, 
        lineHeight: '24px',
        marginTop: '10px',
        marginBottom: '10px',
        fontWeight: 'bold',
        fontSize: '18px'
    }
}

export { Modal };