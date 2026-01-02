import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;
export const ingredientsErrorSelector = (state: RootState) =>
  state.ingredients.error;

export const currentOrderSelector = (state: RootState) =>
  state.orders.currentOrder;
export const orderRequestSelector = (state: RootState) =>
  state.orders.orderRequest;
export const orderFailedSelector = (state: RootState) =>
  state.orders.orderFailed;
export const orderErrorSelector = (state: RootState) => state.orders.error;

export const userOrdersSelector = (state: RootState) => state.orders.userOrders;
export const feedOrdersSelector = (state: RootState) => state.orders.feedOrders;
export const totalOrdersSelector = (state: RootState) => state.orders.total;
export const totalTodayOrdersSelector = (state: RootState) =>
  state.orders.totalToday;

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
