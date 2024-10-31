const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

async function carregarDetalhesPokemon(id) {
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        
        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado");
        }

        const pokemon = await resposta.json();

        // Atualizando os elementos HTML com os dados do Pokémon
        document.getElementById("pokemonImg").src = pokemon.sprites.front_default;
        document.getElementById("pokemonName").textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        document.getElementById("pokemonId").textContent = `ID: ${pokemon.id}`;
        document.getElementById("pokemonWeight").textContent = `Peso: ${pokemon.weight} hectogramas`;
        document.getElementById("pokemonHeight").textContent = `Altura: ${pokemon.height} decímetros`;
        document.getElementById("pokemonType").textContent = `Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}`;
        document.getElementById("pokemonAbilities").textContent = `Habilidades: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}`;

        // Para exibir stats
        const stats = pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
        document.getElementById("pokemonStats").textContent = `Estatísticas: ${stats}`;

        // Carregar evoluções
        const evolucoesContainer = document.getElementById("evolutions");
        evolucoesContainer.innerHTML = ''; // Limpa evoluções anteriores
        await exibirEvolucoes(pokemonId, evolucoesContainer);
        
    } catch (error) {
        document.querySelector(".pokemon-details").textContent = "Pokémon não encontrado.";
        console.error("Erro ao carregar os detalhes do Pokémon:", error);
    }
}

async function exibirEvolucoes(pokemonId, container) {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const pokemonSpecies = await resposta.json();
    const evolutionUrl = pokemonSpecies.evolution_chain.url;
    const evolutionResponse = await fetch(evolutionUrl);
    const evolutionChain = await evolutionResponse.json();

    let currentEvolution = evolutionChain.chain;
    do {
        const evolutionName = currentEvolution.species.name;
        const evolutionId = currentEvolution.species.url.split("/").slice(-2)[0];

        const evolutionDiv = document.createElement("div");
        evolutionDiv.classList.add("evolution");
        evolutionDiv.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolutionId}.png" />
            <span>${evolutionName.charAt(0).toUpperCase() + evolutionName.slice(1)}</span>
        `;

        container.appendChild(evolutionDiv);
        currentEvolution = currentEvolution.evolves_to[0];
    } while (currentEvolution);
}

// Carregar os detalhes do Pokémon assim que a página for carregada
carregarDetalhesPokemon(pokemonId);