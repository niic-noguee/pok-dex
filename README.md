# Pokédex

Este projeto é uma Pokédex simples desenvolvida com HTML, CSS e JavaScript. A aplicação permite visualizar uma lista de Pokémons usando a API pública do PokéAPI. É possível buscar Pokémons por nome ou por ID.

## Funcionalidades

- **Exibição de Pokémons**: Mostra uma lista de Pokémons com sua imagem, ID e nome.
- **Busca por Nome e ID**: Permite buscar Pokémons tanto pelo nome quanto pelo ID usando um campo de pesquisa.

## Tecnologias

- **HTML**: Estrutura básica da aplicação.
- **CSS**: Estilização da interface.
- **JavaScript**: Lógica para captura de dados e manipulação da DOM.

## Configuração

Para executar este projeto localmente, siga estas etapas:

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/seu-usuario/pokedex.git
   ```

2. **Navegue até o Diretório do Projeto**:
   ```bash
   cd pokedex
   ```

3. **Abra o Arquivo `index.html` em um Navegador**:
   - Você pode abrir o arquivo diretamente no navegador ou usar um servidor local para visualização.

## Como Funciona

1. **Captura de Dados**:
   - O arquivo `script.js` faz uma requisição para a API do PokéAPI para obter dados dos Pokémons.
   - Os dados são armazenados e exibidos na página.

2. **Exibição dos Pokémons**:
   - A função `mostrarPokemons` é responsável por criar e exibir os cards dos Pokémons na página.

3. **Busca de Pokémons**:
   - O campo de pesquisa permite buscar Pokémons pelo nome ou ID. A função `filtrarPokemons` é usada para filtrar os resultados com base na entrada do usuário.

## Contribuição

Se você deseja contribuir para este projeto, sinta-se à vontade para abrir uma *issue* ou *pull request*. 
