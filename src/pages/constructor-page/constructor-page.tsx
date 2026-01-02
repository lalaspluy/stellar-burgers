import { useSelector, useDispatch } from '../../services/store';
import { useEffect } from 'react';
import styles from './constructor-page.module.css';
import { ingredientsLoadingSelector } from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(ingredientsLoadingSelector);

  useEffect(() => {
    // Загружаем ингредиенты при монтировании компонента
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
