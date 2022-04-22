const mysql = require('../mysql');
const fs = require('fs');
//#region ======================== CATEGS ================================
const faltaCampos = (campos, body) => {
  for (const cp of campos) {
    if (!(cp in body)) {  return ("Campo " + cp + " Obrigatório!"); }
  }
  return false;
}
/* --------------------------------------- */
const setImgUrl = (imgur, nome) => {
  const urapi = process.env.URL_API
  const up = 'uploads/'
  imgur = imgur.replace(up, '').replace(urapi, '');
  return (nome) ? imgur : urapi.concat(up).concat(imgur);
}
/* --------------------------------------- */
const delFile = (nome) => {
  const idx = nome.includes('uploads/') ? nome.indexOf('uploads/') : 0;
  const path = nome.slice(idx);
  if (fs.existsSync(path)) {
    fs.unlink(path, (err) => { 
      if (err) throw err;
      console.log(path, ' was deleted'); 
    })    
  } else { console.log('nao existe arq pra del', ); }  
}
/* --------------------------------------- */
const getImgNameByid = async (id_img) => {
  try {
    const query ='SELECT nome_img FROM prod_imgs WHERE id_img = ?;';
    const result =  await mysql.execute(query, [id_img]);    
    if (result.length < 1) { return { erro: "não Encontrado!" } }
    return result;
  } catch (error) { return { erro: error};  }
}
/* --------------------------------------- */
exports.getAllImgs = async (req, res) => {
  const query = 'SELECT * FROM prod_imgs;';
  try {
    const result =  await mysql.execute(query);    
    if (result.length < 1) { return res.status(401).send({ erro: "sem imgs!" }) }
    return res.status(200).send({ response: result })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}
/* --------------------------------------- */
exports.getProdImgs = async (req, res) => {
  const query = 'SELECT * FROM prod_imgs WHERE fk_id_prod = ?;';
  try {
    const result =  await mysql.execute(query, [req.params.id_prod]);    
    if (result.length < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(200).send({ response: result })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}
/* --------------------------------------- */
exports.getImgid = async (req, res) => {
  const query = 'SELECT * FROM prod_imgs WHERE id_img = ?;';
  try {
    const result =  await mysql.execute(query, [req.params.id_img]);    
    if (result.length < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(200).send({ response: result })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}
/* --------------------------------------- */
exports.addImg = async (req, res, next) => {
  // console.log('req f = ' , req.file);
  if (faltaCampos(['fk_id_prod'],req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }  
  if (!req.file && !req.body.nome_img) { return res.status(500).send({ erro:'SEM IMAGEM'})  }
  const { fk_id_prod, nome_img, descricao } = req.body;
  const nameimg = (!req.file) ? setImgUrl(nome_img) : setImgUrl(req.file.path); 
  const query = 'INSERT INTO prod_imgs(fk_id_prod, nome_img, descricao) values (?,?,?);';
  try {
    const result =  await mysql.execute(query, [fk_id_prod, nameimg, descricao]);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    const shortname = setImgUrl(nameimg, 'nome')
    return res.status(201).send({ 
      msg: `Imagem ${shortname} Adicionada com Sucesso!`, 
      response: { id_prod: fk_id_prod, id_img: result.insertId, nome_img: nameimg, descricao: descricao } 
    })
  } catch (error) {
    console.log('err ', error);
    return res.status(500).send({ erro: error})
  }
}
/* --------------------------------------- */
exports.upImg = async (req, res, next) => {
  if (faltaCampos(['id_img', 'fk_id_prod'],req.body)) { 
    return res.status(500).send({ erro:'faltaCampos'})
  }
  if (!req.file && !req.body.nome_img) { return res.status(500).send({ erro:'SEM IMAGEM'})  }
  const { id_img, fk_id_prod, nome_img, descricao } = req.body;
  const nameimg = (!req.file) ? setImgUrl(nome_img) : setImgUrl(req.file.path);
  var oldimg;
  const query = 'UPDATE prod_imgs SET fk_id_prod = ?, nome_img = ?, descricao = ? WHERE id_img = ?;';
  const params = [fk_id_prod, nameimg, descricao, id_img]
  try {
    if (req.file) {
      const ret = await getImgNameByid(id_img)
      if (!Array.isArray(ret) && ('erro' in ret)) { return res.status(401).send(ret); }
      oldimg = ret[0].nome_img;
      oldimg = oldimg.slice(oldimg.indexOf('uploads/'));
    } 
    const result =  await mysql.execute(query, params);
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    if (req.file) { delFile(oldimg); }
    const shortname = setImgUrl(nameimg, 'nome');
    return res.status(201).send({ 
      msg: `Imagem ${shortname} Alterada com Sucesso!`, 
      response: { id_prod: fk_id_prod, id_img: id_img, nome_img: nameimg, descricao: descricao } 
    })
  } catch (error) {
    return res.status(500).send({ erro: 'aaa' + error})
  }
}
/* --------------------------------------- */
exports.delImg = async (req, res, next) => {
  if (!('id_img' in req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }
  const { id_img } = req.body;
  var { nome_img } = req.body;
  try {
    if (!nome_img) {
      const ret = await getImgNameByid(id_img)
      if (!Array.isArray(ret) && ('erro' in ret)) { return res.status(401).send(ret); }
      nome_img = ret[0].nome_img;
      nome_img = nome_img.slice(nome_img.indexOf('uploads/'));
    }
    const query = 'DELETE FROM prod_imgs WHERE id_img = ?;';
    const resultb =  await mysql.execute(query, [id_img]);
    const rows = resultb.affectedRows
    if (rows < 1) { return res.status(401).send({ erro: "não REMOVIDO!" }) }
    delFile(nome_img);
    return res.status(201).send({ 
      msg: `${rows} Imagem id = ${id_img} REMOVIDA com Sucesso!`, response: { result: nome_img }       
    })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}