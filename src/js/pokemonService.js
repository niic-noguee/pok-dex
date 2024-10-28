import { abrirModal } from './modal.js';

export let todosPokemons = [];

/**
 * Captura dados dos Pokémon da API e ordena por ID.
 */
export async function capturarPokemons() {
    const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
    const dados = await resposta.json();
    todosPokemons = dados.results.sort((a, b) => {
        return parseInt(a.url.split("/").slice(-2)[0]) - parseInt(b.url.split("/").slice(-2)[0]);
    });
}

/**
 * Exibe Pokémon na tela, com ou sem filtro.
 */
export function mostrarPokemons(offset, limit, filtro = '') {
    const container = document.querySelector(".pokeContainer");
    container.innerHTML = "";

    const pokemonsFiltrados = todosPokemons.filter(pokemon => {
        const pokemonId = pokemon.url.split("/").slice(-2)[0];
        return pokemon.name.includes(filtro) || pokemonId.includes(filtro);
    }).slice(offset, offset + limit);

    pokemonsFiltrados.forEach(pokemon => {
        const card = document.createElement("div");
        card.classList.add("pokeCard");

        const pokemonId = pokemon.url.split("/")[pokemon.url.split("/").length - 2];
        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" />
            <span>ID: ${pokemonId}</span>
            <span>${pokemon.name}</span>
        `;
        
        card.addEventListener("click", () => abrirModal(pokemonId, pokemon.name));
        container.appendChild(card);
    });
}