'use client';

import styles from '../page.module.css';
import { CardList } from '@/components/CardList';
import { AllIngredientResponse } from '@/types/ingredient-resopnse.interface';
import getData from '@/utils/get-data';
import { useState, useEffect } from 'react';

export default function Operations() {
  const [ingredients, setIngredients] = useState<AllIngredientResponse>([]);

  useEffect(() => {
    const fetchIngredients = async () => {
      setIngredients(await getData('ingredients'));
    };
    fetchIngredients();
  }, []);

  return (
    <div className={styles.container}>
      {ingredients.map((ingredient) => (
        <CardList link="ingredients" key={ingredient._id} item={ingredient} />
      ))}
    </div>
  );
}
