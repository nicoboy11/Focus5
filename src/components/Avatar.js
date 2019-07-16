import React, { Component } from 'react';
import { Config } from '../configuracion';

const { colors, network } = Config;

class Avatar extends Component{
    compRender(avatar, styles, props) {
        return (
            <div style={styles.containerStyle}>
                <div style={{ ...styles.avtStyle, backgroundColor: props.color }}>
                    <div style={styles.abbrStyle}>{props.avatar}</div>
                </div>
                <div style={{...styles.nameStyle, ...props.textStyle}} >{props.name}</div>
            </div>
        );
    }
    
    checkImage(imageSrc, good, bad) {
        var img = new Image();
        img.onload = good; 
        img.onerror = bad;
        img.src = imageSrc;
    }
    
    shouldComponentUpdate(nextProps, nextState){
        if( JSON.stringify(this.props) !== JSON.stringify(nextProps)){
            return true;
        }

        return false;
    }

    render(){
        const { avatar, color, name, size, nameColor, displayName = true, flexDirection = 'row', textStyle, avatarURL, style = {} } = this.props;
console.log(color);
        if (avatar === undefined) {
            return null;
        }
console.log(color);
        const sizes = {
            mini: 15,
            small: 20,
            medium: 30,
            big: 40,
            veryBig: 60,
            huge: 120
        };
    
        const styles = {
            avtStyle: {
                width: sizes[size],
                height: sizes[size],
                borderRadius: sizes[size] / 2,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: '1px',
                borderColor: colors.mainDark,
                backgroundColor: 'transparent'
            },
            containerStyle: {
                display: 'flex',
                flexDirection,
                alignItems: 'center'
            },
            nameStyle: {
                fontSize: (sizes[size] - (sizes[size] / 2)),
                color: nameColor,
                marginLeft: '5px'
            },
            abbrStyle: {
                color: colors.mainText,
                fontSize: `${(sizes[size] / 2) - 2}px`,
                lineHeight: `${((sizes[size] / 2) - 2)*2}px`,
                textAlign: 'center'
            }
        };
    
        let srcImg = '';
    
        if(avatarURL !== undefined){
            srcImg = avatar;
        } else {
            srcImg = `${avatar}`;
        }

        let classColor = "_FF6D00"
        if(color && color !== null){
            classColor = color.replace("#","_");
        }
        
    
        let avt = null;
        if(avatar.length < 3) {
            avt = (<div style={{ ...styles.avtStyle }}>
                                <div style={styles.abbrStyle}>{avatar}</div>
                            </div>);
        } else {
    
            avt = (<img 
                            style={styles.avtStyle} 
                            src={srcImg} 
                            onError={(e) => {
                                e.target.src=`${Config.network.server}/usr/thumbs/small/user.png`;
                            }} 
                        />
                );
    
        }
    
        return (<div title={name} style={{ ...styles.containerStyle, ...style}}>
                    <div className={`${classColor}`} style={{ ...styles.avtStyle }}>
                        <div style={styles.abbrStyle}>{avt}</div>
                    </div>
                    {(displayName)?<div style={{...styles.nameStyle, ...textStyle}} >{name}</div>:null}
                    
                </div>);        
    }
}


export { Avatar };