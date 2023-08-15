import styles from './Button.module.css';
import Link from 'next/link';

const Button = ({ link, id }: { link: string; id: string | undefined }) => {
  return (
    <Link href={`/${link}/${id}`}>
      <button className={styles.btn_details}>Show details</button>
    </Link>
  );
};

export default Button;
