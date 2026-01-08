import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/selectors';

export const AppHeader: FC = () => {
  const user = useSelector(userSelector);
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
