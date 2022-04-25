# *Router files* / Arquivos de rota

## *This files define end-points and request methods supported with his respective controller functions*
## Estes Arquivos definem as rotas e métodos de requisição suportados com suas respectivas funções dos controladores
<br>

  ## 1. *Note* / Nota:
  ### - *The end-points for Add and Update products does NOT handle upload images yet, but the imagens.js file end-points does.*
  ### - Os end-points para adição e alteração de produtos ainda não tratam upload de imagens, mas os end-points do arquivo imagens.js tratam.
<br>

## *IMPORTANT* / IMPORTANTE ( middleware/login ):

### - *All commented end-points needs a middleware/login function for authentication by default!*
### - Todos end-points comentados exigem por padrão uma função middleware/login para autenticação!
<br>

### - *After testing each DB function, you must add the middleware function call on commented router function*
### - Depois de testar cada função de banco de dados, você deve adicionar a chamada da função middleware na rota comentada
<br>

### - *Example* / Exemplo ( produtos.js ):
  ```
    router.delete('/', prodsControl.delCateg)
    router.delete('/', login.obrigatorio, prodsControl.delCateg) 
  ```