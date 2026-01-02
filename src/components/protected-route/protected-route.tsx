import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  /*const user = useSelector((state) => state.user.user);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);*/
  const location = useLocation();

  const token = localStorage.getItem('accessToken');
  const isAuthenticated = !!token;

  // Пока не проверили авторизацию, показываем прелоадер
  /*if (!isAuthChecked && !onlyUnAuth) {
    return <Preloader />;
  }*/

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
