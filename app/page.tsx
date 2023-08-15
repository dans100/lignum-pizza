'use client';

import styles from './page.module.css';
import { CardList } from '@/components/CardList';
import { AllPizzaResponse } from '@/types/pizza-response.interface';
import getData from '@/utils/get-data';
import { useState, useEffect } from 'react';

export default function Home() {
  const [pizzas, setPizzas] = useState<AllPizzaResponse>([]);

  useEffect(() => {
    const fetchPizzas = async () => {
      setPizzas(await getData('pizzas'));
    };
    fetchPizzas();
  }, []);

  return (
    <div className={styles.container}>
      {pizzas.map((pizza) => (
        <CardList link="pizza" key={pizza._id} item={pizza} />
      ))}
    </div>
  );
}
