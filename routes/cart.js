var express = require('express');
var router = express.Router();
const db = require('../db/knex.db');
const verifyAuth = require('./auth');

router.post('/add', verifyAuth, async function (req, res, next) {
    const user_email = req.user.email;
    console.log('user_email:', user_email);

    try {
        const user = await db('users').select('*').where('email', user_email).first();
        console.log('USER:', user);
        if (!user) {
            return res.status(400).send({
                message: 'You should be authorize first.'
            });
        }
        if (user.user_type !== 'user') {
            return res.status(400).send({
                message: 'Only the users can add cart.'
            })
        }

        const cart = await db('cart').insert({ user_id: user.id });
        return res.status(200).send({
            message: 'cart added succeffuly',
            cart
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something is wrong to add cart.'
        })

    }
});



module.exports = router;

