import { saveData, getData } from "../utils/storage.js";

const WISHLIST_KEY = "shopez_wishlist";

export function getWishlist() {
  return getData(WISHLIST_KEY, []);
}

export function isWishlisted(productId) {
  const list = getWishlist();
  return list.includes(Number(productId));
}

export function toggleWishlist(productId) {
  const id = Number(productId);
  let list = getWishlist();

  if (list.includes(id)) {
    list = list.filter((item) => item !== id); // Remove
  } else {
    list.push(id); // Add
  }

  saveData(WISHLIST_KEY, list);
  updateWishlistCount();
  return list.includes(id);
}

export function updateWishlistCount() {
  const badge = document.querySelector("#wishlist-count");
  if (badge) {
    badge.textContent = getWishlist().length;
  }
}
