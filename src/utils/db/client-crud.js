const pool = require('../../dbshop');
const { passwordEncrypt } = require('../../security/encrypt');


const getAllClients = () =>{
    return new Promise( async (resolve, reject) => {
        const clients = await pool.query('SELECT * FROM clientes LIMIT 100');
        return resolve(clients);
    });
};

const showClient = (telefono) => {
    return new Promise(async(resolve, reject) => {
      const userData = await pool.query('SELECT * FROM clientes WHERE id = ?', [telefono]);
      resolve(userData[0]);
    });
};

const createClient = (telefono, nombrecompleto, localidad, direccion, password) => {
    const userData = {
        telefono: telefono,
        nombrecompleto: nombrecompleto,
        localidad: localidad,
        direccion: direccion,
        password: passwordEncrypt(password)
    };
    return new Promise(async(resolve, reject) => {
      await pool.query('INSERT INTO clientes(id, nombrecompleto, localidad, direccion, password) VALUES(?, ?, ?, ?, ?)',
            [userData.telefono, userData.nombrecompleto, userData.localidad, userData.direccion, userData.password],
                (err, res) => (res) ? resolve(true) : resolve(false) ? err : reject(err));
    });
};

const updateClient = (telefono, nombrecompleto, localidad, direccion, password) => new Promise(async(resolve, reject) => {
    const userData = {
        nombrecompleto: nombrecompleto,
        localidad: Number(localidad),
        direccion: direccion,
        password: passwordEncrypt(password)
    };
    await pool.query('UPDATE clientes SET nombrecompleto = ?, localidad = ?, direccion = ?, password = ? WHERE id = ?',
        [userData.nombrecompleto, userData.localidad, userData.direccion, userData.password, telefono],
            (err, res) => (res) ? resolve(true): resolve(false) ? (err) : reject(err));
});

module.exports = {
    createClient,
    updateClient,
    showClient,
    getAllClients
}