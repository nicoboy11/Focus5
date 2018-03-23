import faker from 'faker';

export const generarUser = () => ({
    id_usuario: faker.random.number(),
    id_usuario_superior: faker.random.number(),
    clave: faker.random.alphaNumeric(),
    role_id: faker.random.number(),
    txt_login: faker.internet.userName(),
    txt_usuario: faker.internet.userName(),
    txt_abbr:faker.random.alphaNumeric(2),
    color: faker.internet.color(),
    sn_imagen: faker.random.boolean(),
    sn_espadre: faker.random.boolean(),
    ultimoVisto: faker.date.recent(),
    txt_email: faker.internet.email(),
    //Avatar stuff
    avatar: faker.internet.avatar(), 
    size: 'small', 
    flexDirection: 'row', 
    textStyle: {}, 
    avatarURL: faker.internet.avatar(),
    style: {}
});

export const generarUserList = (count = 50) => {
    const usuarios = [];
    for(let i = 0; i < count; i++){
        usuarios.push(generarUser());
    }
    return usuarios;
};