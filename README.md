# 🧪 Food IA - Vitrine Gastronômica

> Uma experiência web imersiva que conecta culinária internacional e tecnologia, traduzindo sabores do mundo para o português em tempo real.

![Badge Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Sobre o Projeto

O **Food IA** é uma aplicação web desenvolvida para explorar o consumo de APIs externas e manipulação assíncrona de dados. O objetivo é criar um "Laboratório Culinário" onde o usuário pode descobrir receitas de todo o mundo.

O diferencial do projeto é a integração de **duas APIs distintas**: uma para buscar as receitas (originalmente em inglês) e outra para realizar a **tradução automática** dos ingredientes e instruções para o português, quebrando barreiras linguísticas para o usuário final.

---

## ✨ Funcionalidades

* **🔍 Busca Inteligente:** Pesquise por qualquer ingrediente ou prato (em português). O sistema traduz o termo, busca na base de dados global e retorna os resultados.
* **🎲 Vitrine "Lazy Load":** Ao abrir a aplicação, sugestões aleatórias são carregadas para inspirar o usuário.
* **🌎 Tradução em Tempo Real:** Títulos, ingredientes e modos de preparo são traduzidos do inglês para o português via API de tradução.
* **🌗 Tema Dinâmico:** Alternância suave entre **Dark Mode** (Neon/Futurista) e **Light Mode** para melhor acessibilidade e conforto visual.
* **📱 Design Responsivo:** Interface adaptável que funciona bem em desktops e dispositivos móveis, com layout em Grid e Flexbox.
* **⚡ Modal Detalhado:** Visualização completa da receita sem sair da página principal, com indicadores de carregamento (spinners) enquanto a tradução é processada.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas de desenvolvimento web, sem dependência de frameworks pesados (Vanilla JS).

* **HTML5 Semântico:** Estrutura acessível e organizada.
* **CSS3 Avançado:**
    * Uso de *CSS Variables* para gerenciamento de temas.
    * Layouts com *CSS Grid* e *Flexbox*.
    * Efeitos de *Glassmorphism* e transições suaves.
    * Fontes *Orbitron* (títulos) e *Roboto* (corpo) via Google Fonts.
* **JavaScript (ES6+):**
    * Manipulação do DOM.
    * Funções assíncronas (`async/await`) e `Promise.all` para performance.
    * Tratamento de erros (`try/catch`).

### 🔌 APIs Integradas

1.  **[Spoonacular API](https://spoonacular.com/food-api):** Fonte dos dados das receitas (imagens, tempos, instruções).
2.  **[MyMemory Translation API](https://mymemory.translated.net/doc/spec.php):** Responsável por traduzir o conteúdo recebido para PT-BR.

---

## 📂 Estrutura de Pastas

```bash
/
├── index.html      # Estrutura principal
├── style.css       # Estilização e temas (Dark/Light)
├── script.js       # Lógica de consumo de API e tradução
└── images/         # Assets locais (se houver)
