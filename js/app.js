// const heroSection = document.querySelector(".hero");
// const headphoneImg = document.querySelector("#mainimg");

// if (heroSection && headphoneImg) {
//   headphoneImg.style.transition = "transform 0.15s ease-out";

//   heroSection.addEventListener("mousemove", (e) => {
//     const rect = heroSection.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width - 0.5;
//     const y = (e.clientY - rect.top) / rect.height - 0.5;

//     headphoneImg.style.transform = `perspective(1000px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale(1.05)`;
//   });

//   heroSection.addEventListener("mouseleave", () => {
//     headphoneImg.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
//   });
// }

// const featuredGrid = document.querySelector("#featured-products");

// async function loadFeaturedProducts() {
//   if (!featuredGrid) return;

//   featuredGrid.innerHTML = "<p>Loading featured products...</p>";

//   try {
//     const response = await fetch("./js/data/products.json");
//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }

//     const allProducts = await response.json();
//     const featuredProducts = allProducts.filter((product) => product.isFeatured === true);

//     featuredGrid.innerHTML = featuredProducts
//       .map((product) => {
//         const { id, title, price, category, rating, stock, image } = product;

//         return `
//           <div class="product-card" data-id="${id}">
//             <div class="card-img-box">
//               <a href="pages/product-details.html?id=${id}">
//                 <img src="${image}" alt="${title}" onerror="this.src='https://placehold.co'">
//               </a>
//               <button class="wishlist-btn" data-id="${id}" aria-label="Add to Wishlist">
//                 <i class="fa-regular fa-heart"></i>
//               </button>
//             </div>
//             <div class="card-body">
//               <span class="card-category">${category}</span>
//               <h3 class="card-title">
//                 <a href="pages/product-details.html?id=${id}">${title}</a>
//               </h3>
//               <div class="card-rating">⭐ ${rating}</div>
//               <div class="card-footer">
//                 <span class="card-price">Rs. ${price.toLocaleString()}</span>
//                 <button class="add-cart-btn" data-id="${id}" ${stock === 0 ? "disabled" : ""}>
//                   ${stock === 0 ? "Out of Stock" : "Add to Cart"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         `;
//       })
//       .join("");
//   } catch (error) {
//     console.error("Failed to load featured products:", error);
//     featuredGrid.innerHTML = `<p class="error-msg">Unable to load featured products.</p>`;
//   }
// }

// loadFeaturedProducts();

