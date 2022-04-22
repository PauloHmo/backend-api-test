const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('../mysql').pool;
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');

/* --------------------------------------- */
const faltaCampos = (campos, body) => {
  for (const cp of campos) {
    if (!(cp in body)) {  return ("Campo " + cp + " Obrigatório!"); }
  }
  return false;
}
/* --------------------------------------- */
router.post('/cadastro', (req, res, next) => {
  const requeridos = [ 'nome', 'email', 'senha' ];
  const errMsg = faltaCampos(requeridos, req.body);
  if (errMsg) { return res.status(500).send({ erro: errMsg }) }
  const nome = req.body.nome;
  const email = req.body.email;

  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ erro: error}) }
    const query = 'SELECT * FROM vw_clients WHERE email = ?;';

    conn.query( query, [email], (error, results, fields) => {
      if (results.length > 0 || error) { 
        conn.release(); 
        return (error) ? res.status(500).send({erro: error}) : res.status(401).send({ erro: "Usuario já Cadastrado!"});
      } else {
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
          if (errBcrypt) { conn.release(); return res.status(500).send({ erro: errBcrypt }); }
          conn.query(
            'INSERT INTO clients (nome_cli, mail_cli, pass_cli) VALUES (?,?,?)',
            [req.body.nome, req.body.email, hash],
            (error, resultado, field) => {
              conn.release();
              if (error) { return res.status(500).send({ erro: error, response: null }) } 
              res.status(201).send({
                msg : `CLIENTE ${nome} CADASTRADO COM SUCESSO!`,
                nome: nome,
                id: resultado.insertId
              })
            }
          )
        });
      }
    });

  });

});
/* --------------------------------------- */
router.post('/login', (req, res, next) => {
  const requeridos = [ 'email', 'senha' ];
  const errMsg = faltaCampos(requeridos, req.body);
  if (errMsg) { return res.status(500).send({ erro: errMsg }) }
  const email = req.body.email;

  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ erro: error}) }
    const query = 'SELECT * FROM vw_clients WHERE email = ?;';

    conn.query( query, [email], (error, results, fields) => {
      conn.release();
      if (error) { return res.status(500).send({ erro: error}) }
      if (results.length < 1) { 
        return res.status(401).send({ erro: "Usuário não Encontrado!"}) 
      } 

      bcrypt.compare(req.body.senha, results[0].senha, (errComp, result) => {
        if (errComp) { return res.status(500).send({ erro: "Falha na Autenticação!" }) }
        if(result) { 
          const token = jwt.sign({
            iduser: results[0].iduser, nome: results[0].nome, email: results[0].email            
          }, process.env.JWT_KEY, {expiresIn: "1h"})
          //process.env.JWT_KEY, {expiresIn: 300})
          //process.env.JWT_KEY, { expiresIn: "1h" })
          return res.status(201).send({ msg:'CLIENTE AUTORIZADO', id: results[0].iduser, nome: results[0].nome, token: token }) 
        }
        return res.status(401).send({ erro: "Erro de Autenticação!" })
      });
    });
  });

});
/* --------------------------------------- */
router.get('/needtoken', login.obrigatorio, (req, res) => {
  return res.status(200).send({ response : 'Usuário AUTORIZADO' });
});
/* --------------------------------------- */
router.get('/revalidateuser', login.obrigatorio, (req, res) => {
  if (!req.usuario) {return res.status(401).send({ erro : 'Erro de Autenticação' }); }
  const user = { id: req.usuario.iduser, nome: req.usuario.nome }  
  return res.status(200).send({ msg : 'Usuário AUTORIZADO', user: user });
});
/* --------------------------------------- */
module.exports = router;