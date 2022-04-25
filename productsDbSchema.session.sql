
CREATE TABLE IF NOT EXISTS `prod_categs` (
  `id_categ` TINYINT(3) UNSIGNED NOT NULL AUTO_INCREMENT, 
  `priority` TINYINT(3) UNSIGNED NOT NULL, 
  `nome_categ` VARCHAR(45) NOT NULL, 
PRIMARY KEY(`id_categ`))
ENGINE=InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `prods` (
  `id_prod` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT, 
  `fk_id_categ` TINYINT(3) UNSIGNED NOT NULL,
  `nome_prod` VARCHAR(200) NOT NULL, 
  `titulo` VARCHAR(200), 
  `descricao` VARCHAR(255),
  `preco` decimal(8,2) UNSIGNED NOT NULL,
PRIMARY KEY(`id_prod`)) 
ENGINE=InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS `prod_imgs` (
  `id_img` SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT, 
  `fk_id_prod` SMALLINT(5) UNSIGNED NOT NULL,
  `nome_img` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(255),
PRIMARY KEY(`id_img`)) 
ENGINE=InnoDB DEFAULT CHARACTER SET = utf8;


CREATE VIEW vw_prodsb AS
SELECT 
  prods.fk_id_categ AS idcateg,
  prod_categs.nome_categ AS categoria,
  prods.id_prod AS idprod,
  prods.nome_prod AS produto,
  prods.titulo AS titulo,
  prods.descricao AS descricao,
  prods.preco AS preco,
  prod_imgs.id_img AS id_img,
  prod_imgs.nome_img AS nome_img,
  prod_imgs.descricao AS img_alt,
  COUNT(prod_imgs.id_img) AS qtde_imgs
FROM prods
INNER JOIN prod_categs
ON prod_categs.id_categ = prods.fk_id_categ
LEFT JOIN prod_imgs
ON prod_imgs.fk_id_prod = prods.id_prod
GROUP BY prods.id_prod
ORDER BY `prods`.`id_prod`, `prod_imgs`.`id_img`;


CREATE TRIGGER tr_prods_del BEFORE DELETE ON prods
 FOR EACH ROW 
DELETE FROM prod_imgs WHERE fk_id_prod = OLD.id_prod;
