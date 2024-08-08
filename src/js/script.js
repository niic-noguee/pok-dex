var todosPokemons = [];
var qtPokemons = 1025;

/**
 * Função para capturar dados dos Pokémons da API.
 * Utiliza async/await para realizar a chamada de forma assíncrona.
 */
async function capturarPokemons() {
    // Fazendo requisição para a API do PokéAPI com o limite definido
    var resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=" + qtPokemons);
    var dados = await resposta.json();

    todosPokemons = dados.results;

    // Chamando função para exibir os Pokémons na página
    mostrarPokemons(todosPokemons);
}

/**
 * Função para exibir os Pokémons na página.
 * Recebe uma lista de Pokémons como parâmetro.
 */
function mostrarPokemons(pokemons) {
    var pokeContainer = document.querySelector(".pokeContainer");
    pokeContainer.innerHTML = ""; // Limpando o container antes de adicionar novos cards

    for (var i = 0; i < pokemons.length; i++) {
        var pokeCard = document.createElement("div");
        pokeCard.classList.add("pokeCard");

        // Extraindo o ID do Pokémon da URL
        var pokemonUrl = pokemons[i].url;
        var pokemonId = pokemonUrl.split("/")[pokemonUrl.split("/").length - 2];

        // Criar elementos para imagem e nome do Pokémon
        var img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        var id = document.createElement("span");
        id.textContent = `ID: ${pokemonId}`;

        var name = document.createElement("span");
        name.textContent = pokemons[i].name;

        // Adicionar elementos ao card
        pokeCard.appendChild(img);
        pokeCard.appendChild(id);
        pokeCard.appendChild(name);

        // Adicionar card ao container
        pokeContainer.appendChild(pokeCard);
    }
}

/**
 * Função para filtrar os Pokémons com base na entrada do usuário.
 * Permite a busca tanto pelo nome quanto pelo ID.
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

// Adicionar evento de input ao campo de pesquisa
document.querySelector("header input").addEventListener("input", filtrarPokemons);

// Chamando a função para capturar e exibir os Pokémons quando a página carrega
capturarPokemons();