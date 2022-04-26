# Primeiro Repositório - API Back-End - Node.js

## Projeto de Exemplo Em Desenvolvimento para Git Hub (Fase Inicial)

### Nota: ***Não utilize esses arquivos para produção!***
<hr>
Este é um projeto 'exemplo' de uma API Back-End em Fase de <b>Desenvolvimento</b> que <b>visa 
incialmente</b> conhecer, utilizar e <b>exercitar as melhores práticas no GitHub!</b>

Os arquivos presentes foram testados apenas em Ambiente de Desenvolvimento, apresentando real funcionalidade. Porém, 
necessitam de futuras implementações para rodar em produção.

## ***Objetivos deste repositório:***

1. Obter total familiaridade com comandos e boas práticas do GitHub até o deploy desta aplicação.

2. Trabalhar desde o início com arquivos de projeto relevantes (ao menos para mim), passíveis de alguma implementação, e que exigem maior responsabilidade e atenção almejando um nível profissional de trabalho, mesmo ciente dos riscos.

3. Conciliar a certeza de erros inevitáveis por falta de experiência, com a certeza de aprender a contorná-los por falta de opção.

## ***Sobre o projeto:***

  Este projeto utiliza a linguagem **Javascript**, ambiente **Node.js** e Framework **Express** com conexão a Banco de Dados relacionais (incialmente **MySQL**), demonstrando as funcionalidades básicas mais importantes de uma API back-End seguindo os padrões **REST**, onde busca servir dados independente do Front-End e sem qualquer vínculo de estado de sessão (Stateless).

### ***Tecnologias e Funcionalidades:***

Esta API provê **dados** e **imagens*** possibilitando ***leitura, adição, alteração e remoção*** dos mesmos.
Note que a funcionalidade de servir imagens cabe **apenas como exemplo da tecnologia**, e **não** é **recomendado** serví-las em ambiente de produção junto ao servidor da API, principalmente em grandes projetos).

Implementa funcionalidades mais comuns de projetos reais, e apenas 
end-points necessários para demonstrar as funcionalidades de interação com banco de dados relacionais de forma simples e abrangente.

Por exemplo, manusear dados da **categoria de produtos** que possuem relação com os dados de **produtos** e que por sua vez, se relacionam com suas **imagens**. 

Este é um exemplo **simples**, mas que já abandona uma lógica de programação trivial, pedindo maior prevenção de erros, e não sei vocês, mas o seu refatoramento é sempre animador... 

Além de **produtos**, claro, a interação com dados de **usuários**. Quase impossível uma aplicação sem login, e toda implementação de segurança relacionada a eles ***NUNCA*** será demais. 

### *Implementações de segurança nesse projeto:*

 - Criptografia de senha sem nenhum tipo de transmissão
 - Validação de usuários baseada em JWT sem estado de sessão
 - Proteção a qualquer rota(end-point) baseada em nível de acesso e validação

### *Bibliotecas adicionais como dependências:*

  + Bcrypt ( para criptografia )
  + Jwt ( JSON Web Token para autenticação )
  + Multer ( para upload e armazenamento de arquivos )
  + Mysql ( para conexão com banco de dados )
  + Dotenv ( para variáveis de ambiente )
  + Nodemon ( para atualizações run-time em Ambiente de desenvolvimento )

São disponibilizados arquivos 'example' para configuração das variáveis de ambiente,
de acordo com as boas práticas no Git Hub, podendo utilizar tanto
o arquivo .env como nodemon.json caso inicie o projeto com Nodemon, bastando renomeá-los e configurá-los com valores próprios.

### ***Banco de dados:***

Esta API utiliza banco de dados relacionais, a princípio MySQL. Note que não é necessário
a criação de chaves relacionais na criação do mesmo, devido ao fato de utilizar **views** para consultas, e haver um trigger delete em 'produtos'. (Isso facilita qualquer alteração ou manutenção das tabelas em ambiente de desenvolvimento).

Mas considere uma migração para PostgreSQL.

### ***Alterações pendentes ou implementadas:***

  - [x] Disponibilizar arquivos .sql para criação de tabelas respectivas
  - [ ] Refatorar users.js para reuso do módulo 'execute' em mysql.js
  - [ ] Duplicação de rota, lógica e tabela clients exclusivo para admins
  - [ ] Migração de banco de dados de MySQL para PostgreeSQL

### ***Implementações necessárias e recomendações ao desenvolvedor:***

  1. Instalação do Banco de Dados, Node.js, Framework Express e bibliotecas de dependência

  2. Criação do Banco de Dados e tabelas de acordo com arquivos session.sql disponibilizados (Não necessitam de chave estrangeira a princípio por utilizar **views**, permitindo alterações e correções sem grandes problemas )

  3. Popular tabelas de categorias e produtos(passíveis de forma direta)

  4. Cadastro de usuário via end-point para inserção criptografada da senha

  5. Inserção via POST de imagem para demais testes

  6. Teste de requisições GET após todas as tabelas devidamente populadas

  7. **Teste unitário das rotas comentadas(apenas DB primeiramente)**

  8. **Implementação de funções middleware/login após o teste**
      ### Exemplo:
      ```
         router.delete('/', prodsControl.delCateg)
      // router.delete('/', login.obrigatorio, prodsControl.delCateg) 
      ```

  9. Teste final com todas funcionalidades habilitadas
