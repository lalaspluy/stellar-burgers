import { FC, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
  constructorItemsSelector,
  orderRequestSelector,
  currentOrderSelector
} from '../../services/selectors';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/orders-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { getCookie } from '../../utils/cookie';
import {
  fetchUserOrders,
  addUserOrder
} from '../../services/slices/user-slice';
import { fetchFeedOrders } from '../../services/slices/feed-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(currentOrderSelector);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  // Добавляем заказ в историю пользователя после успешного создания
  useEffect(() => {
    if (orderModalData) {
      // Добавляем заказ в историю пользователя
      dispatch(addUserOrder(orderModalData));

      // Обновляем ленту заказов
      dispatch(fetchFeedOrders());

      // Если пользователь авторизован, обновляем его историю с сервера
      const token = getCookie('accessToken');
      if (token) {
        dispatch(fetchUserOrders());
      }
    }
  }, [orderModalData, dispatch]);

  const onOrderClick = () => {
    // Проверяем наличие булки и ингредиентов
    if (
      !constructorItems.bun ||
      constructorItems.ingredients.length === 0 ||
      orderRequest
    ) {
      return;
    }

    // Проверяем авторизацию через куки
    const token = getCookie('accessToken');

    if (!token) {
      navigate('/login', { state: { from: { pathname: '/' } } });
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
    // Закрываем модалку и очищаем состояние заказа
    dispatch(clearCurrentOrder());
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
