import {configureStore} from '@reduxjs/toolkit';
import CounterSlice from './CounterSlice';
import {Listreducer} from './Slice';
import productSearchReducer from './slices/Product/productSearchSlice';
import productreducer from './slices/Product/productSlice';
import categoryReducer from './slices/Product/categorySlice';
import productdetailsReducer from './slices/Product/productDetailsSlice';
import ratingReviewReducer from './slices/Product/getreviewSlice';
import cartItemReducer from './slices/Cart/getCartSlice';
import wishlistItemReducer from './slices/Wishlist/getItemSlice';
import myProductListReducer from './slices/Product/getProductSlice';
import myOrderListReducer from './slices/orderListSlice';

const reducer = {
  User: CounterSlice,
  productData: productreducer,
  categoryData: categoryReducer,
  // List: Listreducer,
  productDetailsData: productdetailsReducer,
  productSearchData: productSearchReducer,
  ratingReviewData: ratingReviewReducer,
  cartItemData: cartItemReducer,
  wishlistItemData: wishlistItemReducer,
  myProductListData: myProductListReducer,
  myOrderListData: myOrderListReducer,
};

export const store = configureStore({
  reducer: reducer,
  devTools: true,
});

export default store;
