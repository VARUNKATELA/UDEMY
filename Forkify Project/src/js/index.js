import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

// * Global state of the app 
// * - Search Object, Shopping recipe Object, Liked Recipes//

const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();
  //  console.log(query);

  if (query) {
    state.search = new Search(query)

    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    await state.search.getResults();

    // console.log(resultt);
    clearLoader();
    searchView.renderResults(state.search.result);
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPage.addEventListener('click', e => {

  const btn = e.target.closest('.btn-inline');
  // console.log(btn)
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    console.log(state.search.result);
    searchView.renderResults(state.search.result, goToPage);
  }
});

const controlRecipe = async () => {

  const id = window.location.hash.replace('#', '');
  console.log(id);

  if (id) {
    state.recipe = new Recipe(id);
    try {

      await state.recipe.getRecipe();

      state.recipe.calcTime();

      state.recipe.calcServings();  

      console.log(state.recipe);
    }
    catch (error) {
      alert('Error Processing Recipe!');
    }

  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));