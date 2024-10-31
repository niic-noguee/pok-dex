import { capturarPokemons, mostrarPokemons } from './pokemonService.js';

let offset = 0;
const limit = 20;

const input = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const carregarMaisBtn = document.getElementById("carregarMaisBtn");

async function iniciarApp() {
    await capturarPokemons();
    mostrarPokemons(offset, limit);
    offset += limit;
}

function executarPesquisa() {
    mostrarPokemons(0, limit, input.value.toLowerCase().trim());
}

// Executa a pesquisa apenas ao clicar no botão de busca
searchButton.addEventListener("click", executarPesquisa);

carregarMaisBtn.addEventListener("click", () => {
    mostrarPokemons(offset, limit);
    offset += limit;
});

// Inicia a aplicação
iniciarApp();