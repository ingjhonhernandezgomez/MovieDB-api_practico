//DATA
let lang = 'en';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    },
    params: {
        'api_key':API_KEY,
        'language':navigator.language
    }
});

function likedMoviesList(){

    const item = localStorage.getItem('liked_movies');
    let movies;

    if(item){
        movies = JSON.parse(item);
    }else{
        movies = {};
    }

    return movies;
}

function likeMovie(movie){

    let likedMovies = likedMoviesList();

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    }else{
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies));

}

//UTILS
function createMovies(
    movies, 
    section, 
    {
        lazyload = false, 
        clean = true
    }={})
{

    if(clean){
        section.innerHTML = '';
    }
    

    movies.forEach(movie => {
        
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movie.title);
        movieImg.setAttribute(
            lazyload ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path);

        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute('src', `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}`)
        });
        movieImg.addEventListener('click',()=>{
            location.hash = `#movie=${movie.id}`;
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click',()=>{
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
            getLikedMovies();
        });

        movieContainer.appendChild(movieImg)
        movieContainer.appendChild(movieBtn);

        section.appendChild(movieContainer);

        if(lazyload){
            lazyLoader.observe(movieImg);
        }
        
    });
}

const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
        
    })
})

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

    createMovies(movies, trendingMoviesPreviewList, {lazyload:true});

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

async function getMoviesByCategories(id, name, page=1){

    const {data} = await api(`discover/movie`,{
        params:{
            with_genres: id,
            page: page
        }
    });

    const movies = data.results;
    maxPage = data.total_pages;
    
    createMovies(
        movies, 
        genericSection, 
        {
            lazyload:true,
            clean: page == 1
        });

    console.log({data, movies});

}

async function getMoviesBySearch(filtro, page=1){

    const {data} = await api(`search/movie`,{
        params:{
            query: filtro,
            page:page
        }
    });

    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(movies, 
        genericSection,
        {
            lazyload:true,
            clean: page == 1
        });

    console.log({data, movies});
}

async function getPopularMovies(page=1){

    const {data} = await api(`trending/movie/day`,{
        params:{
            page: page
        }
    });
    const movies = data.results;
    maxPage = data.total_pages;

    createMovies(
        movies, 
        genericSection, 
        {
            lazyload:true,
            clean: page == 1
        });

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

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const moviesArray = Object.values(likedMovies);

    createMovies(moviesArray, 
        likedMoviesListArticle, 
        {lazyload:true, clean:true});

    console.log(moviesArray);
}


