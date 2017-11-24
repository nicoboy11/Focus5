class Config {}

Config.network = {
    server: 'http://localhost:8081/route/',
    wsServer: 'ws://localhost:9998/tarea',
    blured: 'thumbs/blured/',
    big: 'thumbs/big/',
    small: 'thumbs/small/'
};

Config.regex = {
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    textOnly: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]/g,
    extendedText: /[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ(){}'`.\s]/g
};


Config.colors = {
    mainDark: '#7B8092',
    secondText: '#D4D4DB',
    main: '#1abc9c',
    error: '#e74c3c',
    background: '#F7F9FB',
    clickable: '#3498db',
    elementBackground: '#FFF',
    priority: {
            0: '#D4D4DB',
            1: '#D4D4DB',
            2: '#D4D4DB',
            3: 'yellow',
            4: 'orange',
            5: '#e74c3c'
    },

    lightText: '#CED3D9',
    //darkMain: '#3457C3',
    mainText: '#FFF',
    alternateColor: '#08C2A5',
    veryLight: '#E1E4E8',
    contrastColor: '#32394A',
    contrastColorDark: '#2E3543',
    darkGray: '#343434'
};

const menu = [
        { uri: '/proyectos', nombre: 'Proyectos', icono: 'view_module' },
        { uri: '/chats', nombre: 'Chats', icono: 'chat_bubble_outline' },
        { uri: '/personal', nombre: 'Personal', icono: 'people_outline' },
        { uri: '/ajustes', nombre: 'Ajustes', icono: 'settings' }
];

Config.menu = menu;

const lang = {
    en: {   //Login Page
            email: 'Email',
            email_ph: 'Enter your email',
            password: 'Password',
            password_ph: 'Enter your password',
            login: 'Log in',
            forgot: 'Forgot password',
            signup: 'Sign up',
            invalidEmail: 'Invalid email address',
            loginFailed: 'Login failed. ',
            //Register Page
            names: 'Name(s)',
            firstLastName: 'Last name',    
            secondLastName: 'Second last name',
            dateOfBirth: 'Date of birth',
            phone: 'Phone',
            ext: 'Extension',
            mobile: 'Mobile',
            selectADate: 'Select a Date',
            passwordMissmatch: 'Password mismatch',
            passwordMissmatchMsg: 'The passwords are different',
            pickerTitle: 'Select an item',
            incompleteForm: 'Incomplete form',
            passwordProvided: 'A password must be provided',
            success: 'Success',
            accountCreated: 'The account was successfully created',
            //Profile
            contactInfo: 'Contact Information',
            personalInfo: 'Personal Information',
            securityInfo: 'Security',    
            incorrectData: 'The data provided is incorrect',
            atention: 'Atention',
            //PageTitles
            accountSettings: 'Account Settings',
            feed: 'Feed',
            profileImage: 'Profile Image',
            register: 'Register',
            logout: 'Logout',
            tasks: 'Tasks',
            //Task Card
            addTeam: '[Team]',
            addProject: '[Project]',
            newTask: 'New task',
            comment: 'Comment',
            teamSelect: 'Select a team',
            projectSelect: 'Select a project',
            finished: 'Finished',
            active: 'Active',
            days: {
                    0: 'Sunday',
                    1: 'Monday',
                    2: 'Tuesday',
                    3: 'Wednesday',
                    4: 'Thursday',
                    5: 'Friday',
                    6: 'Saturday'                            
            },
            month: {
                    0: 'Jan',
                    1: 'Feb',
                    2: 'Mar',
                    3: 'Apr',
                    4: 'May',
                    5: 'Jun',
                    6: 'Jul',
                    7: 'Aug',
                    8: 'Sep',
                    9: 'Oct',
                    10: 'Nov',
                    11: 'Dec'                            
            },
            editTask: 'Edit task',
            taskName: 'Name',
            taskDesc: 'Descripcion',
            taskStart: 'Start date',
            taskDue: 'Due date',
            //TimeSheet
            addCheck: 'Check in/out',
            timesheet: 'Timesheet',
            //Hierarchy
            newUserTitle: 'Users in the network',
            managePeople: 'Manage personnel',
            noPeople: 'No people to manage',
            mark: 'Mark',
            as: 'as:',
            myManager: 'My manager',
            mySubordinate: 'My subordinate',
            //General
            cancel: 'Cancel'   
    },
    es: {   //Login page
            email: 'Email',
            email_ph: 'Ingrese su email',
            password: 'Contraseña',
            password_ph: 'Ingrese su contraseña',
            login: 'Entrar',
            forgot: 'Olvidé mi contraseña',
            signup: 'Crear cuenta',
            invalidEmail: 'El email es inválido',
            loginFailed: 'Error de inicio de sesión.',
            //Register PAge
            names: 'Nombre(s)',
            firstLastName: 'Apellido Paterno',      
            secondLastName: 'Apellido Materno',
            dateOfBirth: 'Fecha de nacimiento',
            phone: 'Telefono',
            ext: 'Extensión',
            mobile: 'Celular',
            selectADate: 'Seleccione una fecha',
            passwordMissmatch: 'Contraseñas incorrectas',
            passwordMissmatchMsg: 'Las contraseñas no coinciden',
            pickerTitle: 'Seleccione un elemento',
            incompleteForm: 'Información incompleta',
            passwordProvided: 'Debe proporcionar una contraseña',
            success: 'Éxito',
            accountCreated: 'La cuenta fué creada con éxito',
            //Profile
            contactInfo: 'Información de Contacto',                
            personalInfo: 'Información Personal',        
            securityInfo: 'Seguridad',        
            incorrectData: 'La información proporcionada es incorrecta',
            atention: 'Atención',
            //PageTitles
            accountSettings: 'Configuración de la cuenta',
            feed: 'Actualizaciones',
            profileImage: 'Imagen de Perfil',
            register: 'Registrarse',
            logout: 'Salir',
            tasks: 'Tareas',
            //Task Card
            addTeam: '[Equipo]',
            addProject: '[Proyecto]',
            newTask: 'Nueva Tarea',
            comment: 'Comentar',
            teamSelect: 'Seleccione un Equipo',
            projectSelect: 'Seleccione un proyecto',
            finished: 'Terminada',
            active: 'Activa',                        
            days: {
                    0: 'Domingo',
                    1: 'Lunes',
                    2: 'Martes',
                    3: 'Miércoles',
                    4: 'Jueves',
                    5: 'Viernes',
                    6: 'Sábado'                            
            },
            month: {
                    0: 'Ene',
                    1: 'Feb',
                    2: 'Mar',
                    3: 'Abr',
                    4: 'May',
                    5: 'Jun',
                    6: 'Jul',
                    7: 'Aug',
                    8: 'Sep',
                    9: 'Oct',
                    10: 'Nov',
                    11: 'Dic'                            
            },
            editTask: 'Editar tarea',
            taskName: 'Nombre',
            taskDesc: 'Descripción',
            taskStart: 'Fecha de Inicio',
            taskDue: 'Fecha límite',
            //TimeSheet
            addCheck: 'Marcar entrada/salida',
            timesheet: 'Asistencia',
            //Hierarchy
            newUserTitle: 'Usuarios en la red',
            managePeople: 'Gestionar personal',
            noPeople: 'No hay personal para gestionar',
            mark: 'Marcar a',
            as: 'como:',
            myManager: 'Mi superior',
            mySubordinate: 'Mi subordinado',
            //General
            cancel: 'Cancelar'                              
    }

 };

Config.texts = lang.es;



export { Config };