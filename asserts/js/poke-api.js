
const pokeApi = {};

function convertDetailToPokemon(pokeDetail, specieDetails) {
  const pokemon = new Pokemon();

  if (!pokeDetail) {
      console.error("Erro: Detalhes do Pokemon estão indefinidos.");
      return pokemon;
  }

  if (!specieDetails) {
      console.error("Erro: Detalhes da especie estão indefinidos.");
      return pokemon;
  }

  pokemon.name = pokeDetail.name;
  pokemon.number = pokeDetail.id;
  const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
  const [type] = types;
  pokemon.types = types;
  pokemon.type = type;
  pokemon.img = pokeDetail.sprites.other.dream_world.front_default;

  pokemon.height = pokeDetail.height/10
  pokemon.weight = pokeDetail.weight.toString().slice(0, 1) + '.' + pokeDetail.weight.toString().slice(1) + ' kg'; // Formato "X.Y kg"
  
  pokemon.libra = parseFloat(pokemon.weight) * 2.20462;
  pokemon.abilities = pokeDetail.abilities.map((slotAbilities) => slotAbilities.ability.name);
  pokemon.gender = specieDetails.gender_rate === 1 ? ["♂️ Male"] : ["♀️ Female"];
  pokemon.species = specieDetails.genera.find((spec) => spec.language.name === 'en').genus;
  pokemon.eggGroups = specieDetails.egg_groups.map((group) => group.name).join(', ');
  pokemon.eggCycle = pokemon.type;

  return pokemon;
}

pokeApi.getPokemonApi = (pokemon) => {
  console.log("Fetching Pokemon API:", pokemon.url);
  return fetch(pokemon.url)
      .then((response) => response.json());
};

pokeApi.getPokemonSpecies = (speciesUrl) => {
  console.log("Fetching Pokemon species API:", speciesUrl);
  return fetch(speciesUrl)
      .then((response) => response.json());
};

pokeApi.getPokemonDetails = (pokemon) => {
  return pokeApi.getPokemonApi(pokemon)
      .then((pokeDetail) =>
          pokeApi.getPokemonSpecies(pokeDetail.species.url).then((speciesDetail) =>
              convertDetailToPokemon(pokeDetail, speciesDetail)
          )
      );
};

pokeApi.getPokemons = (offset = 0, limit = 10) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

  return fetch(url)
      .then((response) => response.json())
      .then((jsonBody) => jsonBody.results)
      .then((detailRequests) =>
          Promise.all(detailRequests.map((pokemon) => pokeApi.getPokemonDetails(pokemon)))
      )
      .catch((error) => console.error("Erro ao buscar Pokémons:", error));
};


