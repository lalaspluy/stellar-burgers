import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
console.log('=== DEBUG STORE ===');
console.log('Importing constructorReducer...');

import ingredientsReducer from './slices/ingredients-slice';
import ordersReducer from './slices/orders-slice';
import burgerConstructorReducer from './slices/constructor-slice';

console.log(
  'Constructor reducer toString:',
  burgerConstructorReducer.toString()
);

console.log('Constructor reducer imported:', burgerConstructorReducer);
console.log('Is function?', typeof burgerConstructorReducer === 'function');
console.log('=== END DEBUG ===');

const userReducer = (
  state = { user: null, isAuthChecked: false },
  action: any
) => {
  switch (action.type) {
    case 'user/checkAuth/pending':
      return { ...state, isAuthChecked: false };
    case 'user/checkAuth/fulfilled':
      return { user: action.payload, isAuthChecked: true };
    case 'user/checkAuth/rejected':
      return { user: null, isAuthChecked: true };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer
});

console.log('Root reducer test:', rootReducer(undefined, { type: '@@INIT' }));

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
