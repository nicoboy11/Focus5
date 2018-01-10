import React, { Component } from 'react';

class ContextMenu extends Component{

    static defaultProps = {
        lista: [],
        visible: false,
        onClose: () => {},
        onListClick: () => {},
        posicion: {x: 0, y: 0}
    }

    onListClick(item){
        this.props.onListClick(item);
    }

    renderList(){
        return this.props.lista.map(item => {
            return (<li key={item.nombre} style={styles.liList} onClick={() => this.onListClick(item)}>
                        {(item.icono !== undefined)?<i title="Atendida" style={{ marginRight: '5px' }} className='material-icons clickableColor'>{item.icono}</i>:null}            
                        {item.nombre}
                    </li>);
        });
    }

    render(){
        if(this.props.visible) {
            return (
                <div style={styles.container} className="w3-animate-left">
                    <ul style={{ ...styles.uList, top: this.props.posicion.y, left: this.props.posicion.x }}>
                        {this.renderList()}
                    </ul>
                    <div style={styles.modal} onClick={() => this.props.onClose()}></div>
                </div>
            );
        }

        return null;
    }

}

export { ContextMenu };

const styles = {
    container: {
        position: 'absolute',
        zIndex: '999'
    },
    uList:{
        backgroundColor:'white',
        boxShadow: '0px 0px 15px 0px rgba(0,0,0,0.2)',
        borderRadius: '5px',
        listStyleType: 'none',
        zIndex: '2',
        position: 'fixed',
        padding: '0px',
        paddingBottom: '15px'
    },
    liList: {
        paddingTop: '15px',
        marginLeft: '20px',
        marginRight: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    modal: {
        position:'fixed',
        top: '0px',
        left: '0px',
        bottom: '0px',
        right: '0px',
        zIndex: '1'
    }
}