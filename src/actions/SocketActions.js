import {
    SOCKET
} from './types';

export const enviarSocket = (data) => {
    return {
        type: SOCKET,
        payload: data
    }    
}