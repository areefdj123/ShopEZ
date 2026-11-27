import { getData } from "../js/utils/storage.js"
import { addToCart, updateCartCount } from "../js/modules/cart.js";
import { toggleWishlist, isWishlisted, updateWishlistCount } from "../js/modules/wishlist.js";

// 1. Hero Headphone 3D Tilt Effect
const heroSection = document.querySelector(".hero");
const headphoneImg = document.querySelector("#mainimg");

if (heroSection && headphoneImg) {
  headphoneImg.style.transition = "transform 0.15s ease-out";

  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    headphoneImg.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`;
  });

  heroSection.addEventListener("mouseleave", () => {
    headphoneImg.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
  });
}

// 2. Product Card HTML Generator
function createCard(product) {
  const liked = isWishlisted(product.id);

  return `
    <div class="product-card" data-id="${product.id}">
      <div class="card-img-box">
        <a href="pages/product-details.html?id=${product.id}">
          <img src="${product.image}" alt="${product.title}" onerror="this.onerror=null; this.src='assets/images/header-image.png';">
        </a>
        <button class="wishlist-btn ${liked ? "active" : ""}" data-id="${product.id}">
          <i class="${liked ? "fa-solid" : "fa-regular"} fa-heart"></i>
        </button>
      </div>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3 class="card-title">
          <a href="pages/product-details.html?id=${product.id}">${product.title}</a>
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

// 3. Home Page Data Load & Button Clicks
async function loadHomeProducts() {
  updateCartCount();
  updateWishlistCount();

  const featuredBox = document.querySelector("#featured-products");
  const trendingBox = document.querySelector("#trending-products");
  const recentBox = document.querySelector("#recently-viewed-products");

  try {
    const response = await fetch("./js/data/product.json");
    const products = await response.json();

    // Featured Products
    if (featuredBox) {
      const featuredList = products.filter((item) => item.isFeatured === true);
      featuredBox.innerHTML = featuredList.map((item) => createCard(item)).join("");
    }

    // Trending Products
    if (trendingBox) {
      const trendingList = products.filter((item) => item.isTrending === true);
      trendingBox.innerHTML = trendingList.map((item) => createCard(item)).join("");
    }

    // Recently Viewed Products
    if (recentBox) {
      const recentIds = getData("shopez_recent", []);
      const recentList = recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
      recentBox.innerHTML = recentList.length
        ? recentList.map((item) => createCard(item)).join("")
        : "<p>No recently viewed products yet.</p>";
    }

    // Event Delegation for Add to Cart & Wishlist Heart
    document.body.addEventListener("click", (e) => {
      const cartBtn = e.target.closest(".add-cart-btn");
      if (cartBtn) {
        const id = Number(cartBtn.dataset.id);
        const product = products.find((p) => p.id === id);
        if (product) addToCart(product, 1);
      }

      const wishBtn = e.target.closest(".wishlist-btn");
      if (wishBtn) {
        const id = Number(wishBtn.dataset.id);
        const added = toggleWishlist(id);
        wishBtn.classList.toggle("active", added);
        wishBtn.querySelector("i").className = `${added ? "fa-solid" : "fa-regular"} fa-heart`;
      }
    });
  } catch (error) {
    console.log("Error loading products:", error);
  }
}

loadHomeProducts();
