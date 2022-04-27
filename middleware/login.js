const jwt = require('jsonwebtoken');

/* --------------------------------------- */
const errMsg = { erro: "Falha de Autenticação!" } 
/* --------------------------------------- */
const verifyToken = (token) => {
  if(!token){ return false; }

  try {
    const decode = jwt.verify(token, process.env.JWT_KEY); 
    return decode;
  } catch (error) { 
    return false;
  }
}
/* --------------------------------------- */
const checkRequired = (req, type, adminlvl) => {
  if (!req.headers.authorization) { return false;  }
  const ret = verifyToken(req.headers.authorization?.split(' ')[1]);
  if(ret && (ret?.admlvl || type !== 'adm')){ 
    if (adminlvl) {
      if (!ret?.admlvl || adminlvl < ret?.admlvl) { return false; }  
    }
    req.usuario = ret; 
    return true; 
  } 
  return false;
}
/* --------------------------------------- */
exports.admlvlOneRequired = (req, res, next) => {
  if (checkRequired(req, 'adm', 1)) {
    return next();
  }
  return res.status(401).send(errMsg); 
}
/* --------------------------------------- */
exports.admlvlTwoRequired = (req, res, next) => {
  if (checkRequired(req, 'adm', 2)) {
    return next();
  }
  return res.status(401).send(errMsg); 
}
/* --------------------------------------- */
exports.admrequired = (req, res, next) => {
  if (checkRequired(req, 'adm')) {
    return next();
  }
  return res.status(401).send(errMsg); 
}
/* --------------------------------------- */
exports.required = (req, res, next) => {
  if (checkRequired(req, 'client')) {
    return next();
  }
  return res.status(401).send(errMsg); 
}
/* --------------------------------------- */
exports.optional = (req, res, next) => {
  checkRequired(req, 'client');
  next();  
}
/* --------------------------------------- */
exports.obrigatorio = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = decode;
    next();
  } catch (error) {
    return res.status(401).send({ erro: "Falha de Autenticação!"})
  }
}
/* --------------------------------------- */
exports.opcional = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.usuario = decode;
    next();
  } catch (error) {
    next();
  }
}