import React, { Component } from 'react';
import {Input, Radio} from './';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'moment/locale/es'
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Input:
 *    titulo
 *    placeholder
 *    value
 *    id
 * dateRange:
 *    abierto -bit
 *    fec_inicio
 *    fec_limite
 */

class Form extends Component {

    constructor(props){
        super(props);
        this.state = {
            ...props,
            startDate: moment(),
            endDate: moment(new Date()).add(1,'days') 
        }
    }    

    componentWillMount(){
        let toState = {};
        for(let i = 0; i < this.props.formData.length; i++){
            if(this.props.formData[i].tipo === 'dateRange'){
                for(let j = 0; j < this.props.formData[i].fechas.length; j++) {
                    toState[this.props.formData[i].fechas[j].id] = this.props.formData[i].fechas[j].value;
                }
            } else {
                toState[this.props.formData[i].id] = this.props.formData[i].value;
            }
            
        }

        this.setState(toState);
    }

    renderItems(){
        const items = this.state.formData;

        return items.map((item) => {
            return (
                <div className="wrapperForma">
                    <div className="tituloForma fadeColor">{item.titulo}:</div>
                    <div className="contentForma">
                        {this.renderItem(item)}
                    </div>
                </div>
            )
        });
    }

    renderItem(item){
        switch(item.tipo){
            case 'input':
                return(<Input 
                            id={item.id}
                            placeholder={item.placeholder}
                        /> )
                break;
            case 'dateRange':
                return (
                    <div>
                        <div style={{display:'flex', flexDirection: 'row', alignItems:'center'}}>
                            <span className="txtSpan">De </span>
                            <DatePicker 
                                selected={this.state.startDate}
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                selectsStart
                                onChange={(date) => {this.setState({startDate:date})}}
                                locale="es"
                                className="dateStyle"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                todayButton="Hoy"
                            />    
                            <span className="txtSpan">a</span>    
                            <DatePicker 
                                selected={this.state.endDate}
                                selectsEnd
                                startDate={this.state.startDate}
                                endDate={this.state.endDate}
                                onChange={(date) => {this.setState({endDate:date})}}
                                locale="es"
                                className="dateStyle"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                todayButton="Hoy"
                            />
                        </div>
                        <div style={{marginTop: '15px'}}>
                            <Radio label="Abierta" id="rdbAbierta" /> 
                        </div>     
                    </div>                
                )
                break;
            case 'date':
                break;
            case 'radio':
                return (
                    <div style={{marginTop: '10px'}}>
                        <Radio label="Activo" id="rdbActivo" /> 
                    </div>                      
                );
                break;       
            default: 
                return null;
                break;                                  
        }
    }

    render(){
        return(
            <div>
                {this.renderItems()}               
            </div>
        );
    }
}

export { Form };