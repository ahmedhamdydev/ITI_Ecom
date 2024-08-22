var userData = userData || JSON.parse(localStorage.getItem("userData"));
const ordersList = JSON.parse(localStorage.getItem("ordersList")) || [];

let orders;
if (userData.role === "seller") {
  orders = ordersList.filter((el) => el.sellerId == userData.id && el.totalOrderPrice > 0);
} else if (userData.role === "admin") {
  orders = ordersList.filter((el) => el.totalOrderPrice > 0);
} else {
  orders = [];
}

// Initialize analytics object
const salesAnalytics = {
  totalSales: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  orderStatusDistribution: {
    processing: 0,
    shipped: 0,
    canceled: 0,
  },
};

// Calculate the analytics
orders.forEach((order) => {
  salesAnalytics.totalSales += order.totalOrderPrice;
  salesAnalytics.totalOrders += 1;
  salesAnalytics.orderStatusDistribution[order.orderStatus] += 1;
});

// Calculate the average order value
salesAnalytics.averageOrderValue =
  salesAnalytics.totalOrders > 0
    ? salesAnalytics.totalSales / salesAnalytics.totalOrders
    : 0;

// Prepare data for Chart.js
const chartData = {
  barChart: {
    labels: ["Total Sales", "Total Orders", "Average Order Value"],
    datasets: [
      {
        label: "Sales Analytics",
        data: [
          salesAnalytics.totalSales,
          salesAnalytics.totalOrders,
          salesAnalytics.averageOrderValue,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  pieChart: {
    labels: ["Processing", "Shipped", "Canceled"],
    datasets: [
      {
        label: "Order Status Distribution",
        data: [
          salesAnalytics.orderStatusDistribution.processing,
          salesAnalytics.orderStatusDistribution.shipped,
          salesAnalytics.orderStatusDistribution.canceled,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
};

const ctxBar = document.getElementById("barChart").getContext("2d");
const ctxPie = document.getElementById("pieChart").getContext("2d");

const barChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: ["Total Sales", "Total Orders", "Average Order Value"],
    datasets: [
      {
        label: "Total Sales",
        data: [salesAnalytics.totalSales, null, null],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Orders",
        data: [null, salesAnalytics.totalOrders, null],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y1",
      },
      {
        label: "Average Order Value",
        data: [null, null, salesAnalytics.averageOrderValue],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        type: "linear",
        position: "left",
      },
      y1: {
        beginAtZero: true,
        type: "linear",
        position: "right",
        grid: {
          drawOnChartArea: false, // grid lines for one axis to show up
        },
        ticks: {
          stepSize: 1,
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Sales Analytics",
      },
    },
  },
});

const pieChart = new Chart(ctxPie, {
  type: "pie",
  data: chartData.pieChart,
  options: {
    responsive: true,
  },
});
