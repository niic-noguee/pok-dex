import { exibirEvolucoes } from './evolutionService.js';

const modal = document.getElementById("pokeModal");

export async function abrirModal(pokemonId, pokemonName) {
    const modalImg = document.getElementById("modalImg");
    const modalName = document.getElementById("modalName");
    const modalId = document.getElementById("modalId");

    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemon = await resposta.json();

    modalImg.src = pokemon.sprites.front_default;
    modalName.textContent = pokemonName;
    modalId.textContent = `ID: ${pokemonId}`;

    await exibirEvolucoes(pokemonId);
    modal.style.display = "flex";
}

export function fecharModal() {
    modal.style.display = "none";
}

document.querySelector(".close-button").addEventListener("click", fecharModal);
