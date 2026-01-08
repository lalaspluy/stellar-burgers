import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { getCookie } from '../../utils/cookie';
import { isAuthCheckedSelector, userSelector } from '../../services/selectors';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userSelector);

  const token = getCookie('accessToken');
  const isAuthenticated = !!token && !!user;

  // Если проверка авторизации еще не завершена, показываем прелоадер
  if (!isAuthChecked && !onlyUnAuth) {
    return <Preloader />;
  }

  // Маршрут для авторизованных, но пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Маршрут для неавторизованных, но пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
