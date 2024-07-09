var express = require('express');
const db = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const verifyAuth = require('./auth');
const jwt = require('jsonwebtoken');
var router = express.Router();

/* GET users with user own token. */
router.get('/', verifyAuth, async function (req, res, next) {
  const user = req.user;
  const usersData = await db('users').select('*');
  res.json(usersData);
});

/* GET users with given id. */
router.get('/:id', verifyAuth, async function (req, res, next) {
  const user_id = req.params.id;
  try {
    const user = await db('users').select('*').where('id', user_id).first();

    if (!user) {
      return res.status(400).send({
        message: 'there is no user with given id'
      });
    }

    if (user.email !== req.user.email) {
      // tokenı alınan userın email ile aynı değil ise 
      return res.status(400).send({
        message: 'You are not authorized'
      });
    }
    return res.status(200).send({
      message: 'succesfull',
      user
    });

  } catch (error) {
    return res.status(400).send({
      message: 'there is an error for to find user withb given id'
    });

  }
});

/* user can delete their own account */
router.delete('/delete/:id', verifyAuth, async (req, res, next) => {
  const user_id = req.params.id;

  try {
    const user = await db('users').select('*').where('id', user_id).first();
    if (!user) {
      return res.status(400).send({
        message: 'There is no user with the given id'
      });
    }

    if (user.email !== req.user.email) {
      return res.status(400).send({
        message: 'You are not authorized to delete this account'
      });
    }

    await db('users').where('id', user_id).del();

    return res.status(200).send({
      message: 'Your account has been deleted successfully'
    });
  } catch (error) {
    return res.status(500).send({
      message: 'An error occurred while deleting the account'
    });
  }
});


router.post('/signup', async (req, res, next) => {
  const { username, password, name, surname, email, user_type } = req.body;
  //user_type= user | company      =>usertype company olan firmalar sadece ürün ekleyebilir.
  if (!email && !password) {
    return res.status(400).send({
      message: 'email or password missing',
    });
  };

  const user = await db('users').select('*').where('email', email).first();

  if (user) {
    return res.status(400).send({
      message: 'you are already have an account',
    });
  };

  // eğer user varsa parolayı hashlememiz lazım
  const cryptedPassword = await bcrypt.hash(password, 8);

  await db('users').insert(
    { username, password: cryptedPassword, name, surname, email, user_type }
  )


  res.status(200).send({
    message: 'user has successfully created',
  })



}
)

router.post('/login', async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: 'email or password missing'
    })
  };

  const user = await db('users').select('*').where('email', email).first();

  if (!user) {
    return res.status(400).send({
      message: 'There is no account with given email'
    })
  };

  console.log('USER:', user)

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).send('email or passord is wrong')
  }

  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY); //email üzerinden hızlıca bulabiliz
  return res.status(200).send({
    message: 'successufy logged in',
    token
  })

})



//asynchronous
//async-await
//Promise
// callback
module.exports = router;
