import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  ingredientsSelector,
  feedOrdersSelector,
  userOrdersSelector
} from '../../services/selectors';
import { fetchFeedOrders } from '../../services/slices/feed-slice';
import { fetchUserOrders } from '../../services/slices/user-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(ingredientsSelector);
  const feedOrders = useSelector(feedOrdersSelector);
  const userOrders = useSelector(userOrdersSelector);

  useEffect(() => {
    if (location.pathname.includes('/feed/')) {
      // Если на странице ленты и заказы не загружены
      if (feedOrders.length === 0) {
        dispatch(fetchFeedOrders());
      }
    } else if (location.pathname.includes('/profile/orders/')) {
      // Если на странице истории заказов и заказы не загружены
      if (userOrders.length === 0) {
        dispatch(fetchUserOrders());
      }
    }
  }, [location.pathname, dispatch, feedOrders.length, userOrders.length]);

  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = Number(number);

    if (location.pathname.includes('/feed/')) {
      return feedOrders.find((order) => order.number === orderNumber);
    }

    if (location.pathname.includes('/profile/orders/')) {
      return userOrders.find((order) => order.number === orderNumber);
    }

    return null;
  }, [number, location.pathname, feedOrders, userOrders]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
