<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# 🎥 Media Approval Server

O **Media Approval Server** é um backend robusto, modular e de alto desempenho construído com o framework [NestJS](https://nestjs.com/). Ele fornece uma plataforma completa de APIs para gerenciar fluxos de aprovação de mídias entre administradores e clientes externos, utilizando **PostgreSQL** para persistência estruturada de dados e **Knex.js** como Query Builder e mecanismo de controle de migrações.

---

## 🛠️ Stack Tecnológica

* **Core Framework**: [NestJS](https://nestjs.com/) (v11+)
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (v5+)
* **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) (v16+)
* **Query Builder & Migrations**: [Knex.js](https://knexjs.org/)
* **Geração de IDs**: [CUID2](https://github.com/paralleldrive/cuid2) & [NanoID](https://github.com/ai/nanoid)
* **Validação de Dados**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
* **Testes Automatizados**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

---

## 🏗️ Arquitetura do Sistema e Fluxo

O servidor segue uma arquitetura modular que separa logicamente cada domínio da aplicação. Abaixo está o fluxo de interação entre os componentes:

```mermaid
graph TD
    Client[Cliente / Administrador] -->|Requisição HTTP| Router[NestJS Router & Validation Pipe]
    
    subgraph NestJS [Camada do Servidor]
        Router --> Guard[AuthGuard / Validação JWT]
        Guard --> Controllers[Controllers: Admins / Sessions / Media]
        Controllers --> Services[Services: Regras de Negócio]
        Services --> DB_Service[KnexService / Integração Banco]
    end
    
    subgraph Database [Camada de Persistência]
        DB_Service -->|Queries SQL| PG[(PostgreSQL)]
    end
```

---

## 💾 Modelagem do Banco de Dados (ERD)

A modelagem de dados foi desenhada para suportar relacionamentos consistentes, auditoria e segurança. O diagrama entidade-relacionamento abaixo ilustra as tabelas controladas pelo Knex:

```mermaid
erDiagram
    ADMINS {
        string id PK "cuid2 (24 chars)"
        string name "Nome do administrador"
        integer role "Nível de permissão"
        string email "E-mail único"
        string password "Senha hasheada (bcrypt)"
        integer situation "Status da conta (Ativa/Inativa)"
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    SESSIONS {
        string id PK "cuid2 (24 chars)"
        string url_id UK "nanoid (8 chars) para URLs amigáveis"
        string author_id FK "Chave estrangeira -> ADMINS(id)"
        string title "Título da sessão de aprovação"
        string description "Descrição da sessão"
        string client_email "E-mail do cliente revisor"
        string password_hash "Senha de acesso do cliente"
        timestamp expires_at "Data de expiração da sessão"
        timestamp created_at
        timestamp deleted_at
    }

    MEDIA {
        string id PK "cuid2 (24 chars)"
        string session_id FK "Chave estrangeira -> SESSIONS(id)"
        string drive_file_id "ID do arquivo no Google Drive/S3"
        string drive_url "Link direto para visualização da mídia"
        string mime_type "Tipo de arquivo (vídeo, áudio, imagem)"
        string title "Nome/Título da mídia"
        text caption "Legendas ou comentários do administrador"
        integer status "Status de aprovação (Pendente/Aprovada/Rejeitada)"
        text status_feedback "Feedback fornecido pelo cliente"
        timestamp created_at
        timestamp concluded_at "Data em que foi aprovado/rejeitado"
    }

    AUDIT_LOG {
        string id PK "cuid2 (24 chars)"
        string session_id FK "Chave estrangeira -> SESSIONS(id)"
        string media_id FK "Chave estrangeira -> MEDIA(id)"
        string actor "Quem realizou a ação (admin ou cliente)"
        string action "Ação realizada (ex: aprovou_midia)"
        json metadata "Metadados adicionais da ação"
        timestamp created_at
    }

    ADMINS ||--o{ SESSIONS : "cria"
    SESSIONS ||--o{ MEDIA : "contém"
    SESSIONS ||--o{ AUDIT_LOG : "registra ações de"
    MEDIA ||--o{ AUDIT_LOG : "registra status de"
```

---

## ⚙️ Configuração do Ambiente (`.env`)

Crie ou atualize o arquivo `.env` na raiz do projeto com base no seguinte modelo de variáveis:

```env
NODE_ENV="development"
PORT=3000
BCRYPT_ROUNDS=10
JWT_SECRET="secret_super_secure_key"

# Conexão de Banco de Dados Local (Desenvolvimento)
DATABASE_URL="postgresql://postgres:docker@localhost:5432/media_approval"

# Conexão de Banco de Dados de Testes
TEST_DATABASE_URL="postgresql://postgres_test:docker_test@localhost:5433/media_approval_test"
```

---

## 🚀 Instalação e Execução

### 1. Inicializar os Contêineres de Banco de Dados (Docker)
Este projeto possui um arquivo `docker-compose.yaml` com duas instâncias dedicadas do PostgreSQL (uma para desenvolvimento na porta `5432` e outra para testes na porta `5433`):

```bash
docker compose up -d
```

### 2. Instalar as Dependências do Projeto
```bash
npm install
```

### 3. Rodar as Migrações do Banco de Dados
Para estruturar as tabelas no seu banco local de desenvolvimento:
```bash
npm run migrate:latest
```

*(Opcional) Outros comandos do Knex disponíveis:*
* `npm run migrate:list`: Lista as migrações e o status de cada uma.
* `npm run migrate:rollback`: Desfaz a última bateria de migrações executadas.
* `npm run migrate:down`: Desfaz uma migração específica de forma sequencial.

### 4. Executar o Servidor
```bash
# Modo de desenvolvimento (com hot-reload ao salvar arquivos)
npm run start:dev

# Modo de produção (build e start da versão compilada)
npm run build
npm run start:prod
```

---

## 🧪 Estrutura de Testes Automatizados

Garantimos a estabilidade da aplicação através de uma sólida suíte de testes unitários e de integração (E2E), configurada com Jest.

### Testes Unitários
Testam funções utilitárias, validadores customizados e regras de negócio isoladas de serviços.
```bash
# Executar todos os testes unitários
npm run test

# Executar testes unitários com acompanhamento em tempo real (watch mode)
npm run test:watch
```

### Testes de Integração / E2E (Ponta a Ponta)
Testam as rotas HTTP reais da aplicação. Utiliza o `supertest` para disparar chamadas contra um servidor de teste conectado à base de testes isolada (`media_approval_test`).

Antes de rodar cada bateria de testes E2E, o arquivo [test-global.ts](file:///c:/Users/PC/Desktop/media-approval-server/test/test-global.ts) executa automaticamente o rollback e roda todas as migrações na base de teste de forma limpa.

```bash
# Executar os testes das rotas (E2E)
npm run test:e2e
```

---

## ⚠️ Troubleshooting e Gotchas Comuns

> [!TIP]
> ### Suporte a dependências ESM no Jest (Ex: `nanoid` e `cuid2`)
>
> Bibliotecas modernas como `nanoid` e `@paralleldrive/cuid2` são publicadas puramente em formato **ES Modules (ESM)**. Por padrão, o ambiente Node/CommonJS do Jest ignora a pasta `node_modules` durante a compilação, o que causa erros de inicialização de teste (`SyntaxError: Cannot use import statement outside a module`).
>
> **Solução Aplicada:**
> Para resolver isso, tanto o arquivo principal de configuração do Jest no `package.json` quanto o [test/jest-e2e.json](file:///c:/Users/PC/Desktop/media-approval-server/test/jest-e2e.json) estão configurados para instruir o `ts-jest` a transpilar esses pacotes de forma explícita na propriedade `transformIgnorePatterns`:
>
> ```json
> "transformIgnorePatterns": [
>   "/node_modules/(?!(@paralleldrive/cuid2|@noble|nanoid)/)"
> ]
> ```
