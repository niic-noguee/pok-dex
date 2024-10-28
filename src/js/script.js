let todosPokemons = [];
let qtPokemons = 1025; // Número total de Pokémon na Pokédex
let offset = 0; // Controle de quantos Pokémon já foram carregados
const limit = 20; // Número de Pokémon para carregar a cada vez

/**
 * Função para capturar dados dos Pokémons da API.
 * Utiliza async/await para realizar a chamada de forma assíncrona.
 */
async function capturarPokemons() {
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${qtPokemons}`);
        const dados = await resposta.json();
        todosPokemons = dados.results;

        // Ordenando os Pokémon pela ordem de ID
        todosPokemons.sort((a, b) => {
            const idA = parseInt(a.url.split("/").slice(-2)[0]);
            const idB = parseInt(b.url.split("/").slice(-2)[0]);
            return idA - idB;
        });

        mostrarPokemons(todosPokemons.slice(offset, offset + limit));
        offset += limit;
    } catch (error) {
        console.error("Erro ao capturar dados dos Pokémons:", error);
    }
}

/**
 * Função para exibir os Pokémons na página.
 * Recebe uma lista de Pokémons como parâmetro.
 */
function mostrarPokemons(pokemons) {
    const pokeContainer = document.querySelector(".pokeContainer");
    pokemons.forEach(pokemon => {
        const pokeCard = document.createElement("div");
        pokeCard.classList.add("pokeCard");

        const pokemonUrl = pokemon.url;
        const pokemonId = pokemonUrl.split("/")[pokemonUrl.split("/").length - 2];

        const img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        const id = document.createElement("span");
        id.textContent = `ID: ${pokemonId}`;

        const name = document.createElement("span");
        name.textContent = pokemon.name;

        pokeCard.appendChild(img);
        pokeCard.appendChild(id);
        pokeCard.appendChild(name);

        // Abrir o modal ao clicar no card
        pokeCard.addEventListener("click", () => abrirModal(pokemonId, pokemon.name));

        pokeContainer.appendChild(pokeCard);
    });
}

/**
 * Função para abrir o modal com detalhes do Pokémon e suas evoluções.
 */
async function abrirModal(pokemonId, pokemonName) {
    const modal = document.getElementById("pokeModal");
    const modalImg = document.getElementById("modalImg");
    const modalName = document.getElementById("modalName");
    const modalId = document.getElementById("modalId");
    const modalType = document.getElementById("modalType");
    const modalAbilities = document.getElementById("modalAbilities");
    const modalWeight = document.getElementById("modalWeight");
    const modalHeight = document.getElementById("modalHeight");
    const modalAttack = document.getElementById("modalAttack");
    const modalDefense = document.getElementById("modalDefense");
    const modalHP = document.getElementById("modalHP");
    const modalSpeed = document.getElementById("modalSpeed");
    const modalEvolutions = document.getElementById("modalEvolutions");

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemon = await resposta.json();

        modalImg.src = pokemon.sprites.front_default;
        modalName.textContent = pokemonName;
        modalId.textContent = `ID: ${pokemonId}`;
        modalType.textContent = `Tipo: ${pokemon.types.map(type => type.type.name).join(", ")}`;
        modalAbilities.textContent = `Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(", ")}`;
        modalWeight.textContent = `Peso: ${pokemon.weight / 10} kg`;
        modalHeight.textContent = `Altura: ${pokemon.height / 10} m`;
        modalAttack.textContent = `Ataque: ${pokemon.stats[1].base_stat}`;
        modalDefense.textContent = `Defesa: ${pokemon.stats[2].base_stat}`;
        modalHP.textContent = `HP: ${pokemon.stats[0].base_stat}`;
        modalSpeed.textContent = `Velocidade: ${pokemon.stats[5].base_stat}`;

        await exibirEvolucoes(pokemonId, modalEvolutions);
        
        modal.style.display = "flex";
    } catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
    }
}

/**
 * Função para exibir a cadeia de evolução do Pokémon.
 */
async function exibirEvolucoes(pokemonId, evolucoesContainer) {
    evolucoesContainer.innerHTML = ""; // Limpar evoluções anteriores

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const pokemonSpecies = await resposta.json();
        const evolutionUrl = pokemonSpecies.evolution_chain.url;
        
        const evolutionResponse = await fetch(evolutionUrl);
        const evolutionChain = await evolutionResponse.json();
        
        let currentEvolution = evolutionChain.chain;
        do {
            const evolutionName = currentEvolution.species.name;
            const evolutionId = currentEvolution.species.url.split("/").slice(-2)[0];

            const evolutionImg = document.createElement("img");
            evolutionImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionId}.png`;
            const evolutionSpan = document.createElement("span");
            evolutionSpan.textContent = evolutionName;

            const evolutionDiv = document.createElement("div");
            evolutionDiv.classList.add("evolution");
            evolutionDiv.appendChild(evolutionImg);
            evolutionDiv.appendChild(evolutionSpan);

            evolucoesContainer.appendChild(evolutionDiv);

            currentEvolution = currentEvolution.evolves_to[0];
        } while (currentEvolution);
    } catch (error) {
        console.error("Erro ao buscar evoluções do Pokémon:", error);
    }
}

/**
 * Função para fechar o modal.
 */
document.querySelector(".close-button").addEventListener("click", () => {
    document.getElementById("pokeModal").style.display = "none";
});

/**
 * Função para carregar mais Pokémon.
 */
document.getElementById("carregarMaisBtn").addEventListener("click", () => {
    mostrarPokemons(todosPokemons.slice(offset, offset + limit));
    offset += limit;
});

/**
 * Função para filtrar os Pokémons com base na entrada do usuário.
 */
function filtrarPokemons() {
    const input = document.querySelector("header input");
    const filtro = input.value.toLowerCase();
    const pokemonsFiltrados = todosPokemons.filter(pokemon => {
        const pokemonId = pokemon.url.split("/").slice(-2)[0];
        return pokemon.name.toLowerCase().includes(filtro) || pokemonId.includes(filtro);
    });
    document.querySelector(".pokeContainer").innerHTML = "";
    mostrarPokemons(pokemonsFiltrados.slice(0, limit));
}

document.querySelector("header input").addEventListener("input", filtrarPokemons);

// Carregar os primeiros Pokémon ao carregar a página
capturarPokemons();