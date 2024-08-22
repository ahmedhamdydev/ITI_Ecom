var userData = userData || JSON.parse(localStorage.getItem("userData"));
const productsTableBody = document.getElementById("products_table_body");
const productsTableHeadTr = document.getElementById("products_table_head_tr");
const productModalLabel = document.getElementById("productModalLabel");
const saveProductBtn = document.getElementById("saveProductBtn");
const productModal = new bootstrap.Modal(
  document.getElementById("productModal")
);
const selectedImagesContainer = document.getElementById(
  "selectedImagesContainer"
);
const categories = [
  "Electronics",
  "Clothing",
  "Home",
  "Books",
  "Health",
  "Games",
  "Sports",
  "Automotive",
  "Watches",
  "Food",
];

let products = JSON.parse(localStorage.getItem("productsList")) || [];
let currentProductId = null;
let selectedImages = [];

const renderProducts = () => {
  productsTableBody.innerHTML = "";
  productsTableHeadTr.innerHTML = `

    <th>id</th>
    ${userData.role === "admin" ? `<th>seller</th>` : ""}
    <th>name</th>
    <th>price</th>
    <th>quantity</th>
    <th>category</th>
    <th></th>

  `;
  let currentProducts;

  if (userData.role === "seller") {
    currentProducts = products.filter((el) => el.seller.id == userData.id);
  } else if (userData.role === "admin") {
    currentProducts = products;
  } else {
    currentProducts = [];
  }

  if (currentProducts.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td colspan="6" class="text-center">No products found</td>
      `;
    productsTableBody.appendChild(tr);
    return;
  }

  currentProducts.forEach((product) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${product.id}</td>
        ${userData.role === "admin" ? `<td>${product.seller.name}</td>` : ""}
        <td>${product.name}</td>
        <td>${
          product.discount > 0
            ? Math.floor(
                Number(product.price) -
                  (Number(product.price) * Number(product.discount)) / 100
              )
            : Number(product.price)
        } EGP</td>
        <td>${product.quantity}</td>
        <td>${product.category.name}</td>
        <td>
          <div class="table-actions">
            <button type="button" class="btn btn-info" onclick="editProduct(${
              product.id
            })">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="btn btn-danger" onclick="deleteProduct(${
              product.id
            })">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
    productsTableBody.appendChild(tr);
  });
};

const resetModal = () => {
  document.getElementById("product_name").value = "";
  document.getElementById("product_price").value = "";
  document.getElementById("product_discount").value = "";
  document.getElementById("product_quantity").value = "";
  document.getElementById("product_category").selectedIndex = 0; // Set to the placeholder option
  document.getElementById("product_description").value = "";
  clearValidationErrors();
  currentProductId = null;
  selectedImages = [];
};

const validateInputs = () => {
  clearValidationErrors();
  let isValid = true;
  const name = document.getElementById("product_name");
  const imageInput = document.getElementById("product_images");
  const price = document.getElementById("product_price");
  const discount = document.getElementById("product_discount");
  const quantity = document.getElementById("product_quantity");
  const category = document.getElementById("product_category");
  const description = document.getElementById("product_description");

  if (!name.value.trim()) {
    setValidationError(name, "Product name is required.");
    isValid = false;
  }

  if (selectedImages.length === 0) {
    setValidationError(imageInput, "Please select at least one image.");
    isValid = false;
  }

  if (!price.value.trim()) {
    setValidationError(price, "Product price is required.");
    isValid = false;
  }
  if (
    isNaN(discount.value.trim()) ||
    parseInt(discount.value.trim()) < 1 ||
    parseInt(discount.value.trim()) > 99
  ) {
    setValidationError(discount, "Discount must be a  between 1% and 99%.");
    isValid = false;
  }
  if (!quantity.value.trim()) {
    setValidationError(quantity, "Product quantity is required.");
    isValid = false;
  } else if (quantity.value.trim() <= 0) {
    setValidationError(quantity, "quantity must 1 at least");
    isValid = false;
  }

  if (category.selectedIndex === 0) {
    setValidationError(category, "Product category is required.");
    isValid = false;
  }
  if (!description.value.trim()) {
    setValidationError(description, "Product description is required.");
    isValid = false;
  }

  return isValid;
};

const setValidationError = (element, message) => {
  element.classList.add("border-danger");
  const errorDiv = document.createElement("div");
  errorDiv.classList.add("text-danger");
  errorDiv.innerText = message;
  element.parentNode.appendChild(errorDiv);
};

const clearValidationErrors = () => {
  document
    .querySelectorAll(".border-danger")
    .forEach((el) => el.classList.remove("border-danger"));
  document.querySelectorAll(".text-danger").forEach((el) => el.remove());
};

const addProduct = () => {
  if (!validateInputs()) return;

  const name = document.getElementById("product_name").value;
  const price = document.getElementById("product_price").value;
  const discount = document.getElementById("product_discount").value;
  const quantity = document.getElementById("product_quantity").value;
  const category = document.getElementById("product_category").value;
  const description = document.getElementById("product_description").value;
  const id = products.length
    ? Math.max(...products.map((p) => parseInt(p.id))) + 1
    : 1;
  const newProduct = {
    id: id.toString(),
    images: selectedImages.slice(),
    name,
    description,
    price,
    discount,
    quantity,
    category: {
      id: category.toLowerCase(),
      name: category,
    },
    seller: {
      id: userData?.id,
      name: userData?.name,
    },
  };
  products.push(newProduct);
  localStorage.setItem("productsList", JSON.stringify(products));
  renderProducts();
  resetModal();
  productModal.hide();
};

const editProduct = (id) => {
  const product = products.find((p) => p.id == id.toString());
  if (product) {
    clearValidationErrors();
    currentProductId = id;
    productModalLabel.innerText = "Edit Product";
    document.getElementById("product_name").value = product.name;
    document.getElementById("product_price").value = product.price;
    document.getElementById("product_discount").value = product.discount;
    document.getElementById("product_quantity").value = product.quantity;
    document.getElementById("product_category").value = product.category.name;
    document.getElementById("product_description").value = product.description;

    // images handle
    selectedImages = product.images.slice();
    selectedImagesContainer.innerHTML = "";
    product.images.forEach((image) => {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("selected-image-item");

      const imgElement = document.createElement("img");
      imgElement.classList.add("selected-image");
      imgElement.src = image;
      imageContainer.appendChild(imgElement);

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-danger", "delete-image-btn");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteBtn.addEventListener("click", () => {
        const index = selectedImages.indexOf(image);
        if (index !== -1) {
          selectedImages.splice(index, 1);
          imageContainer.remove();
        }
      });
      imageContainer.appendChild(deleteBtn);

      selectedImagesContainer.appendChild(imageContainer);
    });
    // images handle

    productModal.show();
    console.log(selectedImages);
  }
};

const updateProduct = () => {
  if (!validateInputs()) return;

  const name = document.getElementById("product_name").value;
  const price = document.getElementById("product_price").value;
  const discount = document.getElementById("product_discount").value;
  const quantity = document.getElementById("product_quantity").value;
  const category = document.getElementById("product_category").value;
  const description = document.getElementById("product_description").value;
  products = products.map((p) =>
    p.id == currentProductId.toString()
      ? {
          ...p,
          images: selectedImages.slice(),
          name,
          price,
          discount,
          quantity,
          category: { id: category.toLowerCase(), name: category },
          description,
        }
      : p
  );
  localStorage.setItem("productsList", JSON.stringify(products));
  renderProducts();
  resetModal();
  productModal.hide();
};

const deleteProduct = (id) => {
  products = products.filter((p) => p.id != id.toString());
  localStorage.setItem("productsList", JSON.stringify(products));
  renderProducts();
};

saveProductBtn.addEventListener("click", () => {
  if (currentProductId === null) {
    addProduct();
  } else {
    updateProduct();
  }
});

$("[data-bs-target='#productModal']").on("click", () => {
  selectedImagesContainer.innerHTML = "";
  resetModal();
  productModalLabel.innerText = "Add Product";
  console.log(selectedImages);
});

const validateNumberInput = (input) => {
  input.value = input.value.replace(/\D/g, "");
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  // Display selected images
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Create elements dynamically
      const imageContainer = document.createElement("div");
      imageContainer.classList.add("selected-image-item");

      const imgElement = document.createElement("img");
      imgElement.classList.add("selected-image");
      imgElement.src = e.target.result;
      imageContainer.appendChild(imgElement);

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-danger", "delete-image-btn");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteBtn.addEventListener("click", () => {
        const index = selectedImages.indexOf(e.target.result);
        if (index !== -1) {
          selectedImages.splice(index, 1);
          imageContainer.remove();
        }
      });
      imageContainer.appendChild(deleteBtn);

      // Append image container to container
      const selectedImagesContainer = document.getElementById(
        "selectedImagesContainer"
      );
      selectedImagesContainer.appendChild(imageContainer);

      // Save base64 data or image URLs
      selectedImages.push(e.target.result);
    };
    reader.readAsDataURL(files[i]);
  }
  event.target.value = "";
};

document.addEventListener("DOMContentLoaded", () => {
  const categoriesSelect = document.getElementById("product_category");
  categories.forEach((category) => {
    const optionElement = document.createElement("option");
    optionElement.value = category.toLowerCase();
    optionElement.textContent = category;
    categoriesSelect.appendChild(optionElement);
  });
  renderProducts();
});
