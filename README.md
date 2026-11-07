# URL Shortener
![JavaScript](https://img.shields.io/badge/JavaScript-Linguagem-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-Framework-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)

Uma API REST desenvolvida com **Node.js**, **Express** e **PostgreSQL**, que permite encurtar URLs, redirecionar usuários para os endereços originais e acompanhar a quantidade de acessos de cada link.

Projeto desenvolvido com o objetivo de praticar conceitos de desenvolvimento backend, integração com banco de dados e construção de APIs.

## Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript.
- **Express** — framework para construção da API.
- **PostgreSQL** — banco de dados relacional.
- **pg** — biblioteca para conexão com o PostgreSQL.
- **dotenv** — gerenciamento de variáveis de ambiente.

## Funcionalidades

- Encurtar URLs e gerar códigos de acesso.
- Redirecionar para a URL original utilizando o código gerado.
- Listar todas as URLs cadastradas.
- Contabilizar a quantidade de acessos de cada URL.
- Evitar o cadastro duplicado de URLs.
- Excluir URLs cadastradas pelo ID.
- Validar os dados recebidos pela API.

---

# Como executar o projeto

## Pré-requisitos

Antes de começar, você precisará ter instalado:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

## Instalação

### Clonando o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/Guillhermegpp/UrlShortener.git
```

Entre na pasta do projeto:

```bash
cd UrlShortener
```

### Instalando as dependências

Execute o comando:

```bash
npm install
```

Esse comando instala todas as dependências necessárias, definidas no arquivo `package.json`.

### Configurando as variáveis de ambiente

Na raiz do projeto, crie um arquivo chamado `.env` e configure as seguintes variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=url_shortener
```

**Atenção:** substitua `seu_usuario` e `sua_senha` pelas credenciais utilizadas na sua instalação do PostgreSQL.

Não compartilhe seu arquivo `.env` no GitHub. Ele contém informações sensíveis de acesso ao banco de dados.

### Configurando o banco de dados

Com o PostgreSQL instalado e em execução, acesse o banco de dados e execute os comandos SQL abaixo.

**1. Criar o banco de dados:**

```sql
CREATE DATABASE url_shortener;
```

**2. Conectar-se ao banco `url_shortener` e criar a tabela:**

```sql
CREATE TABLE urls (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    url_original VARCHAR(2083) NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    acessos INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**3. Criar as restrições de unicidade:**

```sql
ALTER TABLE urls
ADD CONSTRAINT urls_codigo_unique UNIQUE (codigo);

ALTER TABLE urls
ADD CONSTRAINT urls_url_original_unique UNIQUE (url_original);
```

**Documentação complementar:** [PostgreSQL_URL_Shortener.docx](./PostgreSQL_URL_Shortener.docx)

O arquivo contém consultas SQL utilizadas no desenvolvimento e na manutenção do banco de dados.

### Iniciando o servidor

Após configurar o banco de dados e as variáveis de ambiente, execute:

```bash
node server.js
```

O servidor será iniciado na porta `3000`.

Para verificar se está funcionando, acesse:

http://localhost:3000

A resposta esperada será:

```text
Servidor funcionando
```

## Rotas da API

| Método | Rota | Descrição |
|:---:|---|---|
| GET | `/` | Verifica se o servidor está funcionando. |
| POST | `/urls` | Cria uma URL encurtada. |
| GET | `/urls` | Lista todas as URLs cadastradas. |
| GET | `/:codigo` | Redireciona para a URL original. |
| DELETE | `/urls/:id` | Exclui uma URL pelo ID. |

### Exemplos de utilização

**Criar uma URL encurtada**

`POST /urls`

Corpo da requisição:

```json
{
    "url": "https://www.google.com"
}
```

**Listar URLs cadastradas**

`GET /urls`

**Acessar uma URL encurtada**

`GET /:codigo`

**Excluir uma URL**

`DELETE /urls/:id`

## Testando a API pelo PowerShell

Com o servidor em execução, abra outro terminal PowerShell e utilize o comando abaixo para cadastrar uma URL:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/urls" -ContentType "application/json" -Body '{"url":"https://www.google.com"}'
```

O comando envia uma requisição POST para a API, com a URL original no corpo da requisição.

Para listar as URLs cadastradas:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/urls"
```

Para excluir uma URL pelo ID:

```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:3000/urls/1"
```

Para testar o redirecionamento, acesse no navegador:

```text
http://localhost:3000/CODIGO_GERADO
```