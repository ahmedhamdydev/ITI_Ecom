// usersList array
usersList = [
  {
    id: "1",
    name: "test",
    email: "test@gmail.com",
    password: "123456",
    role: "customer", // customer,seller
  },
];

// userData object after auth
userData = {
  id: "1",
  name: "kareem",
  email: "kareem@gmail.com",
  role: "user",
};


// productsList array
productsList = [
  {
    id: "1", 
    images: ["src2.png", "src2.png", "src3.png", "src4.png"],
    name: "product 1",
    description: "test description test description test description",
    price: 200, 
    discount: 10, 
    quantity: 50,
    category: {
      id: "electronics",
      name: "Electronics",
    },
    seller: {
      id: "1",
      name: "km store",
    },
  },
];

// cartList array
const cartList = [
  {
    id: "1", 
    cartOwner: "1", 
    totalCartPrice: 30742, 
    products: [
      {
        count: 3,
        product: {
          id: "1",
          images: ["src2.png", "src2.png", "src3.png", "src4.png"],
          name: "product 1",
          description: "test description test description test description",
          price: 200, // 200 EGP
          discount: 10, // 10%
          quantity: 50,
          category: {
            id: "6439d2d167d9aa4ca970649f",
            name: "Electronics",
          },
          seller: {
            id: "1",
            name: "km store",
          },
          rating: 4.8,
        },
        totalPrice: 400, 
      },
      
    ],
  },
  
];

// ordersList array
ordersList = [
  {
    id: "1", //uuid
    // id : ordersList.length
    // ? Math.max(...ordersList.map((p) => parseInt(p.id))) + 1
    // : 1,
    orderOwner: "1", // id of userData
    totalOrderPrice: 300, 
    paymentMethodType: "cash",
    orderStatus: "processing",
    billDetails: {
      name: "karim 1",
      phone: "01228594886",
      city: "Cairo",
      address: "details",
    },
    createdAt: "2024/07/08",
    products: [
      {
        count: 2,
        product: {
          id: "1",
          images: ["src2.png", "src2.png", "src3.png", "src4.png"],
          name: "product 1",
          description: "test description test description test description",
          price: 200, 
          discount: 10,
          quantity: 50,
          category: {
            id: "6439d2d167d9aa4ca970649f",
            name: "Electronics",
          },
          seller: {
            id: "1",
            name: "seller1",
          },
          rating: 4.8,
        },
        totalPrice: 400,
      },
    ],
    
  },
];


// messagesList array
messagesList=[
  {
    id:1,
    name:"karim",
    email:"karim@gamil.com",
    phone:"012285904885",
    message : "i have a problem in sign to my account"
  },
  {
    id:2,
    name:"ahmed",
    email:"ahmed@gamil.com",
    phone:"012239485044",
    message : "i have a problem in cash payment"
  }
]

// categories array
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

