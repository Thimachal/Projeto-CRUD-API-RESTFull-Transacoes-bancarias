const {query} = require('../database/connection');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../jwt_secret');

const filter = async (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({mensagem: 'Não autorizado'});
    }
    
    try {
        const token = authorization.replace('Bearer ', '').trim();
        const {id} = jwt.verify(token, jwtSecret);
        const{rowCount, rows} = await query('select * from usuarios where id = $1', [id]);

        if(rowCount <= 0){
            return res.status(401).json({mensagem: 'Não autorizado'});
        }

        const [user] = rows;

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({mensagem: 'Não autorizadoooo'});
    }

};

module.exports = {filter};