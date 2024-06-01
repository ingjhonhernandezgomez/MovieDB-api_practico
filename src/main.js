const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    },
    params: {
        'api_key':API_KEY
    }
});

//UTILS
function createMovies(movies, section){

    section.innerHTML = '';

    movies.forEach(movie => {
        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click',()=>{
            location.hash = `#movie=${movie.id}`;
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg)

        section.appendChild(movieContainer);

    });
}

function createCategories(categories, section){

    section.innerHTML = '';

    categories.forEach(categorie => {
        //const section = document.querySelector('#categoriesPreview .categoriesPreview-list');
        //section.innerHTML('');

        const categoriesContainer = document.createElement('div');
        categoriesContainer.classList.add('category-container');

        const categorieTitle = document.createElement('h3');
        categorieTitle.classList.add('category-title');
        categorieTitle.setAttribute('id','id' + categorie.id);
        categorieTitle.addEventListener('click',()=>{
            location.hash = `#category=${categorie.id}-${categorie.name}`
        });

        const categorieText = document.createTextNode(categorie.name);
        
        categorieTitle.appendChild(categorieText);
        categoriesContainer.appendChild(categorieTitle);

        section.appendChild(categoriesContainer);

    });
}

//llamados API
async function getPopularMoviesPreview(){

    const {data} = await api(`trending/movie/day`);
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);

    /*
    movies.forEach(movie => {
        //const section = document.querySelector('#trendingPreview .trendingPreview-movieList');
        //section.innerHTML('');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg)

        trendingMoviesPreviewList.appendChild(movieContainer);

    });*/

    console.log({data, movies});

}

async function getCategoriesPreview(){

    const {data} = await api(`genre/movie/list`);
    const categories = data.genres;

    createCategories(categories, categoriesPreviewList);

}

async function getMoviesByCategories(id, name){
    
    genericSection.innerHTML = '';
    headerCategoryTitle.innerHTML = name;

    const {data} = await api(`discover/movie`,{
        params:{
            with_genres: id
        }
    });

    const movies = data.results;

    createMovies(movies, genericSection);

    /*
    movies.forEach(movie => {
        //const section = document.querySelector('#trendingPreview .trendingPreview-movieList');
        //section.innerHTML('');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg)

        genericSection.appendChild(movieContainer);

    });*/

    console.log({data, movies});

}

async function getMoviesBySearch(filtro){

    const {data} = await api(`search/movie`,{
        params:{
            query: filtro
        }
    });

    const movies = data.results;

    createMovies(movies, genericSection);

}

async function getPopularMovies(){

    const {data} = await api(`trending/movie/day`);
    const movies = data.results;

    createMovies(movies, genericSection);

    /*
    movies.forEach(movie => {
        //const section = document.querySelector('#trendingPreview .trendingPreview-movieList');
        //section.innerHTML('');

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute('src','https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieContainer.appendChild(movieImg)

        trendingMoviesPreviewList.appendChild(movieContainer);

    });*/

    console.log({data, movies});

}

async function getMovieById(movieId){

    const {data:movie} = await api(`movie/${movieId}`);
    
    const movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + movie.poster_path;
    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%),
        url(${movieImgUrl})`


    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres, movieDetailCategoriesList);
    getSimilarMoviesById(movieId);
}

async function getSimilarMoviesById(movieId){

    const {data} = await api(`movie/${movieId}/similar`);
    const similarMovies = data.results;

    createMovies(similarMovies, relatedMoviesContainer)

}



