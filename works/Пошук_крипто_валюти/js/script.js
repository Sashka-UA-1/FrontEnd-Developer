// ↓↓↓ === Клас для роботи з криптовалютою === ↓↓↓
class CryptoApp {
  constructor() {
    this.cryptoSelect = document.getElementById('crypto-select');
    this.favoriteList = document.getElementById('favorite-list');
    this.modal = new Modal();
    this.favoretes = new Favoretes();
    this.cryptData = [];
    this.cryptDataFilter = this.cryptData;
    // ↓ = Завантаження припти = ↓
    this.loadCrypton();
    // ↓ = Відображення фаворитів = ↓
    this.renderFavorites();
    // ↓↓↓ === Відобразити подробну інформацію  === ↓↓↓
    document.getElementById('show-info').addEventListener('click', () => {
      if (this.cryptoSelect.value == 'none') return;
      this.showCryptoInfo(this.cryptoSelect.value);
    });
    // ↑↑↑ === Відобразити подробну інформацію  === ↑↑↑
    // ↓↓↓ === Додовання до фаворитів === ↓↓↓
    document.getElementById('add-favorite').addEventListener('click', () => {
      if (this.cryptoSelect.value == 'none') return;
      const selectId = document.getElementById('crypto-select').value;
      const selectText = this.cryptoSelect.options[this.cryptoSelect.selectedIndex].text;
      const imega = this.cryptoSelect.options[this.cryptoSelect.selectedIndex].dataset.image;

      this.favoretes.add(selectId, selectText, imega)
      this.renderFavorites();
    });
    // ↑↑↑ === Додовання до фаворитів === ↑↑↑
    // ↓↓↓ === Пошук крипотовалюти === ↓↓↓
    document.getElementById('search-crypto').addEventListener('input', (e) => {
      const value = e.target.value.trim().toLowerCase();
      if (value.length > 0) {
        this.cryptDataFilter = this.cryptData.filter(coin => coin.name.toLowerCase().includes(value) || coin.symbol.toLowerCase().includes(value));
      } else {
        this.cryptDataFilter = this.cryptData;
      }
      this.renderCryptoSelect();
    })
    // ↑↑↑ === Пошук крипотовалюти === ↑↑↑
  }
  // ↓↓↓ === завантаження криптовалюти === ↓↓↓
  async loadCrypton() {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
    this.cryptData = await res.json();
    this.cryptDataFilter = this.cryptData;
    this.renderCryptoSelect();
  }
  // ↑↑↑ === завантаження криптовалюти === ↑↑↑
  // ↓↓↓ === відображення криптовалюти у випадаючому списку === ↓↓↓
  renderCryptoSelect() {
    this.cryptoSelect.innerHTML = '';
    if (this.cryptDataFilter.length == 0) {
      this.cryptoSelect.innerHTML = `<option value="none">Нічого не знайдено</option>`;
      return;
    }
    this.cryptDataFilter.forEach(coin => {
      const option = document.createElement('option');
      option.value = coin.id;
      option.textContent = `(${coin.symbol.toUpperCase()}) ${coin.name}`;
      option.title = coin.name;
      option.dataset.image = coin.image;
      this.cryptoSelect.appendChild(option);
    })
  }
  // ↑↑↑ === відображення криптовалюти у випадаючому списку === ↑↑↑
  // ↓↓↓ === відображення фаворитів === ↓↓↓
  renderFavorites() {
    this.favoriteList.innerHTML = '';
    if (this.favoretes.getAll().length == 0) {
      this.favoriteList.innerHTML = `<li>Список фаворитів порожній</li>`;
      return;
    }
    this.favoretes.getAll().forEach(({ id, name, image }) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <label title="Подробна інформація про ${name}">
          <img src="${image}" alt="${name}">
          <span>${name}</span>
        </label>
        <button title="Видалити"><i class="fa-solid fa-xmark"></i></button>
      `
      li.querySelector('label').addEventListener('click', () => this.showCryptoInfo(id));
      li.querySelector('button').addEventListener('click', () => {
        this.favoretes.remove(id);
        li.remove();
      })
      this.favoriteList.appendChild(li);
    })
  }
  // ↑↑↑ === відображення фаворитів === ↑↑↑
  // ↓↓↓ === відображення інформації про криптовалюту === ↓↓↓
  async showCryptoInfo(id) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    const data = await res.json();
    console.log('97:>', data);
    const html = `
    <h2>(${data.symbol.toUpperCase()}) ${data.name}</h2> 
    <div> 
      <img src="${data.image.large}" alt="${data.name}">
      <div> 
        <p>Ціна в USD: ${data.market_data.current_price.usd} $</p>
        <p>Ціна в UAH: ${data.market_data.current_price.uah} грн</p>
        <p>Дата створення: ${data.genesis_date || 'Дата створення не відома'}</p>
        <p>Алгоритм хешування: ${data.hashing_algorithm || 'Невідомо'}</p>
      </div>
    </div>
    `
    this.modal.open(html);
  }
  // ↑↑↑ === відображення інформації про криптовалюту === ↑↑↑
}
// ↑↑↑ === Клас для роботи з криптовалютою === ↑↑↑

// ↓↓↓ === Клас для роботи з фаворитами === ↓↓↓
class Favoretes {
  constructor() {
    this.key = 'cryptoFavorites'
    this.favoretes = JSON.parse(localStorage.getItem(this.key)) || [];
  }
  // ↓↓↓ === додвання до фаворитів === ↓↓↓
  add(id, name, image) {
    const alllExisrs = this.favoretes.some(item => item.id == id)
    if (!alllExisrs) {
      this.favoretes.push({ id, name, image });
      this.save();
    }
  }
  // ↑↑↑ === додвання до фаворитів === ↑↑↑
  // ↓↓↓ === видалення з фаворитів === ↓↓↓
  remove(id) {
    const exIndex = this.favoretes.findIndex(item => item.id == id);
    this.favoretes.splice(exIndex, 1);
    this.save();
  }
  // ↑↑↑ === видалення з фаворитів === ↑↑↑
  // ↓↓↓ === отримання масиву з фаворитами === ↓↓↓
  getAll() {
    return this.favoretes;
  }
  // ↑↑↑ === отримання масиву з фаворитами === ↑↑↑
  // ↓↓↓ === збереження фаворитів у локальше збереження === ↓↓↓
  save() {
    localStorage.setItem(this.key, JSON.stringify(this.favoretes))
  }
  // ↑↑↑ === збереження фаворитів у локальше збереження === ↑↑↑
}
// ↑↑↑ === Клас для роботи з фаворитами === ↑↑↑

// ↓↓↓ === Клас для роботи з модальним вікном === ↓↓↓
class Modal {
  constructor() {
    this.modal = document.getElementById('modal');
    this.body = document.getElementById('modal-body');
    this.CloseBtn = document.getElementById('close-btn');

    this.CloseBtn.addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target == this.modal) this.close();
    })
  }
  // ↓↓↓ === відкриттян модального вікна === ↓↓↓
  open(html) {
    this.body.innerHTML = html;
    this.modal.style.display = 'flex';
  }
  // ↑↑↑ === відкриттян модального вікна === ↑↑↑
  // ↓↓↓ === закриття модального вікна === ↓↓↓
  close() {
    this.modal.style.display = 'none';
  }
  // ↑↑↑ === закриття модального вікна === ↑↑↑
}
// ↑↑↑ === Клас для роботи з модальним вікном === ↑↑↑

const app = new CryptoApp();