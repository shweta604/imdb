const search = document.getElementById('search');
const movieList = document.getElementById('search-list');

// get movies from the api as per the user search
async function searchMovies(searchInput) {
    // url to search 
    const url = `http://www.omdbapi.com/?s=${searchInput}&page=1&apikey=f19863a8`;
    
    // fetch returns a promise
    const response = await fetch(`${url}`);
    const data = await response.json();
    // console.log(data);
    // console.log(data.Search);
    if(data.Response == 'True') {
        showMoviesList(data.Search);
    }
}

// get what the user is typing
function findMovies() {
    let searchInput = search.value;
    
    // remove white spaces to get correct search result
    searchInput = searchInput.trim();

    // console.log(searchInput);
    if(searchInput.length > 0){
        // the ul should be visible if the user is searching
        movieList.classList.remove('search-list-hidden');

        // if your is searching movies then get the movies
        searchMovies(searchInput);
    } else {
        // when the search bar is blank
        movieList.classList.add('search-list-hidden');
    }
}

// on every key up search for movies
search.addEventListener('keyup', findMovies);

// movies as per the user search
function showMoviesList(moviesArray){
    movieList.innerHTML = '';
    // create list item for every movie and append it in the search list
    for(let index = 0; index < moviesArray.length; index++) {
        let movie = document.createElement('li');
        // console.log(movie);
        
        // set the imdb id as data-id
        movie.dataset.id = moviesArray[index].imdbID;
        movie.classList.add('search-item');
        
        movie.innerHTML = `
            <h4>${moviesArray[index].Title}</h4>
            <i class="fa-2x fa-solid fa-heart"></i>`;
        
        // console.log(movie);

        movieList.append(movie);
    }
}