import { Config } from './';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6bnVsbCwicGFzc3dvcmQiOm51bGx9.r-btFJ2d9-3IXT37JjzeAeS78xsUxYo6edFvvDvURR4';

class Database {

    static getHeader(headerType) {
        switch (headerType) {
            case 0:
                return {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        };            
            case 1:
                return {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                };            
            case 2:
                return {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        };    
            default:
                return {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        };             
        }
    }

    static request(method, sp, body, headerType, callback) {
        let data = (Object.keys(body).length === 0) ? null : JSON.stringify(body);
        
        if (method === 'POST' || method === 'PUT') {
            if (headerType === 1) {
                data = new FormData();
                const keys = Object.keys(body);
                
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];                    
                    if (body[key] !== undefined) {
                        data.append(key, body[key]);
                    }
                }
            }
        }

        if (method === 'GET') {
            data = null;
        }
        let responseStatus = 0;

        fetch(Config.network.server + sp, { 
            method, 
            headers: Database.getHeader(headerType),
            body: data
        })
        .then((response) => {
            responseStatus = response.status;

            return response.json();
        })
        .then((responseJson) => {
            responseJson.status = responseStatus;
            callback(false, responseJson);
        })
        .catch((error) => callback(true,error));                  
    }    
}

export { Database };