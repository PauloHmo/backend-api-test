const express = require('express');
const router = express.Router();
// const login = require('../middleware/login');
const prodsControl = require ('../controllers/produtos-controller');

//#region ======================== CATEGS ================================ 
router.get('/', prodsControl.getCategs);
/* --------------------------------------- */
// router.post('/', login.obrigatorio, prodsControl.addCateg);
// router.post('/', prodsControl.addCateg);
/* --------------------------------------- */
// router.patch('/', prodsControl.upCateg);
/* --------------------------------------- */
// router.delete('/', prodsControl.delCateg);
//#endregion
//#region ======================== PRODUTOS ============================== 
router.get('/todos', prodsControl.getAllprods);
/* --------------------------------------- */
router.get('/:categ', prodsControl.getProdsCateg);
/* --------------------------------------- */
router.get('/:categ/:filtro', prodsControl.getOneProd);
/* --------------------------------------- */
// router.post('/:categ', prodsControl.addProd);
// router.post('/:categ', upload.single('produto_img'), prodsControl.addProd);
// req.file
// router.patch('/:categ', prodsControl.updateProd);
// router.delete('/:categ', prodsControl.delProd);
/* --------------------------------------- */

//#endregion
/* ==================================================================== */
module.exports = router;