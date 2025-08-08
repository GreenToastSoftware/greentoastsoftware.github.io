# Instruções para Configurar o Envio de Emails

## Opção 1: EmailJS (Recomendado para flexibilidade)

### Passo 1: Criar conta no EmailJS
1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Verifique seu email

### Passo 2: Configurar o serviço de email
1. No dashboard, clique em "Email Services"
2. Escolha seu provedor de email (Gmail, Outlook, etc.)
3. Configure as credenciais
4. Anote o **Service ID**

### Passo 3: Criar template de email
1. Vá para "Email Templates"
2. Crie um novo template
3. Configure o template com estas variáveis:
   - `{{from_name}}` - Nome do remetente
   - `{{from_email}}` - Email do remetente  
   - `{{phone}}` - Telefone
   - `{{service}}` - Tipo de serviço
   - `{{message}}` - Mensagem
4. Anote o **Template ID**:

### Passo 4: Obter chave pública
1. Vá para "Account" > "General"
2. Copie a **Public Key**

### Passo 5: Atualizar o código
No arquivo `contact.html`, substitua:
```javascript
emailjs.init("YOUR_PUBLIC_KEY"); // Linha ~361
// E na linha ~434:
const result = await emailjs.sendForm(
    'YOUR_SERVICE_ID', 
    'YOUR_TEMPLATE_ID', 
    form
);
```

---

## Opção 2: Formspree (Mais Simples)

### Passo 1: Criar conta no Formspree
1. Acesse [https://formspree.io/](https://formspree.io/)
2. Crie uma conta gratuita
3. Crie um novo formulário
4. Copie o endpoint URL : https://formspree.io/f/xovlpgpb

### Passo 2: Atualizar o formulário
No `contact.html`, adicione o atributo `action` ao formulário:
```html
<form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Passo 3: Simplificar o JavaScript
Substitua a função de envio por:
```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (response.ok) {
        showNotification('Mensagem enviada com sucesso!', 'success');
        form.reset();
    } else {
        showNotification('Erro ao enviar mensagem.', 'error');
    }
});
```

---

## Configuração Atual

Por enquanto, o formulário está configurado para:
- ✅ Validar os campos
- ✅ Mostrar estado de "Enviando..."
- ✅ Exibir notificações bonitas
- ✅ Simular envio (2 segundos de delay)
- ✅ Log dos dados no console

Para ativar o envio real, escolha uma das opções acima!

## Email de Destino Configurado
📧 **official_greentoastsoftware@outlook.com**
