# Sistema OAuth2 para Verificação de Bot Discord

Sistema mínimo de OAuth2 para verificação de usuários em bots Discord.

## 🚀 Como fazer deploy no Railway.app

### 1. Preparar o repositório no GitHub
- Crie um repositório no GitHub
- Faça upload da pasta `site` inteira
- NÃO envie o arquivo `.env` (ele está no .gitignore)

### 2. Configurar no Railway.app
1. Acesse https://railway.app
2. Crie um novo projeto
3. Conecte com seu repositório GitHub
4. Railway detectará automaticamente Node.js

### 3. Configurar variáveis de ambiente no Railway
No painel do Railway, vá em "Variables" e adicione:

```
URL=https://seu-projeto.up.railway.app
CLIENT_ID=1507126416834171030
CLIENT_SECRET=SRX1w_QGU5pNUVQbUUKU4gT2G9HahYnCx
ROLE=1484339341495894119
GUILD_ID=1440862152796934208
WEBHOOK_LOGS=https://discord.com/api/webhooks/1507891052701286482/-R62Yr7OD3YGbIoNjzVgZWuVkr8HcTYukCXb0JWwm8WSUHjRezajehxXkElpIwpqJjbC
SERVER_INVITE=https://discord.gg/xeCc89yhbh
BOT_TOKEN=SEU_TOKEN_DO_BOT
```

**Importante:** A URL será fornecida pelo Railway após o deploy inicial.

### 4. Configurar OAuth2 no Discord Developer Portal
1. Acesse https://discord.com/developers/applications
2. Selecione seu bot
3. Vá em "OAuth2" → "Redirects"
4. Adicione: `https://seu-projeto.up.railway.app/auth/callback`

### 5. Atualizar a URL no bot principal
No seu bot principal, atualize a URL do botão de verificação:
```
https://discord.com/api/oauth2/authorize?client_id=1507126416834171030&redirect_uri=https://seu-projeto.up.railway.app/auth/callback&response_type=code&scope=identify
```

## 🔒 Segurança
- Todas as credenciais estão em variáveis de ambiente
- Arquivo `.env` está no .gitignore (não é enviado ao GitHub)
- Nenhuma informação sensível no código

## 📁 Estrutura do projeto
```
site/
├── index.js           # Arquivo principal
├── package.json       # Dependências
├── .env.example       # Template de variáveis
├── .gitignore         # Arquivos ignorados
├── README.md          # Este arquivo
└── routes/
    ├── login.js       # Rota de login OAuth2
    └── callback.js    # Rota de callback OAuth2
```

## ✅ Funcionalidades
- Login OAuth2 com Discord
- Callback para processar verificação
- Adiciona cargo ao usuário verificado
- Envia logs para webhook
- Coleta IP, localização e dispositivo
- Redireciona para o servidor após verificação
- Emojis da empresa como carimbo
