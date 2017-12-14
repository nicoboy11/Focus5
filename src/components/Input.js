import React, { Component } from 'react';

const types = {
    NORMAL: '',
    EMAIL: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i ,
    TEXT: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g ,
    EXTENDEDTEXT: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ(){}'`.\s]/g,
    PASSWORD: ''
};

class Input extends Component{
    static defaultProps = {
        type: 'NORMAL',
        multiline: false,
        label: false,
        labelText: '',
        placeholder: '',
        value: '',
        onEnter: () => {}
    }

    /**
     * Para ver si se puestra un label con el input
     */
    renderLabel(){
        const {
            label,
            labelText
        } = this.props;        

        if(label){
            return (
                <label style={styles.labelStyle}>{labelText}</label>
            )
        }

        return null;
    }

    /**
     * Si el texto cambia se checa con el REGEX que hayan pedido
     * @param {*} text 
     */
    onChangeText(text) {
        if(this.props.onChangeText !== undefined) {
            this.props.onChangeText(text.target.value.replace(types[this.props.type],''));
        }
        
    }

    onKeyPress(e){
        const code = (e.keyCode ? e.keyCode : e.which);
        if(code === 13){
            this.props.onEnter();
        }
    }

    /**
     * Renderizar el componente si es multilinea se usa textarea si no input
     */
    renderInput(){

        const {
            multiline,
            placeholder,
            type,
            id,
            value,
            autoFocus
        } = this.props;

        if(multiline){
            return (
                <textarea 
                    id={id} 
                    placeholder={placeholder} 
                    className="chatTextArea" 
                    value={value} 
                    onChange={this.onChangeText.bind(this)}
                    onKeyPress={this.onKeyPress.bind(this)}
                />
            );
        }

        return (
            <input 
                autoFocus={autoFocus} 
                onChange={this.onChangeText.bind(this)}
                onKeyPress={this.onKeyPress.bind(this)}
                id={id} 
                value={value} 
                placeholder={placeholder} 
                style={styles.inputStyle} 
                type={(type==='PASSWORD') ? 'password' : 'text'} 
            />
        );
    }

    /**
     * Renderiza componente
     */
    render(){
        return(
            <div style={{display: 'flex', flex: 1}}>
            {this.renderLabel()}
            {this.renderInput()}
            </div>
        );
    }
}

/**
 * Estilos
 */
let styles = {
    inputStyle: {
        display: 'flex',
        flex: 1,
        lineHeight: '2.5em',
        paddingLeft: '10px',
        border: '1px solid #E1E4E8',
        borderRadius: '4px'
    },
    labelStyle: {
        display:'flex',
        flex: 1
    }
}

export { Input }