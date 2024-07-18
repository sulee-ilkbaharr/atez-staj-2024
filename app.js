const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var checkoutRouter = require('./routes/checkout');

var app = express();

// CORS middleware
app.use(cors()); // Cors middleware ini kullanmak gerekir çünkü böylelikle frontendden uygun porttan istekleri yollayabilirim!!!

// Diğer middleware'ler ve route tanımları
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter); // Dikkat: /checkout olarak düzeltilmiş

// 404 hatası yönetimi
app.use(function (req, res, next) {
  next(createError(404));
});

// Hata yönetimi
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error'); // veya JSON yanıtı olarak hata döndürebilirsiniz
});

module.exports = app;
