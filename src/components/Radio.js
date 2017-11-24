import React, {Component} from 'react';

class Radio extends Component{

    static defaultProps = {
        id: null,
        label: 'Radio'
    }    

    render(){
        const { id, label } = this.props;
        return(
            <div style={{ display: 'flex', alignItems:'center'}}>
                <span className="txtSpan">{label}</span>
                <div className="toggleWrapper">
                    <input type="checkbox" id={id} className={id} />
                    <label htmlFor={id} className="toggle"><span className="toggle__handler"></span></label>
                </div>  
            </div>               
        );
    }
}

export { Radio };