import React, {Component} from 'react';

class Radio extends Component{

    static defaultProps = {
        id: null,
        label: 'Radio',
        checked: false,
        style: {}
    }    

    render(){
        const { id, label, checked, style } = this.props;
        return(
            <div style={{ display: 'flex', alignItems:'center', ...style }}>
                <span className="txtSpan">{label}</span>
                <div className="toggleWrapper">
                    <input {...(checked ? {checked:true} : {})} type="checkbox" id={id} className={id} onChange={(e) => this.props.onChange(e.target.checked)} />
                    <label htmlFor={id} className="toggle"><span className="toggle__handler"></span></label>
                </div>  
            </div>               
        );
    }
}

export { Radio };