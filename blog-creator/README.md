# Blog Version Creator

Utilitário para criar posts de versão automaticamente no GreenToast Insider Blog.

## Como Usar

### 1. Iniciar o Servidor

**Opção A - Duplo clique:**
- Execute `start-server.bat`

**Opção B - Terminal:**
```bash
cd blog-creator
node server.js
```

### 2. Abrir a Interface

Após iniciar o servidor, abra no navegador:
```
http://localhost:3000
```

### 3. Criar um Post

1. Escolha um template rápido (SPE, WorksUP, GreenPC) ou preencha manualmente
2. Preencha os campos:
   - **Build Code**: Código da build (ex: 08W7C)
   - **Build Number**: Data da build (ex: build.04.03-26)
   - **Data**: Data de publicação
   - **Descrição**: Use `{TYPE}` e `{VERSION}` como placeholders
   - **Features**: Adicione as novidades da versão
3. Clique em **"Criar Post Automaticamente"**

### O que acontece automaticamente:

✅ Cria o arquivo HTML do post na pasta do site  
✅ Adiciona o card no início do `SPE_blog.html`  
✅ Mostra preview em tempo real  

## Estrutura de Arquivos

```
blog-creator/
├── index.html      # Interface do utilitário
├── server.js       # Servidor Node.js
├── start-server.bat # Atalho para iniciar
└── README.md       # Este arquivo
```

## Requisitos

- Node.js instalado no sistema
- Permissão de escrita na pasta do site

## Troubleshooting

**Erro "Servidor não conectado":**
- Verifique se o servidor está rodando
- Execute `node server.js` no terminal

**Erro ao criar arquivo:**
- Verifique permissões na pasta
- Certifique-se que nenhum arquivo está aberto/bloqueado
