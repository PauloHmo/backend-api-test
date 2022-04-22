const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const rotausers = require('./routers/users');
const rotaprods = require('./routers/produtos');
// const rotaimgs = require('./routers/imagens');
// app.use('/api/uploads', express.static('uploads'));

app.use( bodyParser.urlencoded({ extended: false }) ); //fals eh so dados simples
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  // res.header('Content-Type', 'application/json; charset=UTF-8');      
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send({ });
  }
  next();
})
/* ==================================================================== */
app.use('/api/teste', (req, res, next) => {
  res.status(200).send({  mensagem : 'rota teste ola mundo' });
});
app.use('/api/users', rotausers);
app.use('/api/produtos', rotaprods);
// app.use('/api/imgs', rotaimgs);
/* ==================================================================== */
// Sem rota encontrada
app.use((req, res, next) => {
  const erro = new Error('Não encontrado');  erro.status = 404;    
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({ erro: { mensagem: error.message } });
});
/* ------------------------------------------- */
module.exports = app;