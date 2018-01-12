import React, { Component } from 'react';
import { Modal } from './';

class ImagePicker extends Component {

    static defaultProps = {
        titulo: 'Seleccionar imagen',
        loading: 0,
        archivo: {},
        crop: () => {}
    }

    constructor(props){
        super(props);
        this.state = {
            mostrar: false,
            zoom: 100,
            pos: { top: 0, left: 0 }
        }
    }    

    mostrarImagen(evt){
        try{
            const files = evt.target.files;
            const filename = files[0].name;
            const filetype = files[0].type;

            for (let i = 0, f; f = files[i]; i++) {

                let reader = new FileReader();
                const me = this;
                reader.onload = function (evt) {

                    me.props.fileChange(files[0], evt.target.result);

                }

                reader.readAsDataURL(f);
            }
        } catch(err){

        }
    }   
    
    getCroppedImg(image, pixelCrop, size, fileName) {
        
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
        
          ctx.drawImage(
            image,
            pixelCrop.left,
            pixelCrop.top,
            size,
            size,
            0,
            0,
            size,
            size
          );
        
          // As Base64 string
          // const base64Image = canvas.toDataURL('image/jpeg');
        
          // As a blob
          return new Promise((resolve, reject) => {
            canvas.toBlob(file => {
              file.name = fileName;
              resolve(file);
            }, 'image/jpeg');
          });
    }    

    async test() {
        let actualImage = this.refs.currImg;
        var img = new Image();
        img.src = this.props.archivo.url;

        //Obtener porcentajes del punto inicial
        //const psgWidth = ((actualImage.clientWidth * 100)/img.width)/100;
        //const psgHeight = ((actualImage.clientHeight * 100)/img.height)/100;

        //convertir posision y tamaño a lo normal
        const pos = { left: (this.state.pos.left + 60) * (img.width/actualImage.clientWidth), top: (this.state.pos.top + 60) * (img.height/actualImage.clientHeight) };
        const size = 280*(img.width/actualImage.clientWidth);

        //croppear imagen
        const croppedImg = await this.getCroppedImg(img, pos, size, "cropped.jpeg");

        //convertir a blob
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(croppedImg);

        //actualizar
        this.props.fileChange(croppedImg, imageUrl);
        this.setState({ pos: { left: -60, top: -60 }, zoom: 10 })
    }    

    onImgLoad({target:img}){
        const height = img.offsetHeight;
        const width = img.offsetWidth;
    }

    render(){

        const zoom = { width: `${this.state.zoom}%`}
        const pos = { left: -this.state.pos.left, top: -this.state.pos.top }
        const me = this;
        return (
            <div>
                <i onClick={() => this.setState({ mostrar: true })}className="material-icons">edit</i>
                <Modal 
                    type='FORM' 
                    isVisible={this.state.mostrar} 
                    titulo={this.props.titulo}
                    loading={this.props.loading}
                    style={{ display:'flex', flexDirection: 'column', alignItems: 'center' }}
                    onGuardar={() => { this.test(); }}
                    onCerrar={() => { me.setState({ mostrar: false }) }}
                >
                    <div
                        onMouseDown={(e) => { this.setState({ moving: true, startPos: { X: e.screenX + this.state.pos.left, Y: e.screenY+this.state.pos.top } })}} 
                        onMouseUp={() => { 
                            let left;
                            let top;
                            if(this.state.pos.left < -60){
                                left = -60;
                            } else {
                                left = this.state.pos.left;
                            }

                            if(this.state.pos.top < -60){
                                top = -60;
                            } else {
                                top = this.state.pos.top;
                            }

                            let actualImage = this.refs.currImg;
                            if(this.state.pos.left > (actualImage.clientWidth - 400) + 60){
                                left = (actualImage.clientWidth - 400) + 60
                            }   

                            if(this.state.pos.top > (actualImage.clientHeight - 400) + 60){
                                top = (actualImage.clientHeight - 400) + 60
                            }                               

                            this.setState({ moving: false, pos: { left, top } })}
                        }
                        onMouseMove={(evt) => {
                            if(this.state.moving){
                                this.setState({ pos: { left: this.state.startPos.X - evt.screenX, top: this.state.startPos.Y - evt.screenY } })
                            }
                        }}
                        style={{ position: 'relative', width: '400px', height: '400px', overflow:'hidden' }}>
                        <img ref='currImg' onLoad={this.onImgLoad} draggable={false} src={this.props.archivo.url} style={{ ...styles.imageStyle, ...zoom, ...pos }}/>
                        <div style={styles.topStyle}></div>
                        <div style={styles.bottomStyle}>
                            <i 
                                onClick={() => { this.setState({ zoom: this.state.zoom - 4 })}}
                                className="material-icons" 
                                style={{ color: 'white', cursor: 'pointer'}}
                            >
                                remove
                            </i>
                            <i 
                                onClick={() => { this.setState({ zoom: this.state.zoom + 4 })}}
                                className="material-icons" 
                                style={{ color: 'white', cursor: 'pointer'}}
                            >
                                add
                            </i>
                        </div>
                        <div style={styles.leftStyle}></div>
                        <div style={styles.rightStyle}></div>
                    </div>
                    <div className="iconContainer">
                        <label id="lblUp" htmlFor="up_file_even" style={{ cursor:"pointer" }}>
                            Seleccionar...
                        </label>
                        <input onChange={(evt) => this.mostrarImagen(evt)} type="file" id="up_file_even" name="up_file_even" accept="image/*" style={{ display:'none' }} />
                    </div>                    
                </Modal>
            </div>
        );
    }
}


const styles ={
    imageStyle: {
        minWidth: '280px',
        minHeight: '280px',
        position: 'absolute',
        margin: 'auto',
        cursor: 'move'
    },
    topStyle: {
        position: 'absolute',
        width: '100%',
        height: '60px',
        background: 'rgba(50,50,50,0.8)',
        top: '0',
        left: '60px',
        width: '280px'
    },
    bottomStyle: {
        position: 'absolute',
        width: '100%',
        height: '60px',
        background: 'rgba(50,50,50,0.8)',
        bottom: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        left: '60px',
        width: '280px'
    },
    leftStyle: {
        position: 'absolute',
        width: '60px',
        height: '100%',
        background: 'rgba(50,50,50,0.8)',
        left: '0',
        top: '0'
    },
    rightStyle: {
        position: 'absolute',
        width: '60px',
        height: '100%',
        background: 'rgba(50,50,50,0.8)',
        right: '0',
        top: 0
    }    
}

export { ImagePicker };