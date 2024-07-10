var express = require('express');
var router = express.Router();
const db = require('../db/knex.db');
const verifyAuth = require('./auth');

router.post('/add', verifyAuth, async (req, res) => {
    const user_email = req.user.email;
    const { id } = req.body;

    try {
        const user = await db('users').select('*').where('email', user_email).first();

        if (!user) {
            return res.status(400).send({ message: 'there is no such a user' });
        }


        if (user.user_type !== 'user') {
            return res.status(400).send({ message: ' only users can add porduct to card' });
        }


        const cartId = await db('cart').insert({ user_id: user.id, product_ids: id });

        return res.status(200).send({ message: 'The product added to the cart successfully' });

    } catch (error) {
        console.error('Hata:', error);
        return res.status(400).send({ message: 'Something wrong brother.' });
    }
});


router.delete('/delete', verifyAuth, async (req, res) => {
    const user_email = req.user.email;
    const { id } = req.body;

    try {
        const user = await db('users').select('*').where('email', user_email).first();

        if (!user) {
            return res.status(400).send({ message: 'there is no such a user' });
        }


        if (user.user_type !== 'user') {
            return res.status(400).send({ message: ' only users can delete porduct to card' });
        }


        await db('cart').select('*').where('product_ids', id).del();

        return res.status(200).send({
            message: 'The product deleted to the cart successfully'
        }

        );

    } catch (error) {
        console.error('Hata:', error);
        return res.status(400).send({ message: 'Something wrong brother.' });
    }
});


router.get('/list/:cartId', verifyAuth, async (req, res) => {
    const user_email = req.user.email;
    const { cartId } = req.params;

    try {
        const user = await db('users').select('*').where('email', user_email).first();

        if (!user) {
            return res.status(400).send({ message: 'there is no such a user' });
        }


        if (user.user_type !== 'user') {
            return res.status(400).send({ message: ' only users can list porduct with  given id' });
        }


        const cart = await db('cart').select('*').where('id', cartId).first();
        if (!cart) {
            res.status(400).send('There is no product such kind')
        }

        return res.status(200).send({
            message: 'succesfull',
            cart
        });

    } catch (error) {
        console.error('Hata:', error);
        return res.status(400).send({ message: 'Something wrong brother.' });
    }
});

router.get('/:userId', verifyAuth, async (req, res) => { ///list/:userId bu durumda hata alıyorum???
    const user_email = req.user.email;
    const { userId } = req.params;

    try {
        const user = await db('users').select('*').where('email', user_email).first();

        if (!user) {
            return res.status(400).send({ message: 'there is no such a user' });
        }


        if (user.user_type !== 'user') {
            return res.status(400).send({ message: ' only users can list porduct with  given id' });
        }


        const carts = await db('cart').innerJoin('users', 'users.id', 'cart.user_id').select('*').where('user_id', userId);
        console.log('CARTS:', carts);
        if (carts.length === 0) {
            return res.status(400).send('This user hast any cart ');
        }

        return res.status(200).send({
            message: 'succesfull',
            carts
        });

    } catch (error) {
        console.error('Hata:', error);
        return res.status(400).send({ message: 'Something wrong brother.' });
    }
});


module.exports = router;
