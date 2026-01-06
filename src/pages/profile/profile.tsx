import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userSelector } from '../../services/selectors';
import { updateUser } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(userSelector);

  const [formValue, setFormValue] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  }));

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (isFormChanged && user) {
      const updateData: { name: string; email: string; password?: string } = {
        name: formValue.name,
        email: formValue.email
      };

      if (formValue.password.trim() !== '') {
        updateData.password = formValue.password;
      }

      dispatch(updateUser(updateData))
        .unwrap()
        .then(() => {
          // Очищаем поле пароля после успешного обновления
          setFormValue((prev) => ({
            ...prev,
            password: ''
          }));
        })
        .catch((error) => {
          console.error('Ошибка обновления:', error);
        });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) {
    return <Preloader />;
  }

  console.log('Profile debug:', {
    user,
    formValue,
    isFormChanged
  });

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
