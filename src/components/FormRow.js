import React, {Component} from 'react';

class FormRow extends Component {
    render(){
        return (
            <div className="wrapperForma">
                <div className="tituloForma fadeColor">{this.props.titulo}:</div>
                <div className="contentForma" style={{ ...this.props.style }}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export { FormRow };