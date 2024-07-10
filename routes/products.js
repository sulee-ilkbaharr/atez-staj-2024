var express = require('express');
const verifyAuth = require('./auth');
var router = express.Router();
const db = require('../db/knex.db');

router.post('/add', verifyAuth, async function (req, res, next) {
    const { product_name, description, price } = req.body;
    const email = req.user.email;

    try {
        const user = await db('users').select('*').where('email', email);
        if (!user) {
            return res.status(400).send('There is no such a user');
        }

        if (user.user_type === 'user') { // COMPANY STRİNG OLARAK ALDIM. DİĞER TÜRLÜ HATA VERİYOR AMA USER_TYPE KISMINI ENUM OLARAK NASIL ATABİLİRİZ?
            return res.status(400).send({
                message: 'Users cannot add product',
                user
            });
        }

        const product = await db('products').insert({ product_name, description, price });

        return res.status(200).send({
            message: 'product has been added successfully',
            product
        });

    } catch (error) {
        res.status(400).send('There is an error', error)
    }
});

router.patch('/update/:id', verifyAuth, async function (req, res, next) {
    const { product_name, description, price } = req.body;
    const email = req.user.email;
    const id = req.params.id;

    try {
        const user = await db('users').select('*').where('email', email).first();
        if (!user) {
            return res.status(400).send('There is no such a user');
        }

        if (user.user_type === 'user') { // COMPANY STRİNG OLARAK ALDIM. DİĞER TÜRLÜ HATA VERİYOR AMA USER_TYPE KISMINI ENUM OLARAK NASIL ATABİLİRİZ?
            return res.status(400).send({
                message: 'Users cannot update product',
                user
            });
        }

        const product = await db('products').select('*').where('id', id).first();
        if (!product) {
            return res.status(400).send('there is no product with this given id');
        }
        const updated_product = await db('products').select('*').where('id', id).update({ product_name, description, price });

        return res.status(200).send({
            message: 'product has been updated successfully',
            product: product[0]
        });

    } catch (error) {
        res.status(400).send('There is an error')
    }
});

router.delete('/delete/:id', verifyAuth, async (req, res, next) => {
    const product_id = req.params.id;
    const email = req.user.email;

    try {
        const product = db('products').select('*').where('id', product_id).first();
        const user = db('users').select('*').where('email', email).first();
        if (!product) {
            return res.status(400).send({
                message: 'There is no product with the given id'
            });
        }
        if (!user) {//gerekli mi bilemiyorum ama yazmakta fayda var
            return res.status(400).send({
                message: 'There is no user with the given id'
            });
        }

        if (user.user_type === 'user') {
            return res.status(400).send('user cannot delete a product.')
        }

        await db('products').where('id', product_id).del();

        return res.status(200).send({
            message: 'Product has been deleted successfully'
        });
    } catch (error) {
        return res.status(500).send({
            message: 'An error occurred while deleting the product'
        });
    }
});


router.get('/', verifyAuth, async function (req, res, next) {
    const user = req.user;
    const productsData = await db('products').select('*');
    res.json(productsData);
});



/*serach with porduct id*/
router.get('/:id', verifyAuth, async function (req, res, next) {
    const user_email = req.user.email;
    const product_id = req.params.id;
    console.log(user_email);
    console.log(product_id);
    try {
        const user = await db('users').select('*').where('email', user_email).first();
        if (!user) {
            res.status(400).send({
                message: 'You are not authorized'
            })
        }

        const product = await db('products').select('*').where('id', product_id).first();
        if (!product) {
            return res.status(400).send({
                message: 'there is no product with given id'
            });
        }

        return res.status(200).send({
            message: 'succesfull',
            product
        });

    } catch (error) {
        return res.status(400).send({
            message: 'there is an error for to find product with given id'
        });

    }
});


router.get('/list/:searchParam', verifyAuth, async (req, res, next) => {
    const user_email = req.user.email;
    const searchParam = req.params.searchParam;
    console.log('USER_EMAİL:', user_email);

    try {
        const user = await db('users').select('*').where('email', user_email).first();
        if (!user) {
            return res.status(400).send('You have to be authorize first');
        }

        const product = await db('products').select('*').where('product_name', 'like', `%${searchParam}%`).first();
        if (!product) {
            return res.status(400).send('There is no product with this search parameter');
        }

        return res.status(200).send({
            message: 'Then product has been found according to the given search parameter.',
            product
        });


    } catch (error) {
        res.status(400).send({
            message: 'UPPSS, something seems wrong!!'
        });

    }

});



module.exports = router;