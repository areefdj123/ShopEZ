import { getData } from "../utils/storage.js";
import { addToCart, updateCartCount } from "./cart.js";
import { toggleWishlist, isWishlisted, getWishlist, updateWishlistCount } from "./wishlist.js";

// Centralized Filter & Pagination State
const state = {
  allProducts: [],
  search: "",
  category: "All",
  maxPrice: 10000,
  minRating: 0,
  sortBy: "default",
  onlyWishlist: false,
  currentPage: 1,
  itemsPerPage: 6,
};

// DOM Elements
const productsGrid = document.querySelector("#shop-products-grid");
const searchInput = document.querySelector("#search-input");
const categorySelect = document.querySelector("#category-filter");
const priceSlider = document.querySelector("#price-filter");
const priceDisplay = document.querySelector("#price-value");
const ratingSelect = document.querySelector("#rating-filter");
const sortSelect = document.querySelector("#sort-select");
const resetBtn = document.querySelector("#reset-filters-btn");
const resultsCountText = document.querySelector("#results-count");
const paginationBox = document.querySelector("#pagination-controls");
const pageHeading = document.querySelector("#page-heading");

// Create Single Product Card (with ../ path fix for pages folder)
function createShopCard(product) {
  const liked = isWishlisted(product.id);
  const imgPath = product.image.startsWith("http") ? product.image : `../${product.image}`;

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="card-img-box">
        <a href="product-details.html?id=${product.id}">
          <img src="${imgPath}" alt="${product.title}" onerror="this.onerror=null; this.src='../assets/images/header-image.png';">
        </a>
        <button class="wishlist-btn ${liked ? "active" : ""}" data-id="${product.id}">
          <i class="${liked ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>
      </div>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3 class="card-title">
          <a href="product-details.html?id=${product.id}">${product.title}</a>
        </h3>
        <div class="card-rating">⭐ ${product.rating}</div>
        <div class="card-footer">
          <span class="card-price">Rs. ${product.price}</span>
          <button class="add-cart-btn" data-id="${product.id}" ${product.stock === 0 ? "disabled" : ""}>
            ${product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Master Filter + Sort + Pagination Pipeline
function renderFilteredProducts() {
  let filtered = [...state.allProducts];

  // 1. Wishlist View Check (?filter=wishlist)
  if (state.onlyWishlist) {
    const wishlistIds = getWishlist();
    filtered = filtered.filter((p) => wishlistIds.includes(p.id));
  }

  // 2. Search Filter (Case-insensitive)
  if (state.search.trim() !== "") {
    const query = state.search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(query));
  }

  // 3. Category Filter
  if (state.category !== "All") {
    filtered = filtered.filter((p) => p.category === state.category);
  }

  // 4. Price Filter
  filtered = filtered.filter((p) => p.price <= state.maxPrice);

  // 5. Rating Filter
  if (state.minRating > 0) {
    filtered = filtered.filter((p) => p.rating >= state.minRating);
  }

  // 6. Sorting
  if (state.sortBy === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (state.sortBy === "popularity") {
    filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  // Update Result Count
  resultsCountText.textContent = `Showing ${filtered.length} product(s)`;

  // Empty State
  if (filtered.length === 0) {
    productsGrid.innerHTML = `<p style="padding: 2rem; font-family: Poppins;">No products found matching your criteria.</p>`;
    paginationBox.innerHTML = "";
    return;
  }

  // 7. Pagination Calculation
  const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
  if (state.currentPage > totalPages) state.currentPage = 1;

  const startIndex = (state.currentPage - 1) * state.itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + state.itemsPerPage);

  productsGrid.innerHTML = paginatedItems.map((item) => createShopCard(item)).join("");
  renderPaginationButtons(totalPages);
}

function renderPaginationButtons(totalPages) {
  if (totalPages <= 1) {
    paginationBox.innerHTML = "";
    return;
  }

  let buttonsHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    buttonsHTML += `<button class="page-btn ${i === state.currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  paginationBox.innerHTML = buttonsHTML;
}

// Debounce Utility (400ms delay for Search)
function debounce(func, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

// Initialize Shop Page
async function initShopPage() {
  updateCartCount();
  updateWishlistCount();

  // Read URL Parameters (?category=... or ?filter=wishlist)
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get("category");
  const urlFilter = params.get("filter");

  if (urlCategory) {
    state.category = urlCategory;
    categorySelect.value = urlCategory;
    pageHeading.textContent = urlCategory;
  }

  if (urlFilter === "wishlist") {
    state.onlyWishlist = true;
    pageHeading.textContent = "My Wishlist";
  }

  try {
    // Check LocalStorage first (so Admin updates show up), else fetch JSON
    const cachedProducts = getData("shopez_products", null);
    if (cachedProducts && cachedProducts.length > 0) {
      state.allProducts = cachedProducts;
    } else {
      const response = await fetch("../js/data/products.json");
      state.allProducts = await response.json();
    }

    renderFilteredProducts();
  } catch (error) {
    productsGrid.innerHTML = `<p class="error-msg">Error loading catalogue.</p>`;
  }

  // Event Listeners
  searchInput.addEventListener(
    "input",
    debounce((e) => {
      state.search = e.target.value;
      state.currentPage = 1;
      renderFilteredProducts();
    }, 400)
  );

  categorySelect.addEventListener("change", (e) => {
    state.category = e.target.value;
    state.currentPage = 1;
    pageHeading.textContent = state.onlyWishlist ? "My Wishlist" : state.category === "All" ? "All Products" : state.category;
    renderFilteredProducts();
  });

  priceSlider.addEventListener("input", (e) => {
    state.maxPrice = Number(e.target.value);
    priceDisplay.textContent = state.maxPrice;
    state.currentPage = 1;
    renderFilteredProducts();
  });

  ratingSelect.addEventListener("change", (e) => {
    state.minRating = Number(e.target.value);
    state.currentPage = 1;
    renderFilteredProducts();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderFilteredProducts();
  });

  resetBtn.addEventListener("click", () => {
    state.search = "";
    state.category = "All";
    state.maxPrice = 10000;
    state.minRating = 0;
    state.sortBy = "default";
    state.onlyWishlist = false;
    state.currentPage = 1;

    searchInput.value = "";
    categorySelect.value = "All";
    priceSlider.value = 10000;
    priceDisplay.textContent = "10000";
    ratingSelect.value = "0";
    sortSelect.value = "default";
    pageHeading.textContent = "All Products";

    window.history.replaceState({}, "", "products.html");
    renderFilteredProducts();
  });

  // Pagination & Card Clicks (Event Delegation)
  paginationBox.addEventListener("click", (e) => {
    const btn = e.target.closest(".page-btn");
    if (btn) {
      state.currentPage = Number(btn.dataset.page);
      renderFilteredProducts();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  productsGrid.addEventListener("click", (e) => {
    const cartBtn = e.target.closest(".add-cart-btn");
    if (cartBtn) {
      const id = Number(cartBtn.dataset.id);
      const product = state.allProducts.find((p) => p.id === id);
      if (product) addToCart(product, 1);
    }

    const wishBtn = e.target.closest(".wishlist-btn");
    if (wishBtn) {
      const id = Number(wishBtn.dataset.id);
      const added = toggleWishlist(id);
      if (state.onlyWishlist && !added) {
        renderFilteredProducts(); // Remove card immediately if in Wishlist view
      } else {
        wishBtn.classList.toggle("active", added);
        wishBtn.querySelector("i").className = `${added ? "fa-solid" : "fa-regular"} fa-heart`;
      }
    }
  });
}

initShopPage();

