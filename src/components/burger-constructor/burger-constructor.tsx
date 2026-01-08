import { FC, useMemo } from 'react';
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
import { getCookie } from '../../utils/cookie';

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

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }

    const token = getCookie('accessToken');

    if (!token) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    const ingredientIds: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
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
