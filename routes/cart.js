var express = require('express');
var router = express.Router();
const db = require('../db/knex.db');
const verifyAuth = require('./auth');
const { route } = require('./products');

/*user can create cart*/
router.post('/add', verifyAuth, async function (req, res, next) {
    const user_email = req.user.email;
    console.log('user_email:', user_email);



    try {
        //check auth
        const user = await db('users').select('*').where('email', user_email).first();
        if (!user) {
            return res.status(400).send({
                message: 'You should be authorize first.'
            });
        }

        //chech user_type
        if (user.user_type !== 'user') {
            return res.status(400).send({
                message: 'Only the users can create cart and add produts to this cart.'
            })
        }

        // cheach if the user created cart befare
        const cart = await db('cart').innerJoin('users', 'users.id', 'cart.user_id').select('*').where('email', user_email);
        if (cart.length !== 0) {
             return res.status(400).send({
                message: 'user already has a  cart.',
                cart
            })
        }

        //a create cart
        const newCart = await db('cart').insert({ user_id: user.id });
        return res.status(200).send({
            message: 'cart added succeffuly',
            newCart
        })
    } catch (error) {
        res.status(400).send({
            message: 'Something is wrong to add cart.'
        })

    }
});



router.post('/addproduct', verifyAuth,);

router.delete('/delete', verifyAuth, async (req, res, next) => {
    const user_email = req.user.email;

})


module.exports = router;

