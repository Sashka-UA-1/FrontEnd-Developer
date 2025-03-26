class Card {
  constructor() {
    this.cart = this.getCart();
    this.renderCart();
  }
  getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }
  saveCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
    this.renderCart();
  }
  clearCart() {
    localStorage.removeItem("cart");
    this.cart = [];
    this.renderCart();
  }
  renderCart() {
    const cardBody = document.getElementById("cart-body");
    const totalPriceElm = document.getElementById("total-price");
    cardBody.innerHTML = null;
    let totalPrice = 0;
    this.cart.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.img}" width="50"></td>
        <td>${item.name}</td>
        <td><input type="number" min"1" value="${item.quantity
        }" data-index="${index}" class="cart-qty"></td>
        <td>${item.price}</td>
        <td>${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="remove-btn" data-index=${index}><i class="fa-regular fa-circle-xmark"></i></button></td>
      `;
      cardBody.appendChild(row);
      totalPrice += item.price * item.quantity;
    });
    totalPriceElm.textContent = `Всього: ${totalPrice.toFixed(2)}`;
    document.querySelectorAll(".cart-qty").forEach((input) => {
      input.addEventListener("input", (e) => {
        const index = e.target.dataset.index;
        this.updateQuantity(index, parseInt(e.target.value));
      });
    });
    document.querySelectorAll(".remove-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        this.removeItem(index);
      });
    });
  }
  updateQuantity(index, newQuantity) {
    if (newQuantity > 0) {
      this.cart[index].quantity = newQuantity;
      this.saveCart();
    } else {
      this.removeItem(index);
    }
  }
  removeItem(index) {
    this.cart.splice(index, 1);
    this.saveCart();
  }
}

class MoadalWindow {
  constructor() {
    this.modal = document.getElementById('modal');
    this.btnClose = document.getElementById('close-btn-modal');
    this.btnClose.addEventListener('click', () => this.closeModal())
  }
  openModal() {
    this.modal.style.display = `flex`
    this.modal.addEventListener('click', (e) => {
      if (e.target == this.modal) {
        this.closeModal();
      }
    })
    this.animationOpen();
  }
  animationOpen() {
    this.modal.classList.add('updete');
    let setTimeoutElm = setTimeout(() => {
      this.modal.classList.remove('updete')
      clearTimeout(setTimeoutElm);
    }, 1000)
  }
  closeModal() {
    this.animationClose();
    this.clearForm();
  }
  animationClose() {
    this.modal.classList.add('close');
    let setTimeoutElm = setTimeout(() => {
      this.modal.classList.remove('close');
      this.modal.style.display = `none`;
      clearTimeout(setTimeoutElm);
    }, 1000)
  }
  clearForm(){
    document.getElementById('form').querySelectorAll('input').forEach(input=>{
      input.value = null
    })
  }
}

const cart = new Card();
const modal = new MoadalWindow();
document
  .getElementById("clear-cart")
  .addEventListener("click", () => cart.clearCart());

document
  .getElementById('buy-cart')
  .addEventListener('click', () => modal.openModal())

