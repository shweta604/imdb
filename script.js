const search = document.getElementById('search');
const movieList = document.getElementById('search-list');
const movieContainer = document.getElementById('movie-container');
const favourites = document.getElementById('favourites');
const favList = document.getElementById('favourite-list');
const favContainer = document.getElementById('fav-container');
const alert = document.getElementById('fav-alert');
const alertText = document.getElementById('alert');

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

// empty the favourite page if the someone is typing
search.addEventListener('click', function(){
    favList.innerHTML = '';
})

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

        // fetch movie from api by clicking on title
        title.addEventListener('click', async()=> {
            // empty the search field
            search.value = ``;

           // empty the ul
            movieList.innerHTML = '';

            // empty the fav container
            favList.innerHTML = ``;

            // console.log(movieLi.dataset.id);

            // go to
            const movieURL = await fetch(`https://www.omdbapi.com/?i=${movieLi.dataset.id}&page=1&apikey=f19863a8`);
            const details = await movieURL.json();
            // console.log(details);
            displayMovie(details);
        });

        // fetch movie from api by clicking on fav and adding the movie to favourites
        favourite.addEventListener('click', async()=> {
            // console.log(movieLi.dataset.id);

            // show alert that the movie has been added
            showAlert();

            // go to
            const movieURL = await fetch(`https://www.omdbapi.com/?i=${movieLi.dataset.id}&page=1&apikey=f19863a8`);
            const details = await movieURL.json();
            // console.log(details);
            addtofav(details);
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

// local storage is a property that allows javascript to store data in a browser.
// CRUD operations can be performed using local storage.

// as local storage takes key value pair i will create an array which will contain all movies added to favourites
function favMovieList(){
    let data = localStorage.getItem('favMovies') ? JSON.parse(localStorage.getItem('favMovies')) : []; // parse converts the data into javascript object
    return data;
}


// add to favourites and local storage
function addtofav(details){
    let favItems = favMovieList();
    
    // check whether the movie already exists in favourites page
    let flag = false;

    favItems.forEach(favItem=>{
        if(favItem.imdbID === details.imdbID){
            flag = true;
        }
    })

    if(!flag){
        // push movie details in favItems so it will get added to favourite list
        favItems.push(details);
    }

    // as local storage only takes string elements for json data its necessary to use stringify
    // save the movie in local storage
    localStorage.setItem('favMovies', JSON.stringify(favItems));
    // console.log(window.localStorage);
}

// go to favourites page
favourites.addEventListener('click', function(){
    // make search field blank
    search.innerHTML = ``;

    // empty the ul
    movieList.innerHTML = '';

    // make movie page blank
    movieContainer.innerHTML = ``;

    // show favourites page
    favContainer.classList.remove('fav-page-hidden');

    search.addEventListener('click', ()=>{
        // hide favourites page
        favContainer.classList.add('fav-page-hidden');
    })

    // make favourite list blank to load it from scratch
    favList.innerHTML = ``;

    let favItems = favMovieList();

    favItems.forEach(favItem=>{
        const favMovieItem = document.createElement('div');
        // display movie in favourites page
        favMovieItem.innerHTML = `
            <div class="card" style="width: 18rem; margin: 2rem" data-id="${favItem.imdbID}">
                <img class="card-img-top" src="${favItem.Poster}" alt="${favItem.Title}">
                <div class="card-body">
                    <h5 class="card-title">${favItem.Title}</h5>
                    <p class="card-text">${favItem.Plot}</p>
                    <button class="btn btn-danger delete">Remove from Favourites</button>
                </div>
            </div>`;


        const deletefavMovie = favMovieItem.querySelector('.delete');
        deletefavMovie.addEventListener('click', deleteMovie);

        // append the movies in the fav list
        favList.append(favMovieItem);
    })
})

// display alert when a movie is added to favourites
function showAlert(){
    alert.classList.remove('alertContainer-hidden');
    setTimeout(function(){
        alert.classList.add('alertContainer-hidden');
    }, 1000);
};


// remove an item from the favourites list
function deleteMovie(event){
    // select the movie card to be deleted
    const deleteItem = event.target.parentElement.parentElement;
    // console.log(deleteItem);

    let favItems = favMovieList();

    const id = deleteItem.dataset.id;
    // console.log(id);
    
    // remove the movie from favourite list
    favList.remove(deleteItem);

    // filter out all the movies which doesnt have the same id and return them
    favItems = favItems.filter(function(favItem){
        if(favItem.imdbID !== id){
            return favItem;
        }
    });

    // save the filtered items in local storage
    localStorage.setItem('favMovies', JSON.stringify(favItems));
};
