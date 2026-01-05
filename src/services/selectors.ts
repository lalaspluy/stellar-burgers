import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

// Ингредиенты
export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;
export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;

// Заказы (создание заказа)
export const currentOrderSelector = (state: RootState) =>
  state.orders.currentOrder;
export const orderRequestSelector = (state: RootState) =>
  state.orders.orderRequest;
export const orderFailedSelector = (state: RootState) =>
  state.orders.orderFailed;
export const orderErrorSelector = (state: RootState) => state.orders.error;

// Лента заказов (из feed slice)
export const feedOrdersSelector = (state: RootState) => state.feed.orders;
export const totalOrdersSelector = (state: RootState) => state.feed.total;
export const totalTodayOrdersSelector = (state: RootState) =>
  state.feed.totalToday;
export const feedLoadingSelector = (state: RootState) => state.feed.loading;

// Пользователь
export const userSelector = (state: RootState) => state.user.user;
export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;
export const userLoadingSelector = (state: RootState) => state.user.loading;
export const userErrorSelector = (state: RootState) => state.user.error;

// История заказов пользователя (user slice)
export const userOrdersSelector = (state: RootState) => state.user.orders;
export const userOrdersLoadingSelector = (state: RootState) =>
  state.user.ordersLoading;
export const userOrdersErrorSelector = (state: RootState) =>
  state.user.ordersError;

export const bunsSelector = createSelector(ingredientsSelector, (items) =>
  items.filter((item) => item.type === 'bun')
);

export const mainsSelector = createSelector(ingredientsSelector, (items) =>
  items.filter((item) => item.type === 'main')
);

export const saucesSelector = createSelector(ingredientsSelector, (items) =>
  items.filter((item) => item.type === 'sauce')
);

export const constructorBunSelector = (state: RootState) =>
  state.burgerConstructor?.bun || null;

export const constructorIngredientsSelector = (state: RootState) =>
  state.burgerConstructor?.ingredients || [];

export const constructorItemsSelector = createSelector(
  constructorBunSelector,
  constructorIngredientsSelector,
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);
