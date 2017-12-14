import React, { Component } from 'react';
import { Input } from './'

class NewTask extends Component{

    constructor(props){
        super(props);
        this.state = {
            selected: false,
            value: ''
        }
    }

    guardarTarea() {

        //GuardarTarea
        this.props.onEnter(this.state.value);

        //Regresar a estado original
        this.setState({
            selected: false,
            value: ''
        });
    }

    render() {
        if(this.state.selected) {
            return (
                <div id="newTask" className="divideBottom" style={{ ...styles.containerStyle }}>
                    <Input 
                        autoFocus={true}
                        placeholder="Escriba el nombre de la tarea"
                        value={this.state.value}
                        onChangeText={(value) => this.setState({ value })}
                        onEnter={this.guardarTarea.bind(this)}
                    />
                    <i onClick={() => this.setState({ selected: false, value: '' })} style={{ color: '#A2ABB2' }} className="material-icons fNormal">close</i>
                </div>                
            );
        }

        return (
            <div id="newTask" onClick={() => this.setState({selected: true})} className="divideBottom" style={{ ...styles.containerStyle }}>
                <div className="w3-circle newItemNormal">
                    <i className="material-icons fNormal">add</i>
                </div>
                <div style={{ marginLeft: '10px'}}>
                    Agregar Tarea
                </div>
            </div>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px',
        cursor: 'pointer'
    }
}

export { NewTask }