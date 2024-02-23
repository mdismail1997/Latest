import {cart_base_url} from '../Services/Constants';
import client, {cartTOken, clientTOken} from './client';

const Login = data => {
  return client.post('/login', data);
  // .then(response => {
  //   console.log('&&&&&&&&&&', response);

  //   return response.data;
  // });
};

const Register = data => {
  return client.post('/register', data);
};

const ForgetPassword = data => {
  return client.post('/forgot-password', data);
};

const ChangePassword = data => {
  return client.post('/change-password', data);
};

const Category = () => {
  return client.get('/categories');
};

const Products = () => {
  return client.get('/products');
};

const productSearch = data => {
  return client.get(`product-search?query=${data}`);
};

const productDetails = data => {
  return client.get(`product/${data}`);
};

const RatingandReview = (id, content, rating) => {
  return clientTOken.post(
    `post-review?product_id=${id}&content=${content}&rating=${rating}`,
  );
};

const getReviewData = data => {
  return client.get(`product-reviews/${data}`);
};

const cartItem = (id, quantity) => {
  return cartTOken.post(`/cart/add-item?id=${id}&quantity=${quantity}`);
};

const getCartItem = () => {
  return cartTOken.get(`/cart`);
};

const checkout = data => {
  return clientTOken.post(`checkout`, data);
};

const updateCartItem = (item_key, quantity) => {
  return cartTOken.post(`/cart/item/${item_key}?quantity=${quantity}`);
};

const removeItemCart = id => {
  return cartTOken.delete(`/cart/item/${id}`);
};

const clearCartItem = () => {
  return cartTOken.post(`/cart/clear`);
};

const addWishlist = id => {
  return clientTOken.post(`add-to-wishlist?product_id=${id}`);
};

const getWishlist = () => {
  return clientTOken.get(`wishlist`);
};

const removeItemWishlist = id => {
  return clientTOken.post(`remove-item-from-wishlist?product_id=${id}`);
};

const addProduct = data => {
  return clientTOken.post(`add-product`, data);
};

const editProduct = data => {
  return clientTOken.post(`edit-product`, data);
};

const deleteProduct = id => {
  return clientTOken.post(`delete-product?product_id=${id}`);
};
const myProductList = () => {
  return clientTOken.get(`my-products-list`);
};

const getOrderList = () => {
  return clientTOken.get(`order-list`);
};

const authService = {
  Login,
  Register,
  Category,
  Products,
  productSearch,
  productDetails,
  ChangePassword,
  ForgetPassword,
  RatingandReview,
  getReviewData,
  cartItem,
  getCartItem,
  removeItemCart,
  checkout,
  updateCartItem,
  clearCartItem,
  addWishlist,
  getWishlist,
  removeItemWishlist,
  addProduct,
  editProduct,
  deleteProduct,
  myProductList,
  getOrderList,
};

export default authService;
