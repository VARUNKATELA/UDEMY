import { elements } from "./base";
export const getInput = () => elements.searchInput.value;
export const claerInput = () => { 
    elements.searchInput.value = '';
};
export const claerResults = () =>{
    elements.searchResList.innerHTML = ''; 
    elements.searchResPages.innerHTML = '';
};
export const heighlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results_link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results_link--active');
}
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc,cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};
export const renderRecipes = recipe => {
 const markup = `
    <li>
        <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data"> 
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>`
        elements.searchResList.insertAdjacentHTML('beforeend',markup);
}
    const createButton = (page, type) => 
        `<button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        </button>
        `
 const renderButtons = (page, numResult, resPerPage) =>{
   const pages = Math.ceil(numResult / resPerPage );
   let button;
   if(page === 1 && pages > 1){
        //show next page
         button = createButton(page, 'next'); 
    }
    else if(page < pages){
        //show both pages
        button = `
        ${createButton(page, 'prev')},
        ${createButton(page, 'next')}
        `
    }
    else if(page === pages && pages > 1){
        //show prev page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}
export const renderResults = (recipes, page = 2, resPerPage = 10) => {
    //render the result
   const strt = (page - 1) * resPerPage; 
   const end  =  page * resPerPage;
    recipes.slice(strt, end) .forEach(renderRecipes);
    //render the button
    renderButtons(page, recipes.length, resPerPage);
};