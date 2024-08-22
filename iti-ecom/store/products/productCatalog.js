document.addEventListener("DOMContentLoaded", function () {
  showProductList();
  renderCategoryFilters();

  const searchForm = document.getElementById("searchForm");
  const searchInput = searchForm.querySelector("input[type='search']");

  searchInput.addEventListener("input", function () {
    filterProducts(searchInput.value.trim().toLowerCase());
  });

  generateFilters();
});

const categories = [
  "electronics",
  "clothing",
  "home",
  "books",
  "health",
  "games",
  "sports",
  "automotive",
  "watches",
  "food",
];

function showProductList() {
  const productsList = JSON.parse(localStorage.getItem("productsList")) || [];
  const productListElement = document.getElementById("product-list");

  productListElement.innerHTML = ""; // Clear previous products

  if (productsList.length === 0) {
    productListElement.innerHTML = `<div class="no-product-found text-center w-100">
              <img src='../products/no-product-found.png' alt='No product found' class='not-found-image'>
          </div>`;
    return;
  }

  productsList.forEach((product) => {
    const productCard = createProductCard(product);
    productListElement.appendChild(productCard);
  });
}

function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.classList.add("col-lg-4" , "col-md-6");
  const productHTML = `
    <div class="product-card">
        <img src="${product.images[0]}" alt="Product Image" class="product-image" />
        <div class="product-info">
            <p class="product-name">${product.name}</p>
            <p class="product-price">
                ${
                  product.discount > 0
                    ? `<span class="original-price">${product.price} EGP</span> <span class="discounted-price">${Math.floor(
                        product.price - (product.price * product.discount) / 100
                      )} EGP</span>`
                    : `${product.price} EGP`
                }
            </p>
            <p class="product-quantity">Quantity: ${
              product.quantity > 0 ? product.quantity : '<b class="text-danger">Sold Out</b>'
            }</p>
            <div class="product-buttons">
                <a href="product_details_screen.html?id=${product.id}" class="btn btn-primary btn-full-width">Details</a>
            </div>
        </div>
    </div>
    `;

  productCard.innerHTML = productHTML;
  return productCard;
}

function renderCategoryFilters() {
  const filterListElement = document.getElementById("filter-list");

  categories.forEach((category) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "category";
    checkbox.value = category;
    checkbox.id = category.toLowerCase();
    checkbox.classList.add("category-checkbox");
    checkbox.addEventListener("change", filterProducts);

    const label = document.createElement("label");
    label.htmlFor = category.toLowerCase();
    label.textContent = category;

    const filterItem = document.createElement("div");
    filterItem.classList.add("form-check", "mb-2");
    filterItem.appendChild(checkbox);
    filterItem.appendChild(label);

    filterListElement.appendChild(filterItem);
  });
}

function filterProducts() {
  const searchTerm = document.getElementById("searchForm").querySelector("input[type='search']").value.trim().toLowerCase();
  const selectedCategories = Array.from(document.querySelectorAll(".category-checkbox:checked")).map(
    (checkbox) => checkbox.value
  );

  const productsList = JSON.parse(localStorage.getItem("productsList")) || [];
  let filteredProducts = [...productsList];

  if (searchTerm !== "") {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm) || product.price == searchTerm
    );
  }

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      selectedCategories.includes(product.category.name)
    );
  }

  const productListElement = document.getElementById("product-list");
  productListElement.innerHTML = "";

  if (filteredProducts.length === 0) {
    const noProductsMessage = document.createElement("div");
    noProductsMessage.classList.add("no-products-message");
    noProductsMessage.innerHTML = `
      <div class="alert alert-info w-100" role="alert">
        No Products Found Matching Your Criteria.
      </div>
    `;
    productListElement.appendChild(noProductsMessage);
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    productListElement.appendChild(productCard);
  });
}

function generateFilters() {
  const filtersContainer = document.getElementById("filters");

  categories.forEach((category) => {
    const filterCheckbox = document.createElement("div");
    filterCheckbox.classList.add("form-check");
    filterCheckbox.innerHTML = `
      <input class="form-check-input category-checkbox" type="checkbox" value="${category}" id="${category.toLowerCase()}Check">
      <label class="form-check-label" for="${category.toLowerCase()}Check">
        ${category}
      </label>
    `;
    filterCheckbox.querySelector("input").addEventListener("change", filterProducts);
    filtersContainer?.appendChild(filterCheckbox);
  });
}
