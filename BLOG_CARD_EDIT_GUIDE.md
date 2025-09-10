# Guia Rápido: Como Adicionar ou Editar um Card no Blog

## 1. Localize a seção de cards no arquivo do blog
No arquivo `SPE_blog.html`, procure por esta estrutura:

```html
<div class="blog-card">
    <img src="NOME_DA_IMAGEM.png" alt="Nome do App">
    <div class="blog-card-content">
        <h3>Título do Card</h3>
        <p>Resumo ou descrição do post.</p>
        <a href="#">Ler mais</a>
    </div>
</div>
```

## 2. Para adicionar um novo card
- Copie todo o bloco `<div class="blog-card"> ... </div>`
- Cole logo abaixo do último card dentro da `<section class="blog-grid">`
- Edite os campos conforme necessário:
    - **Imagem:** Troque o nome do arquivo no `src` (ex: `SPE_icon.png`)
    - **Título:** Edite o texto dentro do `<h3>`
    - **Resumo:** Edite o texto dentro do `<p>`
    - **Link:** Troque o endereço do `<a href="#">`

## 3. Exemplo de novo card
```html
<div class="blog-card">
    <img src="GreenPC Info_icon.png" alt="GreenPC Info">
    <div class="blog-card-content">
        <h3>GreenPC Info: Monitoramento inteligente</h3>
        <p>Veja como o GreenPC Info pode ajudar você a entender e otimizar o desempenho do seu computador.</p>
        <a href="https://seusite.com/artigo-greenpc" target="_blank">Ler mais</a>
    </div>
</div>
```

## 4. Para editar um card existente
- Basta alterar os textos, imagem ou link do card desejado.

## 5. Dicas
- As imagens devem estar na pasta raiz do projeto.
- Use links reais ou mantenha `#` se não houver artigo.
- Mantenha a estrutura para garantir o visual correto.

---

**Pronto! Agora você pode adicionar ou editar cards do blog facilmente!**
