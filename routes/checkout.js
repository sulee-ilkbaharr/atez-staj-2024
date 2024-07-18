var express = require('express');
var router = express.Router();
const db = require('../db/knex.db');
const verifyAuth = require('./auth');

router.post('/payment', verifyAuth, async function (req, res, next) {
    const { cardNumber, expiryDate, cvv, amount } = req.body;
    const user_email = req.user.email;
    try {
        const user = await db('users').select('*').where('email', user_email).first();
        if (!user) {
            return res.status(401).send('You have to be authorized first');
        }
        if (user.user_type !== 'user') {
            return res.status(400).send('Only the user can make payment');
        }

        // const products = await db('users').innerJoin('cart', 'cart.user_id', 'users.id').select('*');
        // console.log(products);

        const payment = db('payments').insert({ cardNumber, expiryDate, cvv, amount });
        console('payment')

        res.status.send({
            message: 'Payment is successful.',
            products
        })


    } catch (error) {
        res.status(400).send({
            message: 'Something is wrong'
        })

    }
});



module.exports = router;
