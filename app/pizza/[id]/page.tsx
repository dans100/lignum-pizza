'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/PizzaDetails.module.css';
import Loading from '@/app/loading';
import getData from '@/utils/get-data';
import { PizzaResponse } from '@/types/pizza-response.interface';

const page = () => {
  const { id } = useParams();
  const [pizzaDetails, setPizzaDetails] = useState<PizzaResponse>();

  useEffect(() => {
    const fetchPizzaDetails = async () => {
      setPizzaDetails(await getData('pizzas', id.toString()));
    };
    fetchPizzaDetails();
  }, []);

  return (
    <>
      {pizzaDetails ? (
        <div className={styles.card}>
          <Link className={styles.arrow} href="/">
            <Image
              src="/icons/arrow_left.svg"
              width="50"
              height="50"
              alt="arrow-left"
            />
          </Link>
          <Image
            src={pizzaDetails.imageUrl}
            alt={pizzaDetails.name}
            width="255"
            height="255"
          />
          <h1>{pizzaDetails.name}</h1>
          <div className={styles.details}>
            <div>
              <h2>Ingredients</h2>
              {pizzaDetails.ingredients!.map((ingredient: string) => (
                <p key={ingredient}>{ingredient}</p>
              ))}
            </div>
            <div>
              <h2>Operations</h2>
              {pizzaDetails.operations!.map((operation: string) => (
                <p key={operation}>{operation}</p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default page;
