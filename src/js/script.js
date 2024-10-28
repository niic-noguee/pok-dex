import { capturarPokemons, mostrarPokemons } from './pokemonService.js';
import { abrirModal, fecharModal } from './modal.js';

let offset = 0;
const limit = 20;
const input = document.querySelector("header input");
const carregarMaisBtn = document.getElementById("carregarMaisBtn");

async function iniciarApp() {
    await capturarPokemons();
    mostrarPokemons(offset, limit);
    offset += limit;
}

input.addEventListener("input", () => {
    mostrarPokemons(0, limit, input.value.toLowerCase());
});

carregarMaisBtn.addEventListener("click", () => {
    mostrarPokemons(offset, limit);
    offset += limit;
});

iniciarApp();