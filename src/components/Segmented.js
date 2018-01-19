
import React, {Component} from 'react';

class Segmented extends Component{

    static defaultProps = {
        value: null,
        items: [], //{ value, icon, title }
        onSelect: () => {}
    }    

    renderItems(){
        const { value, items } = this.props;
        const { itemStyle } = styles;
        return items.map((item,index, array) => {

            let selectionStyle = {};
            let iconClass = "clickableColor";

            //Si está seleccionado ó no
            if(value === item.value) {
                selectionStyle = {
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                };
            } else {
                selectionStyle = {
                    opacity: '0.3',
                    display: 'flex',
                    alignItems: 'center'
                };
                iconClass = "secondaryColor";
            }

            let separator = {};

            //Si lleva separador ó no
            //si solo son 2 items: el primer item lleva separador a la derecha
            if(array.length < 3 && index=== 0){
                separator = { borderRight: '1px solid #F1F1F1'};
            }

            //Si son más de 2: todos llevan separador a la izquierda
            if(array.length > 2 && index !== 0){
                separator = { borderLeft: '1px solid #F1F1F1'};
            }

            return (<div 
                        key={index}
                        style={{...itemStyle, ...separator}}
                        onClick={() => this.props.onSelect(item.value) }
                    >
                        <div style={{ ...selectionStyle}}>
                            {(item.icon !== undefined)?<i title="Atendida" className={`material-icons ${iconClass}`} style={{ marginRight: '7px'}}>{item.icon}</i>:null}
                            {item.title}                        
                        </div>
                    </div>
                );
        });
    }
    render(){
        return(
            <div style={styles.containerStyle}>
                {this.renderItems()}
            </div>
        );
    }
}

const styles = {
    containerStyle: {
        display:'flex', 
        flexDirection: 'row', 
        justifyContent: 'space-evenly', 
        alignItems: 'center', 
        paddingLeft: '20px', 
        paddingRight: '20px',
        border: '1px solid #F1F1F1',
        borderRadius: '5px'
    },
    itemStyle: {
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        flex: '1',
        paddingLeft: '10px',
        paddingRight: '10px',
        marginTop: '10px',
        marginBottom: '10px',
        cursor: 'pointer'
    }

}

export { Segmented };                    