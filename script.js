const search = document.getElementById('search');
const movieList = document.getElementById('search-list');
const movieContainer = document.getElementById('container');

// get movies from the api as per the user search
async function searchMovies(searchInput) {
    // url to search 
    const url = `https://www.omdbapi.com/?s=${searchInput}&page=1&apikey=f19863a8`;
    
    // fetch returns a promise
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    // console.log(data.Search);
    if(data.Response == 'True') {
        movieList.innerHTML = '';
         // create list item for every movie and append it in the search list
        data.Search.forEach(movieItem=>{
            let movie = document.createElement('li');
            // console.log(movie);
            
            // set the imdb id as data-id
            movie.dataset.id = movieItem.imdbID;
            movie.classList.add('search-item');
            
            movie.innerHTML = `
                <h4>${movieItem.Title}</h4>
                <i class="fa-2x fa-solid fa-heart"></i>`;
            
            // console.log(movie);

            movieList.append(movie);
            trackMovie();
        })
    }
}

// get what the user is typing
function findMovies() {
    let searchInput = search.value;
    
    // remove white spaces to get correct search result
    searchInput = searchInput.trim();

    // console.log(searchInput);
    if(searchInput.length > 0){
        // activate the hidden class
        movieList.classList.remove('search-list-hidden');
        movieContainer.innerHTML = ``;

        // if your is searching movies then get the movies
        searchMovies(searchInput);
    } else {
        // when the search bar is blank
        movieList.classList.add('search-list-hidden');
    }
}

// on every key up search for movies
search.addEventListener('keyup', findMovies);

// get movie by title
function trackMovie() {
    const searchMovie = movieList.querySelectorAll('.search-item');
    searchMovie.forEach(movieLi=>{
        // console.log(movieLi);
        const title = movieLi.children[0];
        const favourite = movieLi.children[1];

        // go to the movie page by clicking on title
        title.addEventListener('click', async()=> {
            // empty the ul
            movieList.innerHTML = '';

            // console.log(movieLi.dataset.id);
            // go to
            const movieURL = await fetch(`https://www.omdbapi.com/?i=${movieLi.dataset.id}&page=1&apikey=f19863a8`);
            const details = await movieURL.json();
            console.log(details);
            displayMovie(details);
        });
    });
}

// display movie details on movie page
function displayMovie(details){
    movieContainer.innerHTML = `
        <div class="poster">
            <img src="${details.Poster}" alt="${details.Title}">
        </div>
        <div class="details">
            <h3><em>title: ${details.Title}</em></h3>
            <p><u><em>${(details.Awards !== 'N/A' ? details.Awards : '')}</em></u></p>
            <p><b>released:</b> ${details.Year}</p>
            <p><b>actors:</b> ${details.Actors}</p>
            <p><b>plot:</b> <i>${details.Plot}</i></p>
        </div>`;
}