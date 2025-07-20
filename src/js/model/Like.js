export default class Like{
    constructor() {
        this.readDataFromLocalStorage();
        if (!this.likes) {
            // Хэрэв like массив байхгүй бол шинэ массив үүсгэнэ
            this.likes = [];
        }   
    }
    addLike(id, title,publisher,img_url){
        const like = {id,title,publisher,img_url};
        this.likes.push(like);
        this.saveDataToLocalStorage();
        return like;
    }
    deleteLike(id){
        const index = this.likes.findIndex(el => el.id ===id);
        this.likes.splice(index,1);
        this.saveDataToLocalStorage();
    }
    isLiked(id){
        return this.likes.findIndex(el => el.id ===id) !== -1;
    }

    getNumberOfLikes(){
        return this.likes.length;
    }
    saveDataToLocalStorage() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readDataFromLocalStorage() {
        const storage = localStorage.getItem('likes');
        if (storage) this.likes = JSON.parse(storage);
    }
}