import { Config } from './';
import axios from 'axios';
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImV2ZW4uc29zYUBnbWFpbC5jb20iLCJwYXNzd29yZCI6InNvc2EifQ.e5gaUw2apXJnH747Wp2EBCdUzktMratJV3Fq48DmHBc';

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
                    'Content-Type': 'multipart/form-data  charset=utf-8; boundary=abcdefghi',
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


    static fileUpload(body, callback){

        let form = new FormData();

        form.append("up_file_even", body);
        form.append("id_usuario","12");

        const req = new XMLHttpRequest();

        const config = {
            headers: Database.getHeader(1),
            onUploadProgress: progressEvent => {
                const progress = {
                    type: 'progress',
                    progress: Math.floor((progressEvent.loaded * 100) / progressEvent.total),
                }
                callback(false, progress);
            }
        }

        axios.post(Config.network.server + 'uploadsync.php', form, config)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err.message);
            })
    
        /** Cuando termina de cargar el archivo */
        req.addEventListener('load', (e) => {
            this.proxy.removeAllListeners(['abort']);
            const newState = { progress: 100 };
            if (req.status >= 200 && req.status <= 299) {
                callback(false,e, req);
            } else {
                newState.hasError = true;
                callback(true, e, req)
            }
        }, false);
    
        /** Si hubo un error al subir */
        req.addEventListener('error', (e) => {
            callback(true, e, req);
        }, false);
    
        req.upload.addEventListener('progress', (e) => {
            let progress = 0;
            if (e.total !== 0) {
                progress = parseInt((e.loaded / e.total) * 100, 10);
            }
            callback(false, e, req, progress);
        }, false);
    
        req.addEventListener('abort', (e) => {
            callback(true, { progress: -1 })
        }, false);
    
        this.proxy.once('abort', () => {
            req.abort();
        });
    
        /*callback(false, req)
                    .send(this.props.formCustomizer(form));*/
                
    }    
}

export { Database };