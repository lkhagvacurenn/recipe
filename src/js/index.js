import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import { renderRecipe, clearRecipe, highlightSelectedRecipe} from "./view/recipeView";
import List from "./model/List";
import * as listView from './view/listView';
import Like from "./model/Like";
import * as likesView from './view/likesView';


const state = {};

/**
 * Хайлтын контроллер = Model ==> Controller <== View
 */
const controlSearch = async () => {
  // 1) Вэбээс хайлтын түлхүүр үгийг гаргаж авна.
  const query = searchView.getInput();

  if (query) {
    // 2) Шинээр хайлтын обьектийг үүсгэж өгнө.
    state.search = new Search(query);

    // 3) Хайлт хийхэд зориулж дэлгэцийг UI бэлтгэнэ.
    searchView.clearSearch();
    searchView.clearSearchResults();
    renderLoader(elements.searchResultDiv);

    // 4) Хайлтыг гүйцэтгэнэ
    await state.search.doSearch();

    // 5) Хайлтын үр дүнг дэлгэцэнд үзүүлнэ.
    clearLoader();
    if (state.search.result === undefined) alert("Хайлтаар илэрцгүй...");
    else searchView.renderRecipes(state.search.result);
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.pageButtons.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResults();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/**
 * Жорын контролллер
 */
const controlRecipe = async () => {
  // 1) URL-аас ID-ийг салгаж
  const id = window.location.hash.replace("#", "");
  if (id){
        // 2) Жорын моделийг үүсгэж өгнө.
    state.recipe = new Recipe(id);

    // 3) UI дэлгэцийг бэлтгэнэ.
    clearRecipe();
    renderLoader(elements.recipeDiv);
    highlightSelectedRecipe(id);

    // 4) Жороо татаж авчирна.
    await state.recipe.getRecipe();

    // 5) Жорыг гүйцэтгэх хугацаа болон орцыг тооцоолно
    clearLoader();
    state.recipe.calcTime();
    state.recipe.calcHuniiToo();

    // 6) Жороо дэлгэцэнд гаргана
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
  
};

['hashchange', 'load'].forEach(event => {
  window.addEventListener(event, controlRecipe);
});

window.addEventListener("load", () => {
  state.likes = new Like();
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  state.likes.likes.forEach(like => likesView.renderLikes(like));
});

// Nairlaganii controller

 const controlList = () => {
    state.list = new List();
    
    listView.clearItems();

    state.recipe.ingredients.forEach(n => {
        const item = state.list.addItem(n);
        listView.renderItem(item);
    });

}

// Like controller
const controlLike = () =>{
   if(!state.likes) state.likes = new Like();

    const currentRecipeId = state.recipe.id;

    if(state.likes.isLiked(currentRecipeId)){
        state.likes.deleteLike(currentRecipeId);
        likesView.deleteLike(currentRecipeId);
        likesView.toggleLikeButton(false);
    } else {
        console.log("unliked");
        const newLike = state.likes.addLike(
            currentRecipeId,
             state.recipe.title,
             state.recipe.publisher,
            state.recipe.image_url);  
            likesView.renderLikes(newLike);   
            likesView.toggleLikeButton(true);
    }
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}
elements.recipeDiv.addEventListener("click", e => {
  if (e.target.matches(".recipe__btn") || e.target.closest(".recipe__btn")) {
    controlList();
  } else if (e.target.matches(".recipe__love") || e.target.closest(".recipe__love")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener('click', e=> {
    const id =e.target.closest(".shopping__item").dataset.itemid;
    state.list.deleteItem(id);
    listView.deleteItem(id);
})