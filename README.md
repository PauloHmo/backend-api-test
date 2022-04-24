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

### ***Tecnologias e Funcionalidades:***

Esta API provê imagens e dados possibilitando leitura, adição, alteração e remoção dos mesmos.

Implementa rotas e funcionalidades básicas mais comuns em projetos reais, que são as de 'produtos' e

'imagens' respectivas, e de 'usuários', para permissões e autenticações necessárias.

Tais funcionalidades servem de base e padrão para qualquer rota futuramente implementada.

Possui tecnologia de criptografia para dados sensíveis, proteção das rotas(end-points) com

autenticação de usuários via token com limite de tempo, e revalidação dos tokens (úteis para Front-End).
<br/><br/>

Além do Framework, utiliza as seguintes bibliotecas adicionais como dependências:

  + Bcrypt ( para criptografia )
  + Jwt ( JSON Web Token para autenticação via token )
  + Multer ( para upload de arquivos )
  + Mysql ( para conexão com banco de dados )
  + Dotenv ( para variáveis de ambiente )
  + Nodemon ( para atualizações run-time em Ambiente de desenvolvimento )

São disponibilizados arquivos 'example' para configuração das variáveis de ambiente,
de acordo com as boas práticas no Git Hub, <br>podendo utilizar .env ou nodemon.json
caso inicie o projeto com Nodemon, bastando configurá-los e renomeá-los.

### ***Dependências pendentes:***

  - [x] Refatoramento das mensagens de erro ou response
  - [ ] Data-base Schema para compreensão da arquitetura das tabelas

### ***Implementações necessárias:***

  + Construção do Banco de Dados seguindo tabelas e campos referente as querys
  + Descomentar as rotas em produtos.js ( comentadas para testes em futuro Deploy )