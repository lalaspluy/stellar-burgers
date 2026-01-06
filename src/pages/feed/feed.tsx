import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedOrders } from '../../services/slices/feed-slice';
import {
  feedOrdersSelector,
  feedLoadingSelector
} from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(feedOrdersSelector);
  const loading = useSelector(feedLoadingSelector);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  const handleGetFeeds = () => {
    setIsRefreshing(true);
    dispatch(fetchFeedOrders())
      .unwrap()
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  if ((loading && !orders.length) || isRefreshing) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
