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
    showSelectedCrypto(){
        if(this.cryptoSelect.value){
            this.showCryptoInfo(this.cryptoSelect.value);
        }
    }
    addToFavorites(){
        const selected = this.cryptoSelect.options[this.cryptoSelect.selectedIndex];
        this.favorites.add(selected.value, selected.textContent, selected.dataset.image);
        this.renderFavorites();
    }
    filterCryptos(){
        const term = this.searchInput.value.toLowerCase();
        const filtered = this.cryptoData.filter(coin => 
            coin.name.toLowerCase().includes(term) || 
            coin.symbol.toLowerCase().includes(term)
        );
        this.populateSelect(filtered);
    }
    async loadCryptos(){
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        this.cryptoData = await res.json();
        this.populateSelect(this.cryptoData);
    }
    populateSelect(data){
        this.cryptoSelect.innerHTML = '';
        data.forEach(coin => {
            const option = document.createElement('option');
            option.value = coin.id;
            option.textContent = `(${coin.symbol.toUpperCase()}) ${coin.name}`;
            option.dataset.image = coin.image;
            this.cryptoSelect.appendChild(option);
        });
    }
    renderFavorites(){
        this.favoriteList.innerHTML = '';
        this.favorites.getAll().forEach(({ id, name, image }) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <button class="deleteBtn btn btn-dark">×</button>
                <img src="${image}" class="imgFavorite" alt="${name}">
                <span>${name}</span>
            `;
            li.querySelector('.deleteBtn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.favorites.remove(id);
                this.renderFavorites();
            });
            li.addEventListener('click', () => this.showCryptoInfo(id));
            this.favoriteList.appendChild(li);
        });
    }
    async showCryptoInfo(id){
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        const data = await res.json();
        const html = `
            <h2>(${data.symbol.toUpperCase()}) ${data.name}</h2>
            <img src="${data.image.large}" width="150">
            <p>Price: $${data.market_data.current_price.usd.toLocaleString()}</p>
            <p>Rank: ${data.market_cap_rank}</p>
            <div class="crypto-desc">${data.description.en || 'description missing'}</div>
        `;
        this.modal.open(html);
    }
}
class Favorites{
    constructor(){
        this.key = 'cryptoFavorites';
        this.favorites = JSON.parse(localStorage.getItem(this.key)) II [];
    }
    add (id, name, image){
        if(!this.favorites.some(item => item.id === id)){
            this.favorites.push({ id, name, image });
            this.save();
        }
    }
    getAll(){
        return this.favorites;
    }
    save(){
        localStorage.setItem(this.key, JSON.stringify(this.favorites));
    }
}
class Modal{
    constructor(){
        this.modal = document.querySelector('#modal');
        this.body = document.querySelector('#modal-body');
        this.closeBtn = document.querySelector('#closeBtn');
        this.closeBtn.addEventListener('click', (e) => {
            if(e.target === this.modal) this.close();
        });
    }
    open(contentHTML){
        this.body.innerHTML = contentHTML;
        this.modal.style.display = 'block';
    }
    close(){
        this.modal.style.display = 'none';
    }
}

const app = new CryptoApp();