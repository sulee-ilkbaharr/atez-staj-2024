var express = require('express');
const db = require('../db/knex.db');
const bcrypt = require('bcryptjs');
const verifyAuth = require('./auth');
const jwt = require('jsonwebtoken');
var router = express.Router();

/* GET users listing. */
router.get('/', verifyAuth, async function (req, res, next) {
  const user = req.user;
  const usersData = await db('users').select('*');
  res.json(usersData);
});

/* GET users listing. */
router.get('/:id', async function (req, res, next) {
  const usersData = await db('users').select('*');
  res.json(usersData);
});


router.post('/signup', async (req, res, next) => {
  const { username, password, name, surname, email } = req.body;
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
    { username, password: cryptedPassword, name, surname, email }
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
