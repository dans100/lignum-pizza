'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/PizzaDetails.module.css';
import Loading from '@/app/loading';
import getData from '@/utils/get-data';
import { IngredientResponse } from '@/types/ingredient-resopnse.interface';

const page = () => {
  const { id } = useParams();
  const [ingredientDetails, setIngredientDetails] =
    useState<IngredientResponse>();

  useEffect(() => {
    const fetchIngredientDetails = async () => {
      setIngredientDetails(await getData('ingredients', id.toString()));
    };
    fetchIngredientDetails();
  }, []);

  return (
    <>
      {ingredientDetails ? (
        <div className={styles.card}>
          <Link className={styles.arrow} href="/ingredients">
            <Image
              src="/icons/arrow_left.svg"
              width="50"
              height="50"
              alt="arrow-left"
            />
          </Link>
          <Image
            src={ingredientDetails.imageUrl}
            alt={ingredientDetails.name}
            width="255"
            height="255"
          />
          <h1>{ingredientDetails.name}</h1>
          <div className={styles.details}>
            <div>
              <h2>Pizzas</h2>
              {ingredientDetails.pizzas!.map((pizza: string) => (
                <p key={pizza}>{pizza}</p>
              ))}
            </div>
            <div>
              <h2>Operation</h2>
              <p> {ingredientDetails.operation}</p>
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
