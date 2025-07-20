import { elements } from './base';
export const toggleLikeButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numberOfLikes => {
    elements.likesMenu.style.visibility = numberOfLikes > 0 ? 'visible' : 'hidden';
};

export const renderLikes = newLike => {
    const markup = `
        <li>
            <a class="likes__link" href="#${newLike.id}">
                <figure class="likes__fig">
                    <img src="${newLike.img_url}" alt="${newLike.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${newLike.title}</h4>
                    <p class="likes__author">${newLike.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const like = document.querySelector(`.likes__link[href="#${id}"]`);
    if (like) like.parentElement.removeChild(like);
};
