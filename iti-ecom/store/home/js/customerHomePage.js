// Check if the user is authenticated and authorized
function checkAuth(role) {
  const userRole = localStorage.getItem("userRole");
}

// Check authentication on page load
window.onload = function () {
  const pageRole = document.querySelector("title").innerText.split(" ")[1];
  checkAuth(pageRole);
};

// render featured products
document.addEventListener("DOMContentLoaded", function () {
  showProductList();
});

function showProductList() {
  const allProducts = JSON.parse(localStorage.getItem("productsList")) || [];
  const productsList = allProducts.filter((el) => el.discount > 0).slice(0, 19);
  const productListElement = document.getElementById("product-list");

  if (productsList.length === 0) {
    const tr = document.createElement("tr");
    productListElement.innerHTML = `<div class="no-product-found text-center w-100">
                <img src='../products/no-product-found.png' alt='No product found' class='not-found-image'>
            </div>`;
    return;
  }

  productsList.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("col-lg-4" , "col-md-6");
    const productHTML = `
        <div class="product-card">
            <img src="${
              product.images[0]
            }" alt="Product Image" class="product-image" />
            <div class="product-info">
                <p class="product-name">${product.name}</p>
                <p class="product-price">
                    ${
                      product.discount > 0
                        ? `<span class="original-price">${
                            product.price
                          } EGP</span> <span class="discounted-price">${Math.floor(
                            product.price -
                              (product.price * product.discount) / 100
                          )} EGP</span>`
                        : `${product.price} EGP`
                    }
                </p>
                <p class="product-quantity">Quantity: ${
                  product.quantity > 0
                    ? product.quantity
                    : '<b class="text-danger">Sold Out</b>'
                }</p>
                <div class="product-buttons">
                    <a href="../products/product_details_screen.html?id=${
                      product.id
                    }" class="btn btn-primary btn-full-width">Details</a>
                </div>
            </div>
        </div>
        `;

    productCard.innerHTML = productHTML;
    productListElement.appendChild(productCard);
  });
}
