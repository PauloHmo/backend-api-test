const jwt = require('jsonwebtoken');

const padrao = (token) => {
  try {
    const decode = jwt.verify(token, process.env.JWT_KEY); return decode;
  } catch (error) { return { erro: "Falha de Autenticação!"}  }
}

exports.admrequired = (req, res, next) => {
  const ret = padrao(req.headers.authorization.split(' ')[1]);
  if (ret?.erro || !ret?.admlvl) { return res.status(401).send({ erro: ret?.erro ?? 'Not Found'}); }
  req.usuario = ret;
  next();
}

exports.required = (req, res, next) => {
  const ret = padrao(req.headers.authorization.split(' ')[1]);
  if (ret?.erro) { return res.status(401).send(ret); }
  req.usuario = ret;
  next();  
}

exports.optional = (req, res, next) => {
  const ret = padrao(req.headers.authorization.split(' ')[1]);
  if (!ret?.erro) { req.usuario = ret; }  
  next();  
}

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