export async function exibirEvolucoes(pokemonId) {
   const evolucoesContainer = document.getElementById("modalEvolutions");
   evolucoesContainer.innerHTML = "";

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
           <span>${evolutionName}</span>
       `;

       evolucoesContainer.appendChild(evolutionDiv);
       currentEvolution = currentEvolution.evolves_to[0];
   } while (currentEvolution);
}