
CREATE TABLE IF NOT EXISTS `clients` (
   `id_cli` smallint(6) NOT NULL AUTO_INCREMENT,
   `nome_cli` varchar(70) NOT NULL,
   `mail_cli` varchar(70) NOT NULL,
   `pass_cli` varchar(100) NOT NULL,
    PRIMARY KEY (`id_cli`) ) 
ENGINE=InnoDB DEFAULT CHARACTER SET = utf8;

CREATE VIEW vw_clients AS
SELECT 
  clients.id_cli AS iduser,
  clients.nome_cli AS nome,
  clients.mail_cli AS email,
  clients.pass_cli AS senha
FROM clients;

CREATE TABLE IF NOT EXISTS `tbadmins` (
   `id_adm` smallint(6) NOT NULL AUTO_INCREMENT,
   `lvl_adm` TINYINT(3) UNSIGNED NOT NULL,
   `nome_adm` varchar(70) NOT NULL,
   `mail_adm` varchar(70) NOT NULL,
   `pass_adm` varchar(100) NOT NULL,
    PRIMARY KEY (`id_adm`) ) 
ENGINE=InnoDB DEFAULT CHARACTER SET = utf8;

CREATE VIEW vw_admins AS
SELECT 
  tbadmins.id_adm AS idadm,
  tbadmins.lvl_adm AS admlvl,
  tbadmins.nome_adm AS nome,
  tbadmins.mail_adm AS email,
  tbadmins.pass_adm AS senha
FROM tbadmins;