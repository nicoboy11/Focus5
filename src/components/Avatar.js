import React from 'react';
import { Config } from '../configuracion';

const { colors, network } = Config;

const Avatar = ({ avatar, color, name, size, nameColor, flexDirection = 'row', textStyle }) => {

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
            fontSize: (sizes[size] / 2) - 2  
        }
    };

    const avt = (avatar.length < 3) ?
                (<div style={{ ...styles.avtStyle, backgroundColor: color }}>
                    <div style={styles.abbrStyle}>{avatar}</div>
                </div>) :
                <img style={styles.avtStyle} src={network.server + 'usr/thumbs/small/' + avatar} />;

    return (
        <div style={styles.containerStyle}>
            {avt}
            <div style={{...styles.nameStyle, ...textStyle}} >{name}</div>
        </div>
    );
};

export { Avatar };