import React, { Component } from 'react';

class Input extends Component{
    static types = [
        {'NORMAL': ''},
        {'EMAIL': /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i },
        {'TEXT': /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g },
        {'EXTENDEDTEXT': /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ(){}'`.\s]/g},
        {'PASSWORD': ''}
    ];

    static defaultProps = {
        type: 'NORMAL',
        multiline: false,
        label: false,
        labelText: '',
        placeholder: '',
        value: ''
    }
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

    renderInput(){

        const {
            multiline,
            placeholder,
            type,
            id,
            value
        } = this.props;

        if(this.props.multiline){
            return (
                <textarea id={id} placeholder={placeholder} className="chatTextArea">{value}</textarea>
            );
        }

        return (
            <input id={id} value={value} placeholder={placeholder} style={styles.inputStyle} type={(type==='PASSWORD') ? 'password' : 'text'} />
        );
    }

    render(){
        return(
            <div style={{display: 'flex', flex: 1}}>
            {this.renderLabel()}
            {this.renderInput()}
            </div>
        );
    }
}

let styles = {
    inputStyle: {
        display: 'flex',
        flex: 1,
        lineHeight: '2.5em',
        paddingLeft: '10px',
        border: '1px solid #E1E4E8'
    },
    labelStyle: {
        display:'flex',
        flex: 1
    }
}

export { Input }