var todosPokemons = [];
var qtPokemons = 1025;

/**
 * Função para capturar dados dos Pokémons da API.
 */
async function capturarPokemons() {
    var resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + qtPokemons);
    var dados = await resposta.json();
    todosPokemons = dados.results;
    mostrarPokemons(todosPokemons);
}

/**
 * Função para exibir os Pokémons na página.
 */
function mostrarPokemons(pokemons) {
    var pokeContainer = document.querySelector(".pokeContainer");
    pokeContainer.innerHTML = "";

    pokemons.forEach((pokemon) => {
        var pokeCard = document.createElement("div");
        pokeCard.classList.add("pokeCard");

        var pokemonUrl = pokemon.url;
        var pokemonId = pokemonUrl.split("/")[pokemonUrl.split("/").length - 2];

        var img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        var id = document.createElement("span");
        id.textContent = `ID: ${pokemonId}`;

        var name = document.createElement("span");
        name.textContent = pokemon.name;

        pokeCard.appendChild(img);
        pokeCard.appendChild(id);
        pokeCard.appendChild(name);

        // Aqui usamos uma função de seta para preservar o valor correto do pokemonId
        pokeCard.addEventListener("click", () => {
            exibirDetalhesPokemon(pokemonId);
        });

        pokeContainer.appendChild(pokeCard);
    });
}

/**
 * Função para exibir detalhes do Pokémon no modal.
 */
async function exibirDetalhesPokemon(pokemonId) {
    var resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    var pokemon = await resposta.json();

    document.getElementById("modal-name").textContent = pokemon.name;
    document.getElementById("modal-img").src = pokemon.sprites.front_default;
    document.getElementById("modal-id").textContent = pokemon.id;
    document.getElementById("modal-height").textContent = (pokemon.height / 10).toFixed(1); // Altura em metros
    document.getElementById("modal-weight").textContent = (pokemon.weight / 10).toFixed(1); // Peso em kg
    document.getElementById("modal-types").textContent = pokemon.types.map(t => t.type.name).join(", ");

    document.getElementById("pokeModal").style.display = "block";
}

/**
 * Função para filtrar os Pokémons com base na entrada do usuário.
 */
function filtrarPokemons() {
    var input = document.querySelector("header input");
    var filtro = input.value.toLowerCase();
    var pokemonsFiltrados = todosPokemons.filter(pokemon => {
        var pokemonUrl = pokemon.url;
        var pokemonId = pokemonUrl.split("/")[pokemonUrl.split("/").length - 2];
        return pokemon.name.toLowerCase().includes(filtro) || pokemonId.includes(filtro);
    });
    mostrarPokemons(pokemonsFiltrados);
}

// Evento para fechar o modal
document.querySelector(".close-button").addEventListener("click", () => {
    document.getElementById("pokeModal").style.display = "none";
});

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    var modal = document.getElementById("pokeModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Adicionar evento de input ao campo de pesquisa
document.querySelector("header input").addEventListener("input", filtrarPokemons);

// Carregar os Pokémons quando a página abrir
capturarPokemons();
