import { RootState } from './store';
import { createSelector } from '@reduxjs/toolkit';

// Ингредиенты
export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;

export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;

// Заказы
export const currentOrderSelector = (state: RootState) =>
  state.orders.currentOrder;

export const orderRequestSelector = (state: RootState) =>
  state.orders.orderRequest;

// Лента заказов
export const feedOrdersSelector = (state: RootState) => state.feed.orders;

export const totalOrdersSelector = (state: RootState) => state.feed.total;

export const totalTodayOrdersSelector = (state: RootState) =>
  state.feed.totalToday;
export const feedLoadingSelector = (state: RootState) => state.feed.loading;
// Пользователь
export const userSelector = (state: RootState) => state.user.user;

export const isAuthCheckedSelector = (state: RootState) =>
  state.user.isAuthChecked;

// История заказов пользователя
export const userOrdersSelector = (state: RootState) => state.user.orders;

// Конструктор
export const constructorBunSelector = (state: RootState) =>
  state.burgerConstructor.bun;

export const constructorIngredientsSelector = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const constructorItemsSelector = createSelector(
  constructorBunSelector,
  constructorIngredientsSelector,
  (bun, ingredients) => ({
    bun,
    ingredients
  })
);

// Фильтры ингредиентов
export const bunsSelector = createSelector(ingredientsSelector, (items) =>
  items.filter((item) => item.type === 'bun')
);

export const mainsSelector = createSelector(ingredientsSelector, (items) =>
  items.filter((item) => item.type === 'main')
);

export const saucesSelector = createSelector(ingredientsSelector, (items) =>
  items.filter((item) => item.type === 'sauce')
);
