var userData = userData || JSON.parse(localStorage.getItem("userData"));
const ordersList = JSON.parse(localStorage.getItem("ordersList")) || [];
const ordersTableBody = document.getElementById("orders_table_body");

let orders;
if (userData.role === "seller") {
  orders = ordersList.filter((el) => el.sellerId == userData.id);
} else if (userData.role === "admin") {
  orders = ordersList;
} else {
  orders = [];
}


const renderTable = () => {
  ordersTableBody.innerHTML = "";

  if (ordersTableBody.classList.contains("latest")) {
    orders = orders.slice(0, 10);
  }

  if (orders.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
              <td colspan="6" class="text-center">No orders found</td>
            `;
    ordersTableBody.appendChild(tr);
    return;
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.innerHTML = `
                      <td>${order.id}</td>
                      <td>${order.billDetails.name}</td>
                      <td>${order.totalOrderPrice}</td>
                      <td><span class="${
                        order.orderStatus === "processing"
                          ? "text-info"
                          : order.orderStatus === "shipped"
                          ? "text-success"
                          : order.orderStatus === "canceled"
                          ? "text-danger"
                          : ""
                      }">${order.orderStatus}</span></td>
                      <td>${order.paymentMethodType}</td>
                      <td>
                        <div class="table-actions">
                              <button type="button" class="btn btn-info btn-view" data-id="${
                                order.id
                              }" onclick="showOrderDetails('${order.id}')">
                                <i class="fa-solid fa-eye"></i>
                              </button>
                              ${
                                order.orderStatus === "processing"
                                  ? `
                                  <button type="button" class="btn btn-success btn-ship" data-id="${order.id}" onclick="changeOrderStatus('${order.id}', 'shipped')">
                                    <i class="fa-solid fa-check"></i>
                                  </button>
                                  <button type="button" class="btn btn-danger btn-cancel" data-id="${order.id}" onclick="changeOrderStatus('${order.id}', 'canceled')">
                                    <i class="fa-solid fa-xmark"></i>
                                  </button>`
                                  : ""
                              }
                            </div>

                      </td>
                    `;

    ordersTableBody.appendChild(row);
  });
};

const showOrderDetails = (id) => {
  const order = orders.find((o) => o.id == id);
  const modalProductsTableBody = document.getElementById(
    "modal_products_table_body"
  );
  const modalProductsTablEHeadTr = document.getElementById(
    "modal_products_table_head_tr"
  );
  const modalBillInfo = document.getElementById("modal_bill_info");

  modalProductsTableBody.innerHTML = "";
  modalProductsTablEHeadTr.innerHTML = `
  ${userData.role === "admin" ? `<th>seller</th>` : ""}
  <th>product name</th>
  <th>price</th>
  <th>count</th>
  <th>total price</th>
    
  `;

  order.products.forEach((product) => {
    const productPrice = Number(product.totalPrice) / Number(product.count);
    const row = document.createElement("tr");
    row.innerHTML = `
    ${
      userData.role === "admin" ? `<td>${product.product.seller.name}</td>` : ""
    }
              <td>${product.product.name}</td>
              <td>${productPrice} EGP</td>
              <td>${product.count}</td>
              <td>${product.totalPrice} EGP</td>
            `;
    modalProductsTableBody.appendChild(row);
  });

  modalBillInfo.innerHTML = `
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-regular fa-id-card"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Order No</p>
                    <p class="title">#${order.id}</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-solid fa-money-bill-wave"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Order Price</p>
                    <p class="title">${order.totalOrderPrice} EGP</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-solid fa-user"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Name</p>
                    <p class="title">${order.billDetails.name}</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-solid fa-phone"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Phone</p>
                    <p class="title">${order.billDetails.phone}</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-regular fa-credit-card"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Payment Method</p>
                    <p class="title">${order.paymentMethodType}</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-solid fa-chart-bar"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Order Status</p>
                    <p class="title ${
                      order.orderStatus === "processing"
                        ? "text-info"
                        : order.orderStatus === "shipped"
                        ? "text-success"
                        : order.orderStatus === "canceled"
                        ? "text-danger"
                        : ""
                    }">${order.orderStatus}</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-solid fa-location-dot"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Address</p>
                    <p class="title">${order.billDetails.address}</p>
                  </div>
                </div>
                <div class="bill-item">
                  <div class="item-icon"><i class="fa-solid fa-calendar-week"></i></div>
                  <div class="item-texts">
                    <p class="sub-title">Order Date</p>
                    <p class="title">${order.createdAt.split("T")[0]}</p>
                  </div>
                </div>
              `;

  $("#orderModal").modal("show");
};

const changeOrderStatus = (orderId, status) => {
  const order = ordersList.find((o) => o.id == orderId);
  if (order) {
    order.orderStatus = status;
    if (order.orderStatus == "canceled") {
      order.products.forEach((el) => {
        incrementRemovedProductQuantity(el.product.id, el.count);
      });
      order.totalOrderPrice = 0;
      
    }

    localStorage.setItem("ordersList", JSON.stringify(ordersList));
    renderTable();
    getHomeStatistics();
  }
};

function incrementRemovedProductQuantity(productId, count) {
  const updatedProductsList =
    JSON.parse(localStorage.getItem("productsList")) || [];
  const productIndex = updatedProductsList.findIndex(
    (product) => product.id == productId
  );
  if (productIndex !== -1) {
    updatedProductsList[productIndex].quantity += count;
    localStorage.setItem("productsList", JSON.stringify(updatedProductsList));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable();
});
