import Search from "./models/Search";
import * as searchView from './views/searchView' 
import * as recipeView from './views/recipeView'
import * as listView from "./views/listView";
import * as likeView from './views/likesView';
import List from "./models/List";
import { elements, renderLoder, clearLoader } from "./views/base";
import Recipe from "./models/recipe";
import Likes from "./models/Likes";
// Globel state of app
// * - search object
// * - Current recipee  object
// * - Shopping-list object
// * - liked object
const state = {}
window.state = state;
// search controller
const controleSerach = async () => {
// 1 Get query from view
const query = searchView.getInput();
console.log()
    if(query){
        // new search object and push it on state object
        state.search = new Search(query);
        // prepair UI for result
        searchView.claerInput();
        searchView.claerResults();
        renderLoder(elements.searchRes);
        try {
        //search for Results
       await state.search.getResult('pizza')
       //Render results on UI
       clearLoader();
       searchView.renderResults(state.search.result);    
        } catch (error) {
            alert('Something went wrong with Search...');
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controleSerach();
});
// elements.searchForm
// window.addEventListener('load', e =>{
//     e.preventDefault();
//     controleSerach();
// });
elements.searchResPages.addEventListener('click', e => {
   const btn = e.target.closest('.btn-inline')
   if(btn){ 
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.claerResults();
    searchView.renderResults(state.search.result, goToPage);
    // console.log(goToPage);
} 
});
// Recipee controller
// const r = new Recipe(35626);
// r.getRecipe();
// console.log(r);
const contrRecipe = async () => {
    const id = window.location.hash.replace('#','');
    console.log(id);
    if(id){
        //prepair UI
        recipeView.clearRecipe();
        renderLoder(elements.recipe)
      if(state.search)  searchView.heighlightSelected(id);
        //create new Recipee object
        state.recipe = new Recipe(id);
        // window.r = state.recipe;
        try {
             //get recipr data
        await state.recipe.getRecipe();
        state.recipe.parseIngrediant();
        //calc serving and time
        state.recipe.calcTime();
        state.recipe.calcServing();
        //Render recipee
        // console.log(state.recipe);
        clearLoader();
        recipeView.recipeRender(
            state.recipe,
            state.likes.isLiked(id)
            );     
        } catch (error) {
            alert('Error processing... recipe');
        }
    }
}
['hashchange','load'].forEach(event => window.addEventListener(event, contrRecipe))
//list controller
const controlList = () =>{
    if(!state.list) state.list = new List();
            state.recipe.ingrediant.forEach(el =>{
     const item =   state.list.addItem(el.count, el.unit, el.ingrediant);
        listView.renderItem(item)
    });
    elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')){
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

  // Handle the count update 
  }
  else if(e.target.matches('.shopping__count--value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val)
  }
});
}
// state.likes = new Likes();
// like controller
const controlLike = () =>{
    if(!state.likes) state.likes = new Likes();
    const CurrentID = state.recipe.id;
    if(!state.likes.isLiked(CurrentID)){
        const newLike = state.likes.addLike(
            CurrentID,
            state.recipe.title,
            state.recipe.auther,
            state.recipe.img
        )
        likeView.toggleLikeBtn(true)
        likeView.renderLikes(newLike);
        console.log(state.likes)
    }
    else{
        state.likes.deleteLike(CurrentID)
        likeView.toggleLikeBtn(false)
        likeView.deleteLike(CurrentID);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());
}
window.addEventListener('load', () =>{
    state.likes = new Likes();
    state.likes.readStorage();
    likeView.toggleLikeMenu(state.likes.getNumLikes())
    state.likes.likes.forEach(like => likeView.renderLikes(like))
})
// *************************
//hendling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
       if(state.recipe.serving > 1){
        state.recipe.updateServing('dec');
        recipeView.updateServingsIngredients(state.recipe)
    }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServing('inc');
        recipeView.updateServingsIngredients(state.recipe)
    }
    else if(e.target.matches('.recipe__btn-add, .recipe__btn--add *')){
        controlList()
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike()
    }
});
window.l = new List();