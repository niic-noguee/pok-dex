let todosPokemons = [];
let qtPokemons = 1025; // Total de Pokémons na Pokédex
let quantidadePorPagina = 20; // Número de Pokémons por "página"
let paginaAtual = 0; // Página atual para controle do carregamento

/**
 * Função para capturar dados dos Pokémons da API.
 * Utiliza async/await para realizar a chamada de forma assíncrona.
 */
async function capturarPokemons() {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtPokemons}`);
    const dados = await resposta.json();
    todosPokemons = dados.results;
    carregarMaisPokemons(); // Carrega a primeira "página" de Pokémons
}

/**
 * Função para carregar e exibir mais Pokémons na página.
 */
function carregarMaisPokemons() {
    const inicio = paginaAtual * quantidadePorPagina;
    const fim = inicio + quantidadePorPagina;
    const pokemonsParaMostrar = todosPokemons.slice(inicio, fim);
    mostrarPokemons(pokemonsParaMostrar);
    paginaAtual++;
}

/**
 * Função para exibir os Pokémons na página.
 * Recebe uma lista de Pokémons como parâmetro.
 */
function mostrarPokemons(pokemons) {
    const pokeContainer = document.querySelector(".pokeContainer");

    pokemons.forEach(async (pokemon) => {
        const pokeCard = document.createElement("div");
        pokeCard.classList.add("pokeCard");

        // Capturando detalhes adicionais do Pokémon
        const detalhesResposta = await fetch(pokemon.url);
        const detalhes = await detalhesResposta.json();

        const img = document.createElement("img");
        img.src = detalhes.sprites.front_default;

        const id = document.createElement("span");
        id.textContent = `ID: ${detalhes.id}`;

        const name = document.createElement("span");
        name.textContent = pokemon.name;

        // Adicionar elementos ao card
        pokeCard.appendChild(img);
        pokeCard.appendChild(id);
        pokeCard.appendChild(name);

        // Evento de clique para abrir o modal com mais informações
        pokeCard.addEventListener("click", () => abrirModal(detalhes));

        // Adicionar card ao container
        pokeContainer.appendChild(pokeCard);
    });
}

/**
 * Função para exibir o modal com informações detalhadas do Pokémon.
 */
async function abrirModal(detalhes) {
    const modal = document.getElementById("pokeModal");
    modal.style.display = "flex"; // Exibe o modal

    document.getElementById("modalImg").src = detalhes.sprites.front_default;
    document.getElementById("modalName").textContent = detalhes.name;
    document.getElementById("modalId").textContent = `ID: ${detalhes.id}`;
    document.getElementById("modalType").textContent = "Tipo(s): " + detalhes.types.map(type => type.type.name).join(", ");
    document.getElementById("modalAbilities").textContent = "Habilidades: " + detalhes.abilities.map(ability => ability.ability.name).join(", ");
    document.getElementById("modalWeight").textContent = `Peso: ${detalhes.weight / 10} kg`;
    document.getElementById("modalHeight").textContent = `Altura: ${detalhes.height / 10} m`;

    // Exibindo os status do Pokémon
    const stats = detalhes.stats;
    document.getElementById("modalAttack").textContent = `Ataque: ${stats.find(stat => stat.stat.name === "attack").base_stat}`;
    document.getElementById("modalDefense").textContent = `Defesa: ${stats.find(stat => stat.stat.name === "defense").base_stat}`;
    document.getElementById("modalHP").textContent = `HP: ${stats.find(stat => stat.stat.name === "hp").base_stat}`;
    document.getElementById("modalSpeed").textContent = `Velocidade: ${stats.find(stat => stat.stat.name === "speed").base_stat}`;

    // Exibir evoluções do Pokémon
    await mostrarEvolucoes(detalhes);
}

/**
 * Função para obter e exibir evoluções do Pokémon.
 */
async function mostrarEvolucoes(detalhes) {
    // URL da cadeia de evolução do Pokémon
    const especiesResposta = await fetch(detalhes.species.url);
    const especies = await especiesResposta.json();
    const evolucaoResposta = await fetch(especies.evolution_chain.url);
    const evolucao = await evolucaoResposta.json();

    const evolucoes = obterEvolucoes(evolucao.chain);
    const evolucaoContainer = document.getElementById("modalEvolutions");

    // Limpa as evoluções anteriores
    evolucaoContainer.innerHTML = "";

    evolucoes.forEach(async (evolucao) => {
        const evolucaoCard = document.createElement("div");
        evolucaoCard.classList.add("evolucaoCard");

        const detalhesResposta = await fetch(evolucao.url);
        const detalhesEvolucao = await detalhesResposta.json();

        const img = document.createElement("img");
        img.src = detalhesEvolucao.sprites.front_default;
        const name = document.createElement("span");
        name.textContent = detalhesEvolucao.name;

        evolucaoCard.appendChild(img);
        evolucaoCard.appendChild(name);
        evolucaoContainer.appendChild(evolucaoCard);
    });
}

/**
 * Função recursiva para obter todas as evoluções.
 */
function obterEvolucoes(cadeia) {
    const evolucoes = [];
    let atual = cadeia;

    while (atual) {
        evolucoes.push({ name: atual.species.name, url: atual.species.url });
        atual = atual.evolves_to[0]; // Pega apenas a primeira evolução
    }

    return evolucoes;
}

/**
 * Função para fechar o modal.
 */
function fecharModal() {
    const modal = document.getElementById("pokeModal");
    modal.style.display = "none";
}

// Adiciona o evento para fechar o modal ao clicar no "X" ou fora do modal
document.querySelector(".close-button").addEventListener("click", fecharModal);
window.addEventListener("click", (event) => {
    const modal = document.getElementById("pokeModal");
    if (event.target === modal) {
        fecharModal();
    }
});

/**
 * Função para filtrar os Pokémons com base na entrada do usuário.
 */
function filtrarPokemons() {
    const input = document.querySelector("header input");
    const filtro = input.value.toLowerCase();
    const pokemonsFiltrados = todosPokemons.filter(pokemon => {
        const pokemonUrl = pokemon.url;
        const pokemonId = pokemonUrl.split("/")[pokemonUrl.split("/").length - 2];
        return pokemon.name.toLowerCase().includes(filtro) || pokemonId.includes(filtro);
    });
    document.querySelector(".pokeContainer").innerHTML = ""; // Limpa os cards atuais
    mostrarPokemons(pokemonsFiltrados);
}

// Adiciona o evento ao campo de pesquisa para filtrar ao digitar
document.querySelector("header input").addEventListener("input", filtrarPokemons);

// Adiciona o evento ao botão "Carregar Mais" para carregar mais Pokémons
document.getElementById("carregarMaisBtn").addEventListener("click", carregarMaisPokemons);

// Captura e exibe os Pokémons na inicialização
capturarPokemons();