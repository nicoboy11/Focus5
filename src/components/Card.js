import React, { Component } from 'react';

class Card extends Component {
    render(){

        return (
            <div 
                className="w3-card" 
                style={styles.cardStyle}
                onClick={this.props.onClick}
            >
                <div style={styles.titleStyle}>
                    {this.props.titulo}
                </div>
                <div>
                    {this.props.icono?
                    <i style={{ fontSize: '120px' }} className="material-icons">{this.props.icono}</i>:
                    <img style={{ width: '120px', height: '120px' }} src={this.props.img} />
                    }
                </div>
            </div>
        )
    }
}

const styles = {
    titleStyle: {
        fontSize: '24px'
    },
    cardStyle: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFF',
        margin: '15px',
        padding: '10px',
        minWidth: '180px',
        maxWidth: '300px',
        maxHeight: '200px',
        borderRadius: '3px',
        cursor: 'pointer',   
        alignItems: 'center'
    }    
}

export {Card}