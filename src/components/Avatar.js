import React from 'react';
import { Config } from '../configuracion';

const { colors, network } = Config;

const Avatar = ({ avatar, color, name, size, nameColor, flexDirection = 'row', textStyle, avatarURL }) => {

    if (avatar === undefined) {
        return null;
    }

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
            flexDirection,
            alignItems: 'center'
        },
        nameStyle: {
            fontSize: (sizes[size] - (sizes[size] / 2)),
            color: nameColor
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
    

    let avt = null;
    if(avatar.length < 3) {
        avatar = (<div style={{ ...styles.avtStyle, backgroundColor: color }}>
                            <div style={styles.abbrStyle}>{avatar}</div>
                        </div>);
    } else {

            avatar = <img style={styles.avtStyle} src={srcImg} />;

    }

    return (<div style={styles.containerStyle}>
                <div style={{ ...styles.avtStyle, backgroundColor: color }}>
                    <div style={styles.abbrStyle}>{avatar}</div>
                </div>
                <div style={{...styles.nameStyle, ...textStyle}} >{name}</div>
            </div>);

};

function compRender(avatar, styles, props) {
    return (
        <div style={styles.containerStyle}>
            <div style={{ ...styles.avtStyle, backgroundColor: props.color }}>
                <div style={styles.abbrStyle}>{props.avatar}</div>
            </div>
            <div style={{...styles.nameStyle, ...props.textStyle}} >{props.name}</div>
        </div>
    );
}

function checkImage(imageSrc, good, bad) {
    var img = new Image();
    img.onload = good; 
    img.onerror = bad;
    img.src = imageSrc;
}

export { Avatar };