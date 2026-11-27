import { saveData, getData } from "../utils/storage.js";

const CART_KEY = "shopez_cart";

export function getCart() {
  return getData(CART_KEY, []);
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    if (existingItem.quantity + qty > product.stock) {
      alert(`Only ${product.stock} items left in stock!`);
      return;
    }
    existingItem.quantity += qty;
  } else {
    if (qty > product.stock) {
      alert("Out of stock!");
      return;
    }
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity: qty,
    });
  }

  saveData(CART_KEY, cart);
  updateCartCount();
  alert(`${product.title} added to cart!`);
}

export function updateCartCount() {
  const badge = document.querySelector("#cart-count");
  if (badge) {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
  }
}
