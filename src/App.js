import React, { Component } from 'react';
import './css/circle.css';
import './css/general.css';
import './css/w3.css';
import './css/animate.css';

import { Chats } from './pages';
import { MenuTop } from './components';
import MenuBar from './components/MenuBar';

import { Route, Router } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es'
import { 
  cargarPerfil, 
  filtraNotificaciones, 
  guardaRefs, 
  desseleccionarProyecto, 
  enviarSocket, 
  marcarLeida, 
  loginGoogle, 
  logoutGoogle,
  initGoogle, 
  googleStatus,
  setCalEvents,
  guardarTarea
} from './actions'
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux'

import Ajustes from './pages/Ajustes';
import Proyectos from './pages/Proyectos';
import Tareas from './pages/Tareas';
import Login from './pages/Login';
import Personal from './pages/Personal';

import 'react-datepicker/dist/react-datepicker.css';
import { Config } from './configuracion';

const { menu, network, keys } = Config;

const CLIENT_ID = keys.calendar;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar";
const OneSignal = [];


class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      datos: [],
      currentView: 'proyectos',
      sessionData: {}
    };
  }

  componentWillMount(){
    this.props.cargarPerfil();
    document.title = 'Focus';
    this.loadCalApi();
  }

  /** CALENDARIO
   * 
   */
    loadCalApi(){
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      document.body.appendChild(script);
      script.onload = () => {
        window.gapi.load('client:auth2', this.initClient.bind(this));
      }

      const scriptOS = document.createElement("script");
      scriptOS.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
      document.body.appendChild(script);
      scriptOS.onload = () => {
        
      }
    }

    initClient() {
        const me = this;
        window.gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        }).then(function () {

            me.props.initGoogle(window.gapi);
            // Listen for sign-in state changes.
            window.gapi.auth2.getAuthInstance().isSignedIn.listen(me.updateSigninStatus.bind(me));

            // Handle the initial sign-in state.
            me.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            this.props.loginGoogle();
            //this.listEvents();
        } else {
          this.props.logoutGoogle();
        }
    }  

    updateEvent({ txt_tarea, id_tarea, fec_limite, fec_limiteCal, eventId }){
      var event = {
          'summary': txt_tarea,
          'description': '[creado automaticamente por sistemafocus.com]-'+id_tarea,
          'start': {
          'dateTime': fec_limite.replace(" ","T") + '-06:00',
          'timeZone': 'America/Mexico_City'
          },
          'end': {
          'dateTime': fec_limiteCal.replace(" ","T") + '-06:00',
          'timeZone': 'America/Mexico_City'
          },
          'reminders': {
              'useDefault': true,
          }
      };

      var request = window.gapi.client.calendar.events.update({
          'calendarId': 'primary',
          'eventId': eventId,
          'resource': event
      });

      request.execute(function(event) {
          //console.log(event);
          //alert("agregado al calendario");
          //listEvents(true);
      });	    
    }

    listEvents() {
      const me = this;
      if(window.gapi.client.calendar === undefined){
        return;
      }

      window.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 250,
        'orderBy': 'startTime',
        'q': '[creado automaticamente por sistemafocus.com]'
      }).then(function(response) {
          const googleEvents = response.result.items;
          const list = [];

          //Agrego icono a la tarea
          if (googleEvents.length > 0) {
              for (let i = 0; i < googleEvents.length; i++) {
                list.push({ 
                  id_tarea: parseInt(googleEvents[i].description.split("-")[1]),
                  txt_tarea: googleEvents[i].summary,
                  fec_limite: googleEvents[i].start.dateTime,
                  fec_limiteCal: googleEvents[i].end.dateTime,
                  eventId: googleEvents[i].id,
                  updated: googleEvents[i].updated
                });
              }

              me.props.setCalEvents(list);
              //Checar tarea por tarea para buscar coincidencias
              for(const proyecto of me.props.proyectos){
                for(const tarea of proyecto.tareas){
                  
                    const tareaCal = list.filter(tar => tar.id_tarea == tarea.id_tarea);
                    const tareaNueva = { ...tarea };

                    //Si encuentro la tarea en el calendario
                    if(tareaCal.length){
                        const updated = moment(tareaCal[0].updated);
                        const fec_actualiza = moment(tarea.fec_actualiza);
                        
                        const duration = moment.duration(updated.diff(fec_actualiza))

                        if(duration.asMinutes() > 0){
                          tareaNueva.fec_limite = moment(tareaCal[0].fec_limite).format('YYYY-MM-DD HH:mm');
                          tareaNueva.fec_limiteCal = moment(tareaCal[0].fec_limiteCal).format('YYYY-MM-DD HH:mm');
                          tareaNueva.txt_tarea = tareaCal[0].txt_tarea;

                          me.props.guardarTarea(me.props.proyectos, tareaNueva.id_proyecto, tareaNueva);

                        } else if(duration.asMinutes() < 0) {
                          tareaNueva.eventId = tareaCal[0].eventId;
                          me.updateEvent(tareaNueva);
                        }                  
                    } else {
                        if(tarea.isCalendarSync == 1){
                          tareaNueva.isCalendarSync = 0;
                          me.props.guardarTarea(me.props.proyectos, tareaNueva.id_proyecto, tareaNueva);
                        }
                    }
                }
              }

          }
      });
    }

  /** PUSH NOTIFICATIONS
   * 
   */
    suscribir(){
      if(localStorage.length > 0){
        const sessionData = JSON.parse(localStorage.sessionData);
        if(sessionData.id_usuario !== undefined) {

            OneSignal.push(["init", {
                appId: "74944a56-7101-42b8-957e-e49cdc8a3cf6",
                autoRegister: true,
                httpPermissionRequest: {
                    enable: true
                },
                subdomainName: "sistemafocus",
                notificationClickHandlerMatch:"origin",
                /* Your other init options here */
            promptOptions: {
                    showCredit: false, // Hide Powered by OneSignal
                    actionMessage: 'quiere mostrar notificaciones:',
                    exampleNotificationTitleDesktop: 'Este es un ejemplo de una notificación',
                    exampleNotificationMessageDesktop: 'Las notificaciones van a aparecer en tu escritorio.',
                    exampleNotificationTitleMobile: ' Notificación de ejemplo',
                    exampleNotificationMessageMobile: 'Las notificaciones van a aparecer en tu dispositivo.',
                    exampleNotificationCaption: '',
                    acceptButtonText: 'Aceptar'.toUpperCase(),
                    cancelButtonText: 'No Gracias'.toUpperCase()
                },   
                notifyButton: {
                    /* Your other notify button settings here ... */
                    enable: true,
                    text: {
                        'tip.state.unsubscribed': 'Recibir notificaciones',
                        'tip.state.subscribed': "Notificaciones activadas",
                        'tip.state.blocked': "Has bloqueado las notificaciones",
                        'message.prenotify': 'Click para recibir notificaciones',
                        'message.action.subscribed': "Ahora puedes recibir notificaciones!",
                        'message.action.resubscribed': "Notificaciones activadas",
                        'message.action.unsubscribed': "Ya no recibirás notificaciones",
                        'dialog.main.title': 'Manejar notificaciones',
                        'dialog.main.button.subscribe': 'RECIBIR NOTIFICACIONES',
                        'dialog.main.button.unsubscribe': 'DEJAR DE RECIBIR NOTIFICACIONES',
                        'dialog.blocked.title': 'Desbloquear notificaciones',
                        'dialog.blocked.message': "Siga las instrucciones para recibir notificaciones:"
                    },
                    displayPredicate: function() {
                        return OneSignal.isPushNotificationsEnabled()
                            .then(function(isPushEnabled) {
                                /* The user is subscribed, so we want to return "false" to hide the notify button */
                                return !isPushEnabled;
                            });
                    },
                }
            }]);

            OneSignal.push(["getUserId", function(userId) {
                console.log("OneSignal User ID:", userId);
                const idOS = userId;
                
                //var datos = "accion=suscribe&plataforma=web&clave=" + userId + "&id_usuario=" + sess_id_usuario;

              /* $.ajax({    type:"POST",
                            url:rutaSelect,
                            beforeSend:function(){   },
                            complete:function(){},
                            data:datos,
                            async: true,
                            cache:false,
                            dataType:"text",
                            success:function(data)
                {
                        console.log(data);
                }});*/

            }]);
            
            
            OneSignal.push(["addListenerForNotificationOpened", function(data) {
                
                //notificaciones();

            }]);

        }
      }
    }   

  componentDidMount(){
    if(this.refs.ifmcontentstoprint !== undefined){
      this.props.guardaRefs(this.props.listaRef, this.refs.ifmcontentstoprint)
    }  
  }

  componentDidUpdate(){
      if(localStorage.length > 0 && localStorage.sessionData !== undefined){
        const sessionData = JSON.parse(localStorage.sessionData);
        // Cargar web sockets
        if(this.ws === undefined && sessionData.id_usuario !== undefined) {
          //WebSocket
          this.ws = new WebSocket(Config.network.wsServer);
          const me = this;

          this.ws.onmessage = (e) => {
              const data = JSON.parse(e.data);
              this.props.enviarSocket(data);

              if(data.accion === "enviar" && data.id_tarea === this.props.tareaActual.id_tarea){
                  const id_tarea = this.props.tareaActual.id_tarea;
              }
          };

          this.ws.onopen = function(){
              this.send(`{"accion":"conectar",
              "room":"tareas",
              "mensaje":"conectado",
              "id_usuario":${sessionData.id_usuario}}`)
          }   
        }    
        
        //Cargar push notifications
        this.suscribir();
      }

      if(this.props.proyectos.length > 0 && this.props.events.length == 0 && window.gapi.auth2.getAuthInstance().isSignedIn.get()){
        this.listEvents();
      }
 
  }

  renderMenu(jsx){
    /*if(this.props.sessionData === null){
      return null;
    }*/

    return jsx;
  }

  render() {

    let title = "";
    let breadCrumb = "";

    const currentRoute = window.location.pathname;
    let current = menu.filter(
        obj => currentRoute.includes(obj.uri)
    )[0];    

    if(current !== undefined) {
      switch(current.nombre) {
        case "Proyectos": 
          if(this.props.proyectoActual.id_proyecto === undefined) {
            title = "Proyectos";
          } else {
            title = this.props.proyectoActual.txt_proyecto;
            breadCrumb = "Proyectos";
          }
          break;
        case "Chats":
          title = "Chats"
          break;
        case "Personal":
          title = "Personal";
          break;
        case "Ajustes":
          title = "Ajustes";
          break;
        default:
          break;
      }
    } else {
      current = { nombre: '' }
    }

    let notificaciones = 0;
    for(let proyecto of this.props.proyectos){
      for(let tarea of proyecto.tareas){
        notificaciones += tarea.notificaciones;
      }
    }
      
    return (
          <div className="App">
            <iframe ref="ifmcontentstoprint" id="ifmcontentstoprint" style={{height: '0px', width: '0px', position: 'absolute'}}></iframe>
            <div id="main">
                <Route exact path={`${network.basename}/`} component={Login} />
                <Route exact path={`${network.basename}/proyectos`} render={(props) =>(
                  <Proyectos datos={this.state.datos} />
                )} />
                <Route path={`${network.basename}/proyectos/:id`} render={(props) => (
                  <Tareas ws={this.ws} />
                )} />              
                <Route path={`${network.basename}/chats`} component={Chats} />
                <Route path={`${network.basename}/personal`} component={Personal} />
                <Route path={`${network.basename}/ajustes`} component={Ajustes} />
            </div>
            {this.renderMenu(<MenuTop 
                                currentTitle={title} 
                                breadCrumb={breadCrumb} 
                                notificaciones={notificaciones}
                                notifSelected={this.props.fltrNtf}
                                refs2Print={this.props.listaRef}
                                onLogout={() =>{
                                  localStorage.removeItem("sessionData");
                                  window.location = `${network.basename}/`;
                                }}
                                onClick={() =>{
                                    this.props.changePage(`${network.basename}/proyectos`);
                                    this.props.desseleccionarProyecto();
                                }}
                                onNotifClick={() => {
                                  if(!this.props.fltrNtf){
                                    window.location.hash = '#notificaciones'
                                  } else {
                                    window.location.hash = ''
                                  }
                                  this.props.filtraNotificaciones(!this.props.fltrNtf);
                                }}
                            />)}
            {this.renderMenu(<MenuBar currentMenu={current.nombre} />)}
          </div>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  cargarPerfil,
  filtraNotificaciones,
  guardaRefs,
  desseleccionarProyecto,
  enviarSocket,
  marcarLeida,
  loginGoogle,
  logoutGoogle,
  initGoogle,
  googleStatus,
  setCalEvents,
  guardarTarea,
  changePage: (location) => push(location)
}, dispatch)

const mapStateToProps = state => {
  return { 
      proyectos: state.listaProyectos.proyectos,
      proyectoActual: state.listaProyectos.tmpProyecto,
      tareaActual: state.listaProyectos.tareaActual,
      perfil: state.perfil,
      fltrNtf: state.listaProyectos.fltrNtf,
      listaRef: state.listaProyectos.listaRef,
      events: state.login.events
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));