const displayHtml = document.getElementById('display');
const loadMore = document.getElementById('loadMore');
const limit =5;
let offset = 0;
let maxRecords = 151;

function formatId(id){
  if(id < 10){
    return `#00`
  }
  else if(id < 100){
    return `#0`
  }
  else{
    return `#`
  }
}

function convertePokemonToHtml(pokemon){
    const format = formatId(pokemon.number);
    const typesHtml = pokemon.types.map((type) => `<li class=types>${type}</li>`).join('');
    
    return `
                  <li class="background">
                  <div class="top ${pokemon.type}">
                      <span class="name">${pokemon.name}</span>
                      <span class="id-pokemon">${format}${pokemon.number}</span>
                      <ol class="abilities">
                        ${typesHtml}
                      </ol>
                      <div class="config-image">
                        <img src="${pokemon.img}" alt="${pokemon.name}">
                    </div>
                </div>

                  <div class="bottom">
                    <span class="about">about</span>
                    <div class="about-all">
                        <span class="category">Species<span class="specie">${pokemon.species}</span></span>
                        <span class="category">Height<span class="height">${pokemon.height.toFixed(2)}cm</span></span>
                        <span class="category">Weight<span class="weight">${pokemon.libra.toFixed(1)} lbs (${pokemon.weight})</span></span>
                        <span class="category">Abilities<span class="abilities-cat">${pokemon.abilities}</span></span>
                        <div class="breeding">Breeding</div>
                        <span class="category">Gender<span class="gender">${pokemon.gender}</span></span> 
                        <span class="category">Egg Groups<span class="monster">${pokemon.eggGroups}</span></span>
                        <span class="category">Egg Cycle<span class="gas">${pokemon.eggCycle}</span></span>
                    </div>    
                  </div>
                </li>  `;
}
//Convertendo a lista de pokemons em HTML
function loadPokemonItens(offset,limit){


    pokeApi.getPokemons(offset,limit).then((pokemonList =[]) => {
    
        const listObjectToHttp = pokemonList.map((pokemon) => convertePokemonToHtml(pokemon)).join('');
        
        displayHtml.innerHTML =  listObjectToHttp;
    }
)
    
}
loadPokemonItens(offset, limit);
//logica para mudar de pagina
loadMore.addEventListener('click', () =>{
  offset += limit;
  const totalOffset = offset + limit;

  if(totalOffset >= maxRecords){
    const restLimit = maxRecords - offset;
    loadPokemonItens(offset,restLimit);
    loadMore.parentElement.removeChild(loadMore)
  }
  else{
    loadPokemonItens(offset,limit);
  }
});
 