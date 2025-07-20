import ErrorList from 'antd/es/form/ErrorList.js';
import { elements } from './base.js';
export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link " href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}
export const clearSearch = () => {
    elements.searchInput.value = '';
}
export const clearSearchResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.pageButtons.innerHTML = '';

}
export const renderRecipes = (recipes, currentPage = 1,resPerPage = 10) => {
    const start = (currentPage - 1) * resPerPage;
    const end = currentPage * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    // Pagination logic can be added here if needed
    const totalPages = Math.ceil(recipes.length / resPerPage);
    renderButtons(currentPage, totalPages);
}

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${page}">
        <span>Page ${page}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`;

const renderButtons = (currentPage, totalPages) => {
    let buttonHtml = '';
    if (currentPage === 1 && totalPages > 1) {
        // Only show next button if on first page
        buttonHtml = createButton(2, 'next');
    } else if (currentPage < totalPages) {
        buttonHtml += createButton(currentPage - 1, 'prev');
        buttonHtml += createButton(currentPage + 1, 'next');
    } else if (currentPage === totalPages ) {
       buttonHtml = createButton(currentPage-1, 'prev');
    }
    elements.pageButtons.insertAdjacentHTML('afterbegin', buttonHtml);
}
