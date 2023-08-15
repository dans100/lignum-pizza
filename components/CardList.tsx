import Image from 'next/image';
import styles from './CardList.module.css';
import Button from './Button';
import { IngredientResponse } from '@/types/ingredient-resopnse.interface';
import { OperationResponse } from '@/types/operation-response.interface';
import { PizzaResponse } from '@/types/pizza-response.interface';

type DataResponse = IngredientResponse | OperationResponse | PizzaResponse;

export const CardList = ({
  link,
  item,
}: {
  link: string;
  item: DataResponse;
}) => {
  return (
    <div className={styles.card}>
      <Image
        src={item.imageUrl}
        alt={item.name}
        width="200"
        height="200"
        style={{
          boxShadow: '17px 48px 37px 0 rgba(0, 0, 0, 0.25)',
          borderRadius: '50%',
        }}
      />
      <p>{item.name}</p>
      <Button link={link} id={item._id} />
    </div>
  );
};
