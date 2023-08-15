'use client';

import styles from '../page.module.css';
import { CardList } from '@/components/CardList';
import { AllOperationResponse } from '@/types/operation-response.interface';
import getData from '@/utils/get-data';
import { useState, useEffect } from 'react';

export default function Operations() {
  const [operations, setOperations] = useState<AllOperationResponse>([]);

  useEffect(() => {
    const fetchOperations = async () => {
      setOperations(await getData('operations'));
    };
    fetchOperations();
  }, []);

  return (
    <div className={styles.container}>
      {operations.map((operation) => (
        <CardList link="operations" key={operation._id} item={operation} />
      ))}
    </div>
  );
}
