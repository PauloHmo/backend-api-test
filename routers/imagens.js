const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');
const imgsControl = require ('../controllers/imagens-controller');

/* --- NOTE: All commented routs needs a middleware/login function after DB tests --- */

const storage = multer.diskStorage({
  destination: function(req, file, cb){ 
    cb(null, './uploads/'); 
  },  
  filename: function(req, file, cb){
    const nome = new Date().toISOString().slice(0, -4)
      .replace(/[-:.]/g, '_').concat(file.originalname);
    cb(null, nome);
  }
});

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 1024 * 1024 * 5 },  // limita a 5 mb
  fileFilter: function(req, file, cb){
    cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
  }
});
//#region ======================== IMAGES ================================ 
router.get('/', imgsControl.getAllImgs);
/* --------------------------------------- */
router.get('/produto/:id_prod', imgsControl.getProdImgs);
/* --------------------------------------- */
router.get('/:id_img', imgsControl.getImgid);
// router.post('/', upload.single('produto_imagem'), imgsControl.addImg);

/* -------------------- middleware/login function example -------- */
// router.post('/', upload.single('produto_imagem'), login.obrigatorio, imgsControl.addImg);

/* --------------------------------------- */
// router.patch('/:id_prod', upload.single('produto_imagem'), imgsControl.upImg);
/* --------------------------------------- */
// router.delete('/', imgsControl.delImg);
/* --------------------------------------- */
//#endregion
/* ==================================================================== */
module.exports = router;