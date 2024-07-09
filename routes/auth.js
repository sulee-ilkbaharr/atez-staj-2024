const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', ''); //bearer token 'dan bearer kısmı lazım değil sadece token kısmı lazım

    if (!token) {
        res.status(401).send({
            message: 'Acces denied , no token provided'
        })
    };
    try {
        const decodedtoken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedtoken;
        next();
    } catch (error) {
        res.status(400).send('invalid token');

    }

}


module.exports = verifyAuth;