const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('../mysql');
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
const checkUserExist = async (email, adm) => {
  const tb = (!adm || adm === '') ? 'vw_clients' : 'vw_admins';
  const query = `SELECT * FROM ${tb} WHERE email = ?;`;
  try {
    const result =  await mysql.execute(query, [email]);
    if(result.length > 0){ return result[0]; }    
    return false;
  } catch (error) { return { erro: error } }  
}
/* --------------------------------------- */
const userlogin = (req, res, usertype) => {
  const errMsg = faltaCampos([ 'email', 'senha' ], req.body);
  if (errMsg) { return res.status(500).send({ erro: errMsg }) }
  checkUserExist(req.body.email, usertype).then((user) => { 
    if (!user) { return res.status(401).send({ erro: "Usuário não Encontrado!" }); }
    bcrypt.compare(req.body.senha, user.senha, (errComp, result) => {
      if (errComp) { return res.status(500).send({ erro: "Falha na Autenticação!" }) }
      if(result) { 
        const obuser = { id:'', nome: user.nome, email: req.body.email }
        obuser.id = (usertype === 'adm') ? user?.idadm : user?.iduser ;
        if(user?.admlvl){ obuser.admlvl = user.admlvl; }         
        const token = jwt.sign(obuser, process.env.JWT_KEY, {expiresIn: 300})
        //process.env.JWT_KEY, { expiresIn: "1h" })
        return res.status(201).send({ msg:'USUÁRIO AUTORIZADO', ...obuser, token: token }) 
      }
      return res.status(401).send({ erro: "Erro de Autenticação! " + req.body.email })
    });
  });
}
/* --------------------------------------- */
router.post('/admcadastro', (req, res, next) => {
  const errMsg = faltaCampos([ 'admlvl', 'nome', 'email', 'senha' ], req.body);
  if (errMsg) { return res.status(500).send({ erro: errMsg }) }
  const { admlvl, nome, email, senha } = req.body;
  checkUserExist(email, 'adm').then((user) => { 
    if (user) { return res.status(401).send({ erro: "Usuario já Cadastrado!" }); }
    bcrypt.hash(senha, 10, (errBcrypt, hash) => {
      if (errBcrypt) { return res.status(500).send({ erro: errBcrypt }); }
      const query = 'INSERT INTO tbadmins (lvl_adm, nome_adm, mail_adm, pass_adm) VALUES (?,?,?,?)';
      try {
        const result =  mysql.execute(query, [admlvl, nome, email, hash]);
        if (result.affectedRows < 1) { return res.status(401).send({ erro: "Erro ao Cadastrar Admin!" }) }
        return res.status(201).send({
          msg : `ADMIN ${nome} CADASTRADO COM SUCESSO!`, nome: nome, id: result.insertId
        })
      } catch (error) { return { erro: error } } 
    });
  })
});
/* --------------------------------------- */
router.post('/cadastro', (req, res, next) => {
  const errMsg = faltaCampos([ 'nome', 'email', 'senha' ], req.body);
  if (errMsg) { return res.status(500).send({ erro: errMsg }) }
  const { nome, email, senha } = req.body;
  checkUserExist(email).then((user) => { 
    if (user) { return res.status(401).send({ erro: "Usuario já Cadastrado!" }); }
    bcrypt.hash(senha, 10, (errBcrypt, hash) => {
      if (errBcrypt) { return res.status(500).send({ erro: errBcrypt }); }
      const query = 'INSERT INTO clients (nome_cli, mail_cli, pass_cli) VALUES (?,?,?)';
      try {
        const result =  mysql.execute(query, [nome, email, hash]);
        if (result.affectedRows < 1) { return res.status(401).send({ erro: "Erro ao Cadastrar Usuário!" }) }
        return res.status(201).send({
          msg : `USUÁRIO ${nome} CADASTRADO COM SUCESSO!`, nome: nome, id: result.insertId 
        })
      } catch (error) { return { erro: error } } 
    });
  })
});
/* --------------------------------------- */
router.post('/admlogin', (req, res, next) => {
  return userlogin(req, res, 'adm');
});
/* --------------------------------------- */
router.post('/login', (req, res, next) => {
  return userlogin(req, res);
});
/* --------------------------------------- */
router.get('/needtoken', login.admrequired, (req, res) => {
  console.log('xxx', );
  return res.status(200).send({ id: req.usuario.iduser, nome: req.usuario.nome, response : 'Usuário AUTORIZADO' });
});
/* --------------------------------------- */
router.get('/revalidateuser', login.obrigatorio, (req, res) => {
  if (!req.usuario) {return res.status(401).send({ erro : 'Erro de Autenticação' }); }
  const user = { id: req.usuario.iduser, nome: req.usuario.nome }  
  return res.status(200).send({ msg : 'Usuário AUTORIZADO', user: user });
});
/* --------------------------------------- */
module.exports = router;