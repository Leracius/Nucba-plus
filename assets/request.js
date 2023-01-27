// la key de la APIconst KEY = "41feec8a9d3342819493d80be4799dad";
const KEY = "41feec8a9d3342819493d80be4799dad";
// Creamos 3 constantes, una para cada URL de la llamada a la API. Estas constantes se usaran como parametros
// En la funcion fetchmovies y seran controladas mediante el objeto page controller que esta al final de la pagina

const TRENDING = `https://api.themoviedb.org/3/trending/movie/week?api_key=${KEY}&language=en-US`;
const TOPRATED = `https://api.themoviedb.org/3/movie/top_rated?api_key=${KEY}&language=en-US`;
const UPCOMING =`https://api.themoviedb.org/3/movie/upcoming?api_key=${KEY}&language=en-US`;

const fetchMovies = async(searchTerm, page = 1)=>{
    const res = await fetch(searchTerm + `&page=${page}`);
    const data = await res.json();
    console.log(data);
    
    return data
};

