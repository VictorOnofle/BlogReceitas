/* ================= CONFIGURAÇÕES E DADOS ================= */
const apiKey = '78d3d84f8b2b4ea6b264120ffab9818d'; 
let receitas = []; 

/* ================= FERRAMENTAS DE TRADUÇÃO ================= */
const dicionario = {
    "frango": "chicken", "carne": "beef", "peixe": "fish",
    "arroz": "rice", "feijão": "beans", "batata": "potato",
    "macarrão": "pasta", "queijo": "cheese", "ovo": "egg",
    "salada": "salad", "fruta": "fruit", "doce": "dessert",
    "chocolate": "chocolate", "bolo": "cake", "hambúrguer": "burger",
    "limão": "lemon", "morango": "strawberry", "leite": "milk"
};

function traduzirTermoBusca(termo) {
    const termoLower = termo.toLowerCase().trim();
    return dicionario[termoLower] || termo; 
}

async function traduzirTextoAPI(texto) {
    if (!texto) return "";
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=en|pt-br`;
        const res = await fetch(url);
        const data = await res.json();
        return data.responseData.translatedText;
    } catch (e) {
        console.error("Erro tradução:", e);
        return texto; 
    }
}

/* ================= LÓGICA DE EXIBIÇÃO (RENDER) ================= */
function renderizarComidas(lista) {
    const container = document.getElementById('foodContainer');
    container.innerHTML = '';

    if(lista.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhuma receita encontrada.</p>';
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => abrirModal(item); 
        
        card.innerHTML = `
            <img src="${item.img}" alt="${item.nome}" class="card-img-top">
            <div class="card-body">
                <h3>${item.nome}</h3>
                <div class="card-subtitle">
                    <span><i class="fa-regular fa-clock"></i> ${item.tempo}</span>
                    <span class="badge">${item.tipo || 'Geral'}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

/* ================= API: BUSCA E VITRINE ================= */

// Função 1: Vitrine
async function carregarVitrine() {
    const container = document.getElementById('foodContainer');
    container.innerHTML = '<p style="color:var(--text-main)">Carregando vitrine...</p>';

    try {
        // Endpoint 'random' da Spoonacular
        const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=4&tags=main course`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.recipes) return;

        // Processa as receitas (sem traduzir tudo agora para economizar)
        // Vamos traduzir apenas os TITULOS em paralelo
        const receitasProcessadas = await Promise.all(data.recipes.map(async (prato) => {
            const tituloPt = await traduzirTextoAPI(prato.title);
            
            return {
                id: prato.id,
                nome: tituloPt,
                tipo: "Sugestão", // Label fixo para vitrine
                img: prato.image,
                tempo: prato.readyInMinutes + "min",
                // Guarda dados em inglês para traduzir ao clicar (Lazy Load)
                ingredientes_en: prato.extendedIngredients.map(ing => ing.original),
                instrucoes_en: prato.instructions || "No instructions provided.",
                traduzidoCompleto: false,
                tags: ["api"]
            };
        }));

        receitas = receitasProcessadas;
        renderizarComidas(receitas);

    } catch (error) {
        console.error("Erro vitrine:", error);
        container.innerHTML = '<p>Erro ao carregar vitrine. Verifique a API Key.</p>';
    }
}

// Função 2: Busca por termo (Search Bar)
async function buscarReceitaAPI() {
    const termoInput = document.getElementById('searchInput').value;
    if(!termoInput) return;

    const termoIngles = traduzirTermoBusca(termoInput);
    const container = document.getElementById('foodContainer');
    
    // Feedback visual
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Buscando...</p>';

    try {
        const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${termoIngles}&number=4&fillIngredients=true&addRecipeInformation=true&instructionsRequired=true`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || !data.results.length) {
            renderizarComidas([]); 
            return;
        }

        const receitasEncontradas = await Promise.all(data.results.map(async (prato) => {
            const tituloPt = await traduzirTextoAPI(prato.title);
            return {
                id: prato.id,
                nome: tituloPt, 
                tipo: "Resultado",
                img: prato.image,
                tempo: prato.readyInMinutes + "min",
                ingredientes_en: prato.extendedIngredients.map(ing => ing.original),
                instrucoes_en: prato.instructions,
                traduzidoCompleto: false,
                tags: ["api"]
            };
        }));

        receitas = receitasEncontradas;
        renderizarComidas(receitas);

    } catch (error) {
        console.error(error);
        alert("Erro na conexão.");
    }
}

/* ================= MODAL E TRADUÇÃO TARDIA ================= */
async function abrirModal(receita) {
    // Adicionei um botão de fechar extra no footer e destaquei o X
    const modalHtml = `
        <div id="recipeModal" class="modal-overlay">
            <div class="modal-content">
                <button class="close-btn-x" onclick="fecharModal()">&times;</button>
                
                <img src="${receita.img}" class="modal-img">
                <h2>${receita.nome}</h2>
                <p><strong>Tempo:</strong> ${receita.tempo}</p>
                
                <div class="modal-section">
                    <h3>Ingredientes:</h3>
                    <ul id="listaIngredientes">
                        ${receita.traduzidoCompleto ? 
                          receita.ingredientes.map(i => `<li>${i}</li>`).join('') : 
                          '<li><i class="fa-solid fa-spinner fa-spin"></i> Traduzindo ingredientes...</li>'}
                    </ul>
                </div>

                <div class="modal-section">
                    <h3>Modo de Preparo:</h3>
                    <p id="textoInstrucoes">
                        ${receita.traduzidoCompleto ? 
                          receita.instrucoes : 
                          '<i class="fa-solid fa-spinner fa-spin"></i> Traduzindo modo de preparo...'}
                    </p>
                </div>

                <div class="modal-footer">
                    <button class="btn-fechar-modal" onclick="fecharModal()">Fechar Detalhes</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    
    if (!receita.traduzidoCompleto) {
        await realizarTraducaoCompleta(receita);
    }
}

async function realizarTraducaoCompleta(receita) {
    try {
        const textoIngredientes = receita.ingredientes_en.join(" | ");
        
        const [ingredientesTraduzidosStr, instrucoesTraduzidas] = await Promise.all([
            traduzirTextoAPI(textoIngredientes),
            traduzirTextoAPI(receita.instrucoes_en)
        ]);

        receita.ingredientes = ingredientesTraduzidosStr.split("|").map(s => s.trim());
        receita.instrucoes = instrucoesTraduzidas;
        receita.traduzidoCompleto = true; 

        // Atualiza modal aberto
        const listaUl = document.getElementById('listaIngredientes');
        const pInstrucoes = document.getElementById('textoInstrucoes');

        if (listaUl) listaUl.innerHTML = receita.ingredientes.map(i => `<li>${i}</li>`).join('');
        if (pInstrucoes) pInstrucoes.innerText = receita.instrucoes;

    } catch (erro) {
        console.error("Falha na tradução tardia:", erro);
        const pInstrucoes = document.getElementById('textoInstrucoes');
        if(pInstrucoes) pInstrucoes.innerText = receita.instrucoes_en + " (Tradução indisponível)";
    }
}

function fecharModal() {
    const modal = document.getElementById('recipeModal');
    if (modal) modal.remove();
}

/* ================= INICIALIZAÇÃO ================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Carrega as 4 receitas aleatórias na vitrine
    carregarVitrine();

    // 2. Configura a busca (Enter e Clique na Lupa)
    const inputBusca = document.getElementById('searchInput');
    const iconBusca = document.getElementById('btnBuscaIcone');

    if (inputBusca) {
        inputBusca.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarReceitaAPI();
        });
    }
    if (iconBusca) {
        iconBusca.addEventListener('click', buscarReceitaAPI);
    }

    // 3. Tema
    const btnTema = document.getElementById('themeBtn');
    if (btnTema) {
        btnTema.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const icon = btnTema.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    }
});