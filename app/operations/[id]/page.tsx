'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../../styles/PizzaDetails.module.css';
import Loading from '@/app/loading';
import getData from '@/utils/get-data';
import { OperationResponse } from '@/types/operation-response.interface';

const page = () => {
  const { id } = useParams();
  const [operationDetails, setOperationDetails] = useState<OperationResponse>();

  useEffect(() => {
    const fetchOperationDetails = async () => {
      setOperationDetails(await getData('operations', id.toString()));
    };
    fetchOperationDetails();
  }, []);

  return (
    <>
      {operationDetails ? (
        <div className={styles.card}>
          <Link className={styles.arrow} href="/operations">
            <Image
              src="/icons/arrow_left.svg"
              width="50"
              height="50"
              alt="arrow-left"
            />
          </Link>
          <Image
            src={operationDetails.imageUrl}
            alt={operationDetails.name}
            width="255"
            height="255"
          />
          <h1>{operationDetails.name}</h1>
          <div className={styles.details}>
            <div>
              <h2>Pizzas</h2>
              {operationDetails.pizzas!.map((pizza: any) => (
                <p key={pizza}>{pizza}</p>
              ))}
            </div>
            <div>
              <h2>Ingredients</h2>
              {operationDetails.ingredients!.map((ingredient: any) => (
                <p key={ingredient}>{ingredient}</p>
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
