const mysqlb = require('../mysql');

const tbs = ['prod_categs', 'prods', 'prod_imgs', 'vw_prodsb']    
const tbbs = {
  prod_categs : ['id_categ', 'priority', 'nome_categ'] ,
  prods       : ['id_prod', 'fk_id_categ', 'nome_prod', 'titulo', 'descricao', 'preco'] ,
  prod_imgs   : ['id_img', 'fk_id_prod', 'nome_img', 'descricao'] ,
  vw_prodsb   : ['idcateg', 'categoria', 'idprod', 'produto', 'titulo', 
                  'descricao', 'preco', 'id_img', 'nome_img', 'img_alt']
}

const categorias = []
/* --------------------------------------- */
const inigetcategs = async () => {
  const query = 'SELECT * FROM prod_categs;';
  try {
    const result =  await mysqlb.execute(query);    
    return result;    
  } catch (error) {
    return { erro: error }
  }
}
inigetcategs().then((result) => { categorias.push(...result); }) 
/* --------------------------------------- */
const checkincateg = (nomecateg, id) => {
  return categorias.find(categ => categ.nome_categ === nomecateg && ((id) ? categ.id_categ === id : true) );   
}
/* --------------------------------------- */
const faltaCampos = (campos, body) => {
  for (const cp of campos) {
    if (!(cp in body)) {  return ("Campo " + cp + " Obrigatório!"); }
  }
  return false;
}
//#region ======================== CATEGS ================================
exports.getCategs = async (req, res) => {
  if (req.query.from) {
    try {
      const response = await inigetcategs()
      console.log('from = ', req.query );
      return res.status(200).send({ response: response }) 
    } catch (error) {
      return res.status(500).send({ erro: error})
    }    
  } else if (categorias.length) { 
    console.log('from = const arey' );
    return res.status(200).send({ response: categorias }) 
  } else {
    return res.status(500).send({ erro: 'error'});
  }
}
// ---------------------------------------
exports.addCateg = async (req, res, next) => {
  if (faltaCampos(['priority', 'nome_categ'],req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }
  const { priority, nome_categ } = req.body;
  const query = 'INSERT INTO prod_categs(priority, nome_categ) values (?,?);';
  const params = [priority, nome_categ]
  try {
    const result =  await mysqlb.execute(query, params);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    const response = { id_categ: result.insertId, priority: priority, nome_categ: nome_categ } 
    categorias.push(response)
    return res.status(201).send({ 
      msg: `Categoria ${nome_categ} Adicionada com Sucesso!`, response: response      
    });
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
  // return res.status(201).send({ mensagem: 'addCategx', nome: req.body.nome })
}
// ---------------------------------------
exports.upCateg = async (req, res, next) => {
  if (faltaCampos(tbbs.prod_categs, req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }
  const { id_categ, priority, nome_categ } = req.body;
  const query = 'UPDATE prod_categs SET priority = ?, nome_categ = ? WHERE id_categ = ?;';
  const params = [priority, nome_categ, id_categ]
  try {
    const result =  await mysqlb.execute(query, params);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    const response = { id_categ: id_categ, priority: priority, nome_categ: nome_categ } 

    categorias.find((categ, idx) => {
      if (categ.id_categ === id_categ) {
        categorias[idx] = response; return true;
      }
      return false;
    });

    return res.status(202).send({ 
      msg: `${result.affectedRows} Categoria Atualizada com Sucesso!`, response: response
    });
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}
// ---------------------------------------
exports.delCateg = async (req, res, next) => {
  if (!('id_categ' in req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }
  const query = 'DELETE FROM prod_categs WHERE id_categ = ?;';
  try {
    const result =  await mysqlb.execute(query, [req.body.id_categ]);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }

    categorias.find((categ, idx) => {
      if (categ.id_categ === req.body.id_categ) {
        categorias.splice( parseInt(idx), 1); return true;        
      }
      return false;
    });

    return res.status(202).send({ 
      msg: `${result.affectedRows} Categoria REMOVIDA com Sucesso!`, response: { result: result.affectedRows }         
    });
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}
//#endregion
//#region ======================== PRODUTOS ============================== 
exports.getAllprods = async (req, res, next) => {
  const query = 'SELECT * FROM vw_prodsb ORDER BY idcateg, idprod;';
  try {
    const result =  await mysqlb.execute(query);    
    if (result.length < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(200).send({ response: result })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}

exports.getProdsCateg = async (req, res, next) => {
  var params = [req.params.categ]
  console.log('getProdsCateg params = ', params );
  if (categorias.length && !checkincateg(params[0])) { 
    return res.status(500).send({ erro: 'xxxxxxxx errado'});
  }
  var fim = '';
  var err = false;
  if (req.query) {
    if (req.query['preco']) {
      const cond = req.query['preco'];
      if ('maior igual menor'.includes(cond) && req.query['valor']) {
        var sign = (cond === 'maior') ? '>' : '<';
        fim = ` AND preco ${sign} ?`; params.push(req.query['valor']);
      } else {
        return res.status(500).send({ erro: 'preco errado'});
      }      
    } else {
      Object.keys(req.query).map((k) => {
        if (tbbs.vw_prodsb.includes(k)) {
          fim += ` AND ${k} = ?`; params.push(req.query[k]);        
        } else {
          err = true; return;
        }        
      });
    }
  }
  if (err) { return res.status(500).send({ erro: 'sem chave'}) }
  const query = `SELECT * FROM vw_prodsb WHERE categoria = ?${fim};`;
  try {
    const result =  await mysqlb.execute(query, params);    
    if (result.length < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(200).send({ response: result })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}

exports.getOneProd = async (req, res, next) => {
  var params = [req.params.categ];
  if (categorias.length && !checkincateg(params[0])) { 
    return res.status(500).send({ erro: 'xxxxxxxx errado'});
  }
  var fim = '';
  var err = false;
  const filtro = req.params.filtro;
  console.log(params, ' 1 PRODUTO = ', filtro);
  if (!isNaN(filtro)) {
    fim = ` AND idprod = ?`; params.push(filtro);
  } else if(!req.query || !(filtro === 'preco' || filtro === 'nome')){
    return res.status(500).send({ erro: 'sem qqqq'});
  } else if(filtro === 'nome' && ('nome' in req.query)){
    fim = ` AND produto = ?`; params.push(req.query.nome);
  } else if(filtro === 'preco'){
    var k = Object.keys(req.query)[0];
    var idx = ['menor', 'maior'].indexOf(k);    
    if(idx < 0) { err = true; return res.status(500).send({ erro: 'sem chave'}); }
    idx = (idx === 1) ? '>' : '<';
    fim = ` AND preco ${idx} ?`; params.push(req.query[k]);
  }
  if (err) { console.log('xxx', ); return res.status(500).send({ erro: 'fim sem chave'}) }

  const query = `SELECT * FROM vw_prodsb WHERE categoria = ?${fim};`;  
  try {
    const result =  await mysqlb.execute(query, params);    
    if (result.length < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(200).send({ response: result })
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
  
}
/* --------------------------------------- */
exports.addProd = async (req, res, next) => {
  if (faltaCampos(['nome_prod', 'preco'],req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }
  const categ = req.params.categ;
  var query = 'SELECT id_categ FROM prod_categs WHERE nome_categ = ?;';
  var queryparams = [categ];
  var idcateg = false;
  if (!categorias.length){
    try {
      const result =  await mysqlb.execute(query, queryparams);    
      if (result.length < 1) { return res.status(401).send({ erro: "id_categ não Encontrado!" }) }
      idcateg = result[0]
    } catch (error) { return res.status(500).send({ erro: error}) }
  } else {
    var objcat = checkincateg(categ); idcateg = objcat?.id_categ ?? idcateg;
  }
  const { fk_id_categ, nome_prod, titulo, descricao, preco } = req.body;
  if (!idcateg) {
    if (!fk_id_categ) {
      return res.status(401).send({ erro: "FK não Encontrado!" })       
    } else { idcateg = fk_id_categ }    
  }
  query = 'INSERT INTO prods (fk_id_categ, nome_prod, titulo, descricao, preco) values (?,?,?,?,?);';
  queryparams = [idcateg, nome_prod, titulo, descricao, preco];
  try {
    const result =  await mysqlb.execute(query, queryparams);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(201).send({ 
      msg: `Produto ${nome_prod} Adicionado com Sucesso!`, 
      response: { id_prod: result.insertId, categoria: categ, nome_prod: nome_prod, preco: preco } 
    });
  } catch (error) {
    return res.status(500).send({ erro: error})
  }
}
/* --------------------------------------- */
exports.updateProd = async (req, res, next) => {
  if (faltaCampos(['id_prod', 'nome_prod', 'preco'], req.body)) { 
    return res.status(500).send({ erro:'faltaCampos'});
  }
  const categ = req.params.categ;
  if (!categorias.length){ return res.status(500).send({ erro: 'erro servidr'}); }
  const obcat = checkincateg(categ) ?? false; 
  const { id_prod, fk_id_categ, nome_prod, titulo, descricao, preco } = req.body;
  if (!obcat || (fk_id_categ && obcat.id_categ !== fk_id_categ)) {
    return res.status(500).send({ erro: 'categ errado'});
  }
  var idcateg = obcat.id_categ
  query = 'UPDATE prods SET fk_id_categ = ?, nome_prod = ?, titulo = ?, descricao = ?, preco = ? WHERE id_prod = ?;';
  queryparams = [ idcateg, nome_prod, titulo, descricao, preco, id_prod];
  try {
    const result =  await mysqlb.execute(query, queryparams);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(202).send({ 
      msg: `${result.affectedRows} Produto Atualizado com Sucesso!`,
      response: { id_prod: id_prod, nome_prod: nome_prod, preco: preco } 
    });
  } catch (error) { 
    return res.status(500).send({ erro: error });
  }
}
/* --------------------------------------- */
exports.delProd = async (req, res, next) => {
  if (!('id_prod' in req.body)) { return res.status(500).send({ erro:'faltaCampos'}) }
  const categ = req.params.categ;
  const query = 'DELETE FROM prods WHERE fk_id_categ = (SELECT id_categ FROM prod_categs WHERE nome_categ = ?) AND id_prod = ?;';
  const params = [categ, req.body.id_prod]
  try {
    const result =  await mysqlb.execute(query, params);    
    if (result.affectedRows < 1) { return res.status(401).send({ erro: "não Encontrado!" }) }
    return res.status(202).send({ 
      msg: `${result.affectedRows} Produto REMOVIDO com Sucesso!`, response: { results: result.affectedRows }         
    });
  } catch (error) { 
    return res.status(500).send({ erro: error });
  }
}
//#endregion