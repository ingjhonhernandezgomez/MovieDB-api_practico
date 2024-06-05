let page = 1;
let maxPage;
let infityScroll;
let additionalParams;

searchFormBtn.addEventListener('click',()=>{
    location.hash = `#search=${searchFormInput.value}`;
});

trendingBtn.addEventListener('click',()=>{
    location.hash = '#trends';
});

arrowBtn.addEventListener('click',()=>{
    history.back();
    //location.hash = '#home';
});

language.addEventListener('click', () => {
    if(lang!=language.value){
        lang = language.value;
        api.defaults.params['language'] = lang;
        homePage();
        getTittleLenguages(lang);
    }
});

window.addEventListener('DOMContentLoaded',navigation, false);
window.addEventListener('hashchange',navigation, false);
window.addEventListener('scroll',()=>{
    
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 20);
    const isMaxPage = page < maxPage ;

    if(scrollIsBottom && infityScroll && isMaxPage){
        console.log('entro')
        page++;
        // Verifica el número de parámetros que la función puede recibir
        if (infityScroll.length >= 1) {
            infityScroll(...additionalParams, page);
        } else {  // Si la función espera solo un parámetro
            infityScroll(page);
        }
    }
});

function navigation(){
    
    console.log({location})
    
    if(infityScroll){
        infityScroll=undefined;
        additionalParams=undefined;
        page = 1;
    }

    if(location.hash.startsWith('#trends')){
        trendsPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        moviePage();
    }else if(location.hash.startsWith('#category=')){
        categoryPage();
    }else{
        homePage();
    }

    document.body.scrolltop = 0;
    document.documentElement.scrolltop = 0;
}

function getTittleLenguages(lang){

    switch (lang) {
        case 'es':

            trendingPreviewTitle.innerHTML = 'Tendencia';
            categoriesPreviewTitle.innerHTML = 'Categorias';
            relatedMoviesTitle.innerHTML = 'Peliculas similares';
            likedTitle.innerHTML = 'Peliculas favoritas';
            trendingBtn.innerHTML = 'Ver mas'

            break;
        
        case  'pt-BR':
            
            trendingPreviewTitle.innerHTML = 'Tendência';
            categoriesPreviewTitle.innerHTML = 'Categorias';
            relatedMoviesTitle.innerHTML = 'Filmes semelhantes';
            likedTitle.innerHTML = 'Filmes favoritos';
            trendingBtn.innerHTML = 'Ver mas'

            break;
        
        case  'fr':
            
            trendingPreviewTitle.innerHTML = "S'orienter";
            categoriesPreviewTitle.innerHTML = 'Catégories';
            relatedMoviesTitle.innerHTML = 'Films similaires';
            likedTitle.innerHTML = 'Films préférés';
            trendingBtn.innerHTML = 'Voir plus'

            break;
        default:
            
            trendingPreviewTitle.innerHTML = 'Trend';
            categoriesPreviewTitle.innerHTML = 'Categories';
            relatedMoviesTitle.innerHTML = 'Similar movies';
            likedTitle.innerHTML = 'Favorite movies';
            trendingBtn.innerHTML = 'Ver mais';

    }
    

}

function homePage(){
    console.log('!!#home');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    likedMoviesSection.classList.remove('inactive');
    language.classList.remove('inactive');

    getPopularMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

function categoryPage(){
    console.log('!!#category');

    headerSection.classList.remove('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    language.classList.add('inactive');

    const [_, categoryInfo] = location.hash.split('=');
    const [categoryId, categoryName] = categoryInfo.split('-'); 

    headerCategoryTitle.innerHTML = decodeURIComponent(categoryName);

    getMoviesByCategories(categoryId, categoryName);
    additionalParams = [categoryId, categoryName];
    infityScroll = getMoviesByCategories;
}

function moviePage(){
    console.log('!!#movie');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    language.classList.add('inactive');

    const [_, movieId] = location.hash.split('=');
    getMovieById(movieId);
}

function searchPage(){
    console.log('!!#search');

    headerSection.classList.remove('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    
    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    language.classList.add('inactive');

    const [_, searchValue] = location.hash.replaceAll('%20', ' ').split('=');
    getMoviesBySearch(searchValue);
    additionalParams = [searchValue];
    infityScroll = getMoviesBySearch;
}

function trendsPage(){
    console.log('!!#trends');

    headerSection.classList.remove('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    language.classList.add('inactive');

    getPopularMovies();
    infityScroll = getPopularMovies;
}