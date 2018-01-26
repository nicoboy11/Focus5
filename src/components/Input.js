import React, { Component } from 'react';
import { Helper, Config } from '../configuracion';

const { texts, regex, colors } = Config;

const types = {
    NORMAL: '',
    EMAIL: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i ,
    TEXT: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g ,
    EXTENDEDTEXT: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ(){}'`.\s]/g,
    NUMBER:  /[0-9]/g ,
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
        replace: true,
        style: {},
        styleContainer:{},
        onEnter: () => {}
    }
    constructor(props){
        super(props);
    
        this.state = {
          isError: false,
          errorText: ''
        };
    }

    validateInput(text) {
        let newText = text;
        switch (this.props.type) {
            case 'EMAIL':
                this.setState({ isError: Helper.isValidEmail(text) });
                this.setState({ errorText: texts.invalidEmail });
                break;
            case 'TEXT':
                if (!Helper.isValidText(text)) {
                    newText = text.replace(regex.textOnly, '');
                }
                break;
            case 'EXTENDEDTEXT':
                if (!Helper.isValidText(text)) {
                    newText = text.replace(regex.extendedText, '');
                }
                break;                
            case 'number':
                break;
            default:
                this.setState({ keyboardType: 'default' });
        }
        return newText;
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
            if(this.props.replace === true) {
                this.props.onChangeText(text.target.value.replace(types[this.props.type],''));
            } else {

                this.validateInput(text.target.value);
                this.props.onChangeText(text.target.value)
            }
            
        }
        
    }

    onKeyPress(e){
        const code = (e.keyCode ? e.keyCode : e.which);
        if(code === 13){
            if(!e.shiftKey){
                this.props.onEnter();
            } else {
                
            }
            
        }
    }

    renderError(){
        if(this.state.isError) {
            return <div style={styles.errorTextStyle}>{this.state.errorText}</div>;
        } 

        return null;
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
                style={{ ...styles.inputStyle, ...this.props.style}} 
                type={(type==='PASSWORD') ? 'password' : 'text'} 
            />
        );
    }

    /**
     * Renderiza componente
     */
    render(){
        return(
            <div style={{display: 'flex', flex: 1, flexDirection: 'column', ...this.props.styleContainer}}>
            {this.renderLabel()}
            {this.renderInput()}
            {this.renderError()}
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
    },
    errorTextStyle: {
        color: colors.error,
        fontSize: 12,
        height: 15
    }    
}

export { Input }