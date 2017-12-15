import {
    SOCKET,
    SOCKET_CLEAR
} from './types';

export const enviarSocket = (data) => {
    return {
        type: SOCKET,
        payload: data
    }    
}

export const clearSocket = () => {
    return { type: SOCKET_CLEAR };
}
