import { configureStore, createSlice } from '@reduxjs/toolkit';
import Cart from './Cart';


// Product slice for different categories
const saveCart=localStorage.getItem("Cart");
const localStorageCart=saveCart? JSON.parse(saveCart):[];
const ProductSlice = createSlice({
  name: 'products',
  initialState: {
    Veg: [
      { name: 'Tomato', price: 1, image: 'public/tomato.webp' },
      { name: 'Potato', price: 25, image: 'public/potato.jpg' },
      { name: 'Onion', price: 35, image: 'public/onion.jpg' },
      { name: 'Carrot', price: 40, image: 'public/carrot.jpg' },
      { name: 'Spinach', price: 20, image: 'public/spinach.jpg' },
      { name: 'Cabbage', price: 22, image: 'public/cabbage.jpg' },
      { name: 'Cauliflower', price: 28, image: 'public/cauliflower.jpg' },
      { name: 'Green Beans', price: 30, image: 'public/beans.jpg' },
      { name: 'Capsicum', price: 32, image: 'public/capsicum.jpg' },
      { name: 'Brinjal', price: 27, image: 'public/brinjal.jpg' }
    ],
    NonVeg: [
      { name: 'Chicken', price: 150, image: 'public/chicken.jpg' },
      { name: 'Mutton', price: 400, image: 'public/mutton.jpg' },
      { name: 'Fish', price: 200, image: 'public/fish.jpg' },
      { name: 'Prawns', price: 300, image: 'public/prawns.jpg' },
      { name: 'Eggs (12-pack)', price: 60, image: 'public/eggs.jpg' },
      { name: 'Crab', price: 350, image: 'public/crab.jpg' },
      { name: 'Duck', price: 250, image: 'public/duck.jpg' },
      { name: 'Turkey', price: 500, image: 'public/turkey.jpg' },
      { name: 'Lobster', price: 600, image: 'public/lobster.jpg' },
      { name: 'Squid', price: 280, image: 'public/squid.jpg' }
    ],
    Chocolate: [
      { name: 'Dairy Milk', price: 40, image: 'public/diary milk.jpg' },
      { name: 'KitKat', price: 30, image: 'public/kitkat.jpg' },
      { name: 'Perk', price: 10, image: 'public/perk.jpg' },
      { name: '5 Star', price: 20, image: 'public/5 star.jpg' },
      { name: 'Snickers', price: 50, image: 'public/snikers.jpg' },
      { name: 'Munch', price: 15, image: 'public/munch.jpg' },
      { name: 'Ferrero Rocher', price: 400, image: 'public/Ferrero Rocher.jpg' },
      { name: 'Toblerone', price: 350, image: 'public/Toblerone.jpg' },
      { name: 'Bournville', price: 100, image: 'public/Bournville.jpg' },
      { name: 'Milkybar', price: 25, image: 'public/Milkybar.jpg' }
    ]
  },
  reducers: {}
});

// Cart slice
const cartslice = createSlice({
  name: 'cart',
  initialState: localStorageCart,
  reducers: {
    AddToCart: (state, inputItem) => {
      const item = state.find(item => item.name === inputItem.payload.name);
      if (item) {
        item.quantity += 1;
      } else {
        state.push({ ...inputItem.payload, quantity: 1 });
      }
    },
    IncCart: (state, inputItem) => {
      const item = state.find(item => item.name === inputItem.payload.name);
      if (item) {
        item.quantity += 1;
      }
    },
    DecCart: (state, inputItem) => {
      const itemIndex = state.findIndex(item => item.name === inputItem.payload.name);
      if (itemIndex !== -1) {
        if (state[itemIndex].quantity > 1) {
          state[itemIndex].quantity -= 1;
        } else {
          state.splice(itemIndex, 1); // remove item from cart if quantity is 1
        }
      }
    },
    RemoveFromCart: (state, inputItem) => {
      return state.filter(item => item.name !== inputItem.payload.name);
    },
    ClearCart: () => {
      return [];
    }
  }
});

// Orders slice
const orderSlice = createSlice({
  name: 'orders',
  initialState: [],
  reducers: {
    AddOrder: (state, action) => {
      state.push(action.payload);
    }
  }
});

// Export the actions
export const { AddToCart, IncCart, DecCart, RemoveFromCart, ClearCart } = cartslice.actions;
export const { AddOrder } = orderSlice.actions;

// Configure the store
const store = configureStore({
  reducer: {
    products: ProductSlice.reducer,
    Cart: cartslice.reducer,
    Orders: orderSlice.reducer
  }
});
store.subscribe(()=>{
  const state=store.getState();
    localStorage.setItem("Cart",JSON.stringify(state.Cart))
  });

export default store;
