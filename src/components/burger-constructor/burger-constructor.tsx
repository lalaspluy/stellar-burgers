import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
  constructorItemsSelector, // Используем безопасный селектор
  orderRequestSelector,
  currentOrderSelector
} from '../../services/selectors';
import { createOrder } from '../../services/slices/orders-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(currentOrderSelector);

  console.log('constructorItems debug:', constructorItems);
  /*const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
  };
  const closeOrderModal = () => {};*/

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = () => {
    console.log('=== ORDER CLICK DEBUG ===');
    console.log('Bun:', constructorItems.bun);
    console.log('Ingredients:', constructorItems.ingredients);
    console.log('Ingredients count:', constructorItems.ingredients.length);
    console.log('Order request:', orderRequest);
    console.log('Has token:', !!localStorage.getItem('accessToken'));
    console.log('=== END DEBUG ===');
    // Проверяем наличие булки и ингредиентов
    if (
      !constructorItems.bun ||
      constructorItems.ingredients.length === 0 ||
      orderRequest
    ) {
      return;
    }

    // Проверяем авторизацию
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Формируем массив ID ингредиентов для заказа
    const ingredientIds: string[] = [
      constructorItems.bun._id, // Булка в начале
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id // Булка в конце
    ];

    // Отправляем запрос на создание заказа
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    // Закрываем модалку и очищаем конструктор
    dispatch(clearConstructor());
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
