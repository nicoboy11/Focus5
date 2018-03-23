import React, { Component } from 'react';
import { Input, NewTask } from './';

class CheckList extends Component{
    state = {
        loading: false
    }

    static defaultProps = {
        data: [],
        onCheck: () => {},
        onAgregaLista: () => {},
        onChange: () => {},
        loading: false,
        keyProp: 'id',
        descProp: 'value',
        checkedProp: 'id_status'
    }

    onKeyPress(e, index){
        e.stopPropagation();
        const code = (e.keyCode ? e.keyCode : e.which);
        if(code === 13 || code === 9){
            this.props.onChange(this.props.data[index],'editar');
        }
    }    

    renderList(){

        const { keyProp, descProp, checkedProp } = this.props;

        return this.props.data.map((item, index, data) => {
            const checkedStyle = {
                textDecoration:(item[checkedProp] === 2)?'line-through':'none',
                color:(item[checkedProp] === 2)?'#A2ABB2':''
            }

            return (
                <label 
                    key={item[keyProp]} 
                    className="container" 
                    htmlFor={`ckLst${index}`}
                    style={{ ...checkedStyle }}
                    onClick={(e) => { 
                        if (e && e.preventDefault)  
                            e.preventDefault()  
                        else 
                            window.event.cancelBubble=true                         
                        let newData = [...data];
                        newData[index].id_status = (newData[index].id_status) === 1?2:1;
                        this.props.onChange(newData[index], 'editar');
                    }}
                >
                    <input 
                        tabIndex={index+1}
                        onClick={(e) => e.stopPropagation()} 
                        onChange={({ target }) => { 
                            let newData = [...data];
                            newData[index][descProp] = target.value;
                            this.props.onChange(newData, 'textEdit') 
                        }} 
                        onKeyDown={(e) => this.onKeyPress(e,index)}
                        placeholder='Describa la subtarea....' 
                        value={item[descProp]} 
                        style={{ border: '0', background: 'transparent', outline: 'none', width: '85%', ...checkedStyle }}
                    />
                    <input 
                        id={`ckLst${index}`} 
                        className='chkinput' 
                        type="checkbox" 
                        checked={(item[checkedProp]===1)?false:true} 
                    />
                    <span className="checkmark"></span>
                    <i  onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            //let newData = [...data];
                            //newData.splice(index,1);
                            this.props.onChange({ idSubtarea: item[keyProp] }, 'borrar') 
                        }} 
                        className="material-icons" 
                        style={{ float: 'right', marginTop: '4px', marginRight: '20px' }}>
                            highlight_off
                    </i>
                </label>            
            );
        })

        
    }
    render(){
        let loadingStyle = {};
        if(this.props.loading){
            loadingStyle = { opacity: 0.5 }
        }

        return (
            <div style={{ ...loadingStyle, width: '100%', backgroundColor: 'white', padding: '20px', border: '1px solid #F1F1F1'}}>
                {this.renderList()}
                <NewTask 
                    ref="newCheck"
                    titulo='Agregar subtarea'
                    borderless={true}
                    onEnter={(txtCheck) => {
                        if(!this.props.loading){
                            //let newData = [...this.props.data];
                            let newItem = { [this.props.descProp]: txtCheck};
                           // newData.push(newItem)
                            this.props.onChange(newItem,'crear');
                        }
                    }}
                />

               
            </div>            
        )
    }
}

export { CheckList };