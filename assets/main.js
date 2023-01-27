const btnContainer = document.querySelector(".pagination");
const prevBTN = document.querySelector(".left");
const nextBTN = document.querySelector(".right");
const cardsContainer = document.querySelector(".cards-container");
const pageNumber = document.querySelector(".page-number");
const filterButtons = document.querySelectorAll(".btn");
const filterContainer = document.querySelector(".filter-container");

/* Las imágenes de movieDB vienen con una URL de base la cual se tiene que colocar en conjunto con lo que venga en el objeto de cada película para que la imagen aparezca. Guardamos esta en una constante. 
Para mas referencia :  https://developers.themoviedb.org/3/getting-started/images . Elegimos para esta APP el tamaño original.
*/
const imgBaseUrl = "https://image.tmdb.org/t/p/original"
// Objeto para setear la pagina actual, el total de paginas y el parametro de busqueda en la api
 
const pageController = {
    page : null,
    total : null,
    searchParameter : TRENDING
};
// funcion que servira como seleccionador del filtro que tomaremos para hacer la llamada a la api
const parameterSelector = (filterType) =>{
    return filterType === "TOPRATED"
    ? TOPRATED
    : filterType === "UPCOMING"
    ? UPCOMING
    : TRENDING;
};
// SIL LA PERSONA QUE TOCO ALGUNO DE LOS DOS EVENTOS CONTIENE LAS CLASES DENTRO DEL METODO CONTAINS RETORNA
// 
const changeSearchParameter = (e) => {
  if (
    !e.target.classList.contains("btn") ||
    e.target.classList.contains("btn--active")
  )
    return;
    const selectedParameter = e.target.dataset.filter
    pageController.searchParameter = parameterSelector(selectedParameter)
    
    const buttons = [...filterButtons]
    buttons.forEach((btn)=>{
        if (btn.dataset.filter !== selectedParameter){
            btn.classList.remove("btn--active")
        }else{
            btn.classList.add("btn--active")
        }
    })
    getMovies()
};

//Funcion para formatear la fecha que nos viene dada en la propiedad release_date dde cada pelicula 

const formatDate = (date) =>{
    const [year,month,day] = date.split("-")
    return `${day}/${month}/${year}`
}

const renderCard = (movie) =>{
    const {title, poster_path, vote_average, release_date} = movie

    return `
        <div class="card">
        <img loading="lazy"  src=${
          poster_path
            ? imgBaseUrl + poster_path
            : "./assets/img/placeholder.png"
        } alt="${title}}" class="card-img"
        />
        <div class="card-popularity">
        ${Math.floor(vote_average * 10)}% de popularidad
        </div>
        <div class="card-content">
            <h2>${title}</h2>
            <p>Fecha de estreno: ${formatDate(release_date)}</p>
        </div>
    </div>`
    }

    // funcion de renderizado del loader
const renderLoader = () => {
    return `   
      <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>`;
  };

const renderCards = (movies) =>{
   cardsContainer.innerHTML = movies.map((movie)=> renderCard(movie)).join("") 
};

// Desabilitar boton atras cuando sea  la pagina

const disableProviousBtn = (page) => {
    if(page===1) {
        prevBTN.classList.add("disabled")
    }else{
        prevBTN.classList.remove("disabled")
    };
};

const disableNexBTN = (page, total) =>{
    page===total
        ?nextBTN.classList.add("disabled")
        :nextBTN.classList.remove("disabled")
}

// setear visual de la aplicacion que se colocara en la funcion change page
const setPagination = () =>{
    pageNumber.innerHTML = pageController.page
    disableProviousBtn(pageController.page)
    disableNexBTN(pageController.page , pageController.total)
}

// funcion loader que se genere un efecto de carga hasta que se rendericen las cards

const loadAndShow = (movies) => {
    setTimeout(()=>{
        renderCards(movies.results)
        filterContainer.scrollIntoView({
            behavior: "smooth",
        })
    },1500)
}

/// Funcion para fetchear las peliculas 
const getMovies = async () =>{
    cardsContainer.innerHTML = renderLoader()
    const movies = await fetchMovies(pageController.searchParameter)

    pageController.total = movies.total_pages
    pageController.page = movies.page

    setPagination()
    renderCards(movies.results)
}

//Funcion para cambiar de pagina con prev y next button
const changePage = async () =>{
    cardsContainer.innerHTML = renderLoader()
    const movies = await fetchMovies(
        pageController.searchParameter,
        pageController.page
    )
    setPagination()
    loadAndShow(movies)
}

//Usamos stopInmediatePropagation (para que no se propague el evento click) al padre

const nextPage = async (e) =>{
    e.stopImmediatePropagation()
    if(pageController.page=== pageController.total)return
    pageController.page +=1
    changePage()
}

const previousPage = async (e) =>{
    e.stopInmediatePropagation()
    if(pageController.page=== pageController.total)return
    pageController.page -=1
    changePage()
}

//Funcion inicializadora
//En esta funcion agregamos los listeners de los botones de paginacion, del cargado de dom y el listener
// para cambiar el tipo e filtro
    
const init = () => {
    window.addEventListener("DOMContentLoaded", getMovies);
    nextBTN.addEventListener("click", nextPage);
    prevBTN.addEventListener("click", previousPage);
    filterContainer.addEventListener("click", changeSearchParameter);
  };

init();