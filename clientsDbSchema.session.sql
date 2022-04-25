
CREATE TABLE IF NOT EXISTS `clients` (
   `id_cli` smallint(6) NOT NULL AUTO_INCREMENT,
   `nome_cli` varchar(70) NOT NULL,
   `mail_cli` varchar(70) NOT NULL,
   `pass_cli` varchar(100) NOT NULL,
    PRIMARY KEY (`id_cli`) ) 
ENGINE=InnoDB DEFAULT CHARACTER SET = utf8;

DESCRIBE clients;
SHOW CREATE TABLE clients;

CREATE VIEW vw_clients AS
SELECT 
  clients.id_cli AS iduser,
  clients.nome_cli AS nome,
  clients.mail_cli AS email,
  clients.pass_cli AS senha

FROM clients;
