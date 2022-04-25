# Primeiro Repositório - API Back-End - Node.js

## Projeto de Exemplo Em Desenvolvimento para Git Hub (Fase Inicial de Testes)

### Nota: ***Não utilize esses arquivos para produção!***
<br>

Este é um projeto 'exemplo' de uma API Back-End em Fase de <b>Desenvolvimento</b> que <b>visa 
incialmente</b> conhecer, <br> utilizar e <b>exercitar as melhores práticas no GitHub!</b>

Os arquivos presentes foram testados apenas em Ambiente de Desenvolvimento, apresentando
real funcionalidade,<br> porém, necessitando futuras implementações para rodar em produção.

## ***Sobre o projeto:***

Este projeto utiliza a linguagem **Javascript**, ambiente **Node.js** e Framework **Express** com 
conexão a Banco de Dados relacionais (incialmente MySQL), <br> demonstrando funcionalidades
básicas de uma API back-End que serve dados para aplicações Front-End de forma independente, 
<br> seguindo os padrões REST de desenvolvimento.

### **Importante:**
  ### ***- As rotas comentadas(propositalmente) exigem autenticação por padrão!***
  ### - ***Teste cada rota e acrescente as funções middleware/login após os testes!***
  ### Exemplo: 
  ```
    router.delete('/', prodsControl.delCateg)
    router.delete('/', login.obrigatorio, prodsControl.delCateg) 
  ```

<br/>

### ***Tecnologias e Funcionalidades:***

Esta API provê imagens e dados possibilitando leitura, adição, alteração e remoção dos mesmos.

Implementa rotas e funcionalidades básicas mais comuns em projetos reais, que são as de 'produtos' e

'imagens' respectivas, e de 'usuários', para permissões e autenticações necessárias.

Tais funcionalidades servem de base e padrão para qualquer rota futuramente implementada.

Possui tecnologia de criptografia para dados sensíveis, proteção das rotas(end-points) através de 

autenticação JWT do usuário com restrição por tempo, e revalidação dos tokens (úteis para Front-End).
<br/>

Além do Framework, esta API utiliza as seguintes bibliotecas adicionais como dependências:

  + Bcrypt ( para criptografia )
  + Jwt ( JSON Web Token para autenticação via token )
  + Multer ( para upload de arquivos )
  + Mysql ( para conexão com banco de dados )
  + Dotenv ( para variáveis de ambiente )
  + Nodemon ( para atualizações run-time em Ambiente de desenvolvimento )

São disponibilizados arquivos 'example' para configuração das variáveis de ambiente,
de acordo com as boas práticas no Git Hub, <br>podendo utilizar .env ou nodemon.json
caso inicie o projeto com Nodemon, bastando configurá-los e renomeá-los.

### ***Banco de dados:***

Esta API utiliza banco de dados relacionais, a princípio MySQL. Note que não é necessário
a criação de chaves relacionais na criação do mesmo, devido ao fato de utilizar views para 
consultas, e um trigger delete em 'produtos'. (Isso facilita qualquer alteração ou manutenção das tabelas) 
Considere certo uma migração para PostgreSQL futuramente.

### ***Alterações pendentes ou implementadas:***

  - [x] Revisão das mensagens de erro via console ou response
  - [x] Disponibilizar arquivos para criação de DB e tabelas respectivas
  - [ ] Refatorar arquivo users.js para redução de código e reuso do módulo 'execute' em mysql.js
  - [ ] Migração de banco de dados de MySQL para PostgreeSQL

### ***Implementações necessárias e recomendações ao desenvolvedor:***

  + Instalação do Banco de Dados, Node.js, Framework Express e bibliotecas de dependência
  + Criação do Banco de Dados e tabelas de acordo com arquivos session.sql disponibilizados (Não necessitam de chave relacional a princípio por utilizar views, permitindo alterações ao decorrer do desenvolvimento)
  + Inserção direta dos dados iniciais ( tabelas não relacionais de produtos, e posteriormente as tabelas relacionais )
  + Inserção de dados de usuário através do end-point de 'cadastro' ( para registro criptografado da senha )
  + Teste de requisições GET após todas as tabelas devidamente populadas
  + Teste unitário das rotas comentadas e posterior implementação de funções middleware/login em TODAS elas
  + Implementação opcional de funções middleware/login nas demais rotas