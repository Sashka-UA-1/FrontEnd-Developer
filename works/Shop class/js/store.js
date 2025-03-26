class Product {
  constructor(id, name, price, img, category, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img = img;
    this.category = category;
    this.description = description;
  }
}

class Store {
  constructor() {
    this.products = [
      new Product(
        1,
        "Ноутбук Apple",
        2000,
        "https://i.pinimg.com/736x/00/78/23/007823f23f707b60490c82f6544475f2.jpg",
        "Apple",
        "Гарний ноутбук Apple, сірого кольору"
      ),
      new Product(
        2,
        "Ноутбук Lenovo",
        2500,
        "https://i.pinimg.com/736x/34/fa/85/34fa85c131fb71a6f089e2f345b9a3cc.jpg",
        "Lenovo",
        "Гарний ноутбук Lenovo, сірого кольору"
      ),
      new Product(
        3,
        "Ноутбук Samsung",
        3500,
        "https://i.pinimg.com/736x/34/d6/cf/34d6cf8ca870c611771970f1a3f9d653.jpg",
        "Samsung",
        "Гарний ноутбук Samsung, темного кольору"
      ),
      new Product(
        4,
        "Ноутбук HP",
        2300,
        "https://i.pinimg.com/736x/fb/28/68/fb28681c9cfd5cef152b98dac7729ad5.jpg",
        "HP",
        "Гарний ноутбук HP, сірого кольору"
      ),
      new Product(
        5,
        "Ноутбук HP 2",
        2350,
        "https://i.pinimg.com/736x/1b/9b/24/1b9b243beef8cfb68bc7117a889eb991.jpg",
        "HP",
        "Гарний ноутбук HP, синього кольору"
      ),
      new Product(
        6,
        "Ноутбук Samsung 2",
        3500,
        "https://i.pinimg.com/736x/c1/2d/76/c12d7630a4b5b0e215b64ede8c1d2373.jpg",
        "Samsung",
        "Гарний ноутбук Samsung, темного кольору"
      ),
      new Product(
        7,
        "Ноутбук Lenovo 2",
        2500,
        "https://i.pinimg.com/736x/3f/00/0a/3f000a83dc6325fb09a41f24d52fb7bc.jpg",
        "Lenovo",
        "Гарний ноутбук Lenovo, темного кольору"
      ),
    ];
    this.productsFilter = this.products;
    this.cart = new Cart();
    this.favorite = new Favorites();
    this.categorySearch();
  }
  categorySearch() {
    let options = {};
    this.products.forEach(product => {
      if (options[product.category] != product.category) {
        options[`${product.category}`] = `Категорія: ${product.category}`;
      }
    })
    this.renderSelectCategory(options);
  }
  renderSelectCategory(options) {
    const selectCategoryElem = document.getElementById('select-category');
    selectCategoryElem.innerHTML = `<option value="">Весь каталогії</option>`
    for (let key in options) {
      selectCategoryElem.innerHTML += `<option value="${key}">${options[key]}</option>`
    }
    selectCategoryElem.addEventListener('input', () => {
      let value = selectCategoryElem.value
      this.filterProducts(value);
    })
    this.renderProducts();
  }
  filterProducts(value) {
    if (value == '') {
      this.productsFilter = this.products;
    } else {
      this.productsFilter = this.products.filter(item => item.category == value)
    }
    this.renderProducts();
  }
  renderProducts() {
    const storeContainer = document.getElementById("store");
    storeContainer.innerHTML = null;
    this.productsFilter.forEach((product) => {
      const producrElement = document.createElement("div");
      producrElement.classList.add("product");
      producrElement.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Ціна: ${product.price}</p>
      <label> <p>К-сть: </p> <input type="number" min="1" value="1" id="qry-${product.id}"></label>
      <button data-id="${product.id}" data-BtnToCart>У кошик</button>
      <button data-BtnToFavorite id="favorit${product.id}"><i class="fa-solid fa-star"></i></button>
      `;
      producrElement.querySelector("[data-BtnToCart]").addEventListener("click", () => {
        const quantity = document.querySelector(`#qry-${product.id}`).value;
        this.cart.addToCart(product, parseInt(quantity));
      });
      let BtnFavorite = producrElement.querySelector("[data-BtnToFavorite]")
      BtnFavorite.addEventListener("click", () => {
        BtnFavorite.classList.toggle('action');
        const favorites = BtnFavorite.classList.contains('action');
        this.favorite.addToFavorites(product, favorites);
      })
      storeContainer.appendChild(producrElement);
    });
    this.animationRenderProducts(storeContainer);
    this.favorite.updateFavorites();
  }
  animationRenderProducts(storeContainer) {
    storeContainer.classList.add('updete');
    let setTimeoutElm = setTimeout(() => {
      storeContainer.classList.remove('updete')
      clearTimeout(setTimeoutElm);
    }, 1000)
  }
}


class Cart {
  constructor() {
    this.cart = this.getCart();
    this.updateCartCount();
  }
  getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.updateCartCount();
  }
  updateCartCount() {
    const cartCountElmt = document.getElementById("cart-count");
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElmt.textContent = totalCount;
  }
  addToCart(product, quantity) {
    const exItem = this.cart.find((item) => item.id == product.id);
    if (exItem) {
      exItem.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity })
    }
    this.saveCart();
  }
}

class Favorites {
  constructor() {
    this.favorites = this.getFavorites();
  }
  getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }
  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
    this.updateFavorites();
  }
  addToFavorites(product, favorite) {
    const exItem = this.favorites.find((item) => item.id == product.id);
    if (exItem) {
      exItem.favorite = favorite;
    } else {
      this.favorites.push({ ...product, favorite })
    }
    this.saveFavorites();
  }
  updateFavorites() {
    this.favorites.forEach(product => {
      if (product.favorite) {
        document.getElementById(`favorit${product.id}`).classList.add('action');
      }
    })
  }
}

new Store();
