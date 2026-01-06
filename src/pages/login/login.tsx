import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { loginUser, fetchUserOrders } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        dispatch(fetchUserOrders());
        navigate(from, { replace: true });
      })
      .catch((error) => {
        setErrorText(error || 'Ошибка авторизации');
      });
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
