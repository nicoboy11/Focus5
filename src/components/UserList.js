import React, { Component } from 'react';
import { Config } from '../configuracion'
import { Avatar } from './'

class UserList extends Component{

    obtieneLista(){
        let {participantes, limit} = this.props;
        //poner un limite de usuarios visibles, el resto se pone con un +N
        if(limit === undefined) { limit = 5; }
        
        var i = 0;

        return participantes.map(participante => {
            i++;

            const srcImg = `${Config.network.server}/usr/thumbs/small/${participante.id_usuario}.jpg?v=${new Date().getTime()}`;
            let overlayVal = i*12;

            if( i > limit){
                return <div key={`usrlst${i}` }></div>;
            }

            if (i === limit && ((participantes.length - limit + 1) > 1)) {
                return (<div 
                            key={participante.id_usuario} 
                            title={this.listaNombres(participantes,i-1)} 
                            className="w3-circle avtSmall w3-light-gray ensimoso"
                            style={{position: 'absolute', left: overlayVal}}
                        > 
                            {`+${(participantes.length - limit + 1).toString()}`}
                        </div>);
            }

            return (
                <Avatar 
                    key={participante.id_usuario}
                    avatar={srcImg} 
                    color={participante.color} 
                    name={participante.txt_usuario} 
                    size='small' 
                    displayName={false} 
                    style={{position: 'absolute', left: overlayVal}}
                />
            );
            /*
            if(participante.txt_abbr.length > 2){
                return <img 
                            key={participante.id_usuario} 
                            title={participante.txt_usuario} 
                            className="w3-circle avtSmall ensimoso" 
                            src={srcImg} 
                            alt="" 
                            style={{position: 'absolute', left: overlayVal}}
                        />;
            } else {
                return (<div 
                            key={participante.id_usuario} 
                            title={participante.txt_usuario} 
                            className={"w3-circle avtSmall ensimoso"} 
                            style={{backgroundColor: participante.color, position: 'absolute', left: overlayVal}}
                        > 
                            {participante.txt_abbr} 
                        </div>);
            }*/
        });

    }

    listaNombres(participantes, startIndex) {
        var lista = "";
        for(var i = startIndex; i < participantes.length; i++){
            lista += participantes[i]['txt_usuario'] + '\n';
        }
        return lista;
    }

    render(){
        return(
            <div className="chatContentStatus">{this.obtieneLista()}</div>
        )
    }

}

export {UserList};