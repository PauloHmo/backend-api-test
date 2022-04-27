const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('../mysql');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');

const tbs = ['clients', 'tbadmins', 'vw_clients', 'vw_admins']

/* --------------------------------------- */
const faltaCampos = (campos, body) => {
  for (const cp of campos) {
    if (!(cp in body)) {  return ("Campo " + cp + " Obrigatório!"); }
  }
  return false;
}
/* --------------------------------------- */
const checkUserExist = async (email, adm) => {
  const tb = (!adm || adm !== 'adm') ? 'vw_clients' : 'vw_admins';
  const query = `SELECT * FROM ${tb} WHERE email = ?;`;
  try {
    const result =  await mysql.execute(query, [email]);
    if(result.length > 0){ return result[0]; }    
    return false;
  } catch (error) { return { erro: error } }  
}
/* --------------------------------------- */
const userCadastro = async (req, res, usertype) => {
  const isAdm = (usertype === 'adm' && req.url.includes('adm'));
  const cpsVw = isAdm ? [ 'admlvl', 'nome', 'email', 'senha' ] : [ 'nome', 'email', 'senha' ];
  const errMsg = faltaCampos(cpsVw, req.body);
  if (errMsg) { return res.status(500).send({ erro: errMsg }) }

  const user = await checkUserExist(req.body.email, usertype);
  if (user) { return res.status(401).send({ erro: "Usuário já Cadastrado!"}); }

  bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
    if (errBcrypt) { return res.status(500).send({ erro: errBcrypt }); }
    const query = isAdm ? 
    'INSERT INTO tbadmins (lvl_adm, nome_adm, mail_adm, pass_adm) VALUES (?,?,?,?)' :
    'INSERT INTO clients (nome_cli, mail_cli, pass_cli) VALUES (?,?,?)';
    const { admlvl, nome, email } = req.body;
    const params = isAdm ? [admlvl, nome, email, hash] : [nome, email, hash];
    mysql.execute(query, params).then((result) => { 
      if (!result || result.affectedRows < 1) { 
        return res.status(401).send({ erro: "Erro ao Cadastrar Usuário!" }); 
      }
      const resp = {
        msg : 'USUÁRIO CADASTRADO COM SUCESSO!', 
        id: result.insertId, 
        nome: nome,
        usertype : isAdm ? 'admin' : 'client'
      }
      return res.status(201).send(resp);
    }).catch(err => {
      return res.status(401).send({ erro: "Erro ao Cadastrar Usuário!" });
    });

  });

}
/* --------------------------------------- */
router.post('/admcadastro', (req, res, next) => {
  return userCadastro(req, res, 'adm');
});
/* --------------------------------------- */
router.post('/cadastro', (req, res, next) => {
  return userCadastro(req, res, 'client');
});
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
router.post('/admlogin', (req, res, next) => {
  return userlogin(req, res, 'adm');
});
/* --------------------------------------- */
router.post('/login', (req, res, next) => {
  return userlogin(req, res);
});
/* --------------------------------------- */
router.get('/needtoken', login.admrequired, (req, res) => {
  
  if (!req.usuario) {return res.status(401).send({ erro : 'Erro de Autenticação' }); } 
  const usertype = (!req.usuario?.admlvl) ? 'client' : 'admin';
  const user = { 
    msg : 'Usuário AUTORIZADO', 
    id: req.usuario?.id, 
    nome: req.usuario?.nome,
    email: req.usuario?.email,
    usertype: usertype,
    admlvl: req.usuario?.admlvl 
  }
  return res.status(200).send(user);
});
/* --------------------------------------- */
router.get('/revalidateuser', login.obrigatorio, (req, res) => {
  console.log('revalidateuser', );
  if (!req.usuario) {return res.status(401).send({ erro : 'Erro de Autenticação' }); }
  const usertype = (!req.usuario?.admlvl) ? 'client' : 'admin';
  const user = { 
    id: req.usuario?.id, 
    nome: req.usuario?.nome,
    email: req.usuario?.email,
    usertype: usertype,
    admlvl: req.usuario?.admlvl 
  }
  return res.status(200).send({ msg : 'Usuário AUTORIZADO', user: user });
});
/* --------------------------------------- */
module.exports = router;