const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const prodsControl = require ('../controllers/produtos-controller');

/* --- NOTE: All commented routs needs a middleware/login function after DB tests --- */

/* --- NOTE 2: Add and Update PRODUCT Router functions do NOT handle uploaded images, but imagens.js does --- */

//#region ======================== CATEGS ================================ 
router.get('/', prodsControl.getCategs);
// router.post('/', prodsControl.addCateg);

/* -------------------------- middleware/login function example ------- */
// router.post('/', login.obrigatorio, prodsControl.addCateg);
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
// router.patch('/:categ', prodsControl.updateProd);
// router.delete('/:categ', prodsControl.delProd);

/* ----------- FOR FUTURE IMPLEMENTATIONS with uploaded images --------- */

// router.post('/:categ', upload.single('produto_img'), prodsControl.YOUR_FUNCTION);
/* --------------------------------------- */

//#endregion
/* ==================================================================== */
module.exports = router;