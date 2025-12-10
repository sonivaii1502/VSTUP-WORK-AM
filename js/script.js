class CryptoApp{
    constructor(){
        this.cryptoSelect = document.querySelector('#cryptoSelect');
        this.favoriteList = document.querySelector('#favoriteList');
        this.searchInput = document.querySelector('#searchCrypto');
        this.modal = new Modal();
        this.favorites = new Favorites();
        this.cryptoData = [];

        this.startApp();
    }
    async startApp(){
        await this.loadCryptos();

        this.searchInput.addEventListener('input', () => this.filterCryptos());
        document.querySelector('#descriptionBtn').addEventListener('click', () => this.showSelectedCrypto());
        document.querySelector('#addFavorite').addEventListener('click', () => this.addToFavorites());
    }
}

const app = new CryptoApp();