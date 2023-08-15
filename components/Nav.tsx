'use client';

import styles from './Nav.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Nav = () => {
  const currentRoute = usePathname();

  return (
    <nav className={styles.nav}>
      <Link
        href="/"
        className={
          currentRoute === '/' ? styles.active_nav : styles.unactive_nav
        }
      >
        Lignum Pizza
      </Link>
      <Link
        href="/ingredients"
        className={
          currentRoute === '/ingredients'
            ? styles.active_nav
            : styles.unactive_nav
        }
      >
        Ingredients
      </Link>
      <Link
        href="/operations"
        className={
          currentRoute === '/operations'
            ? styles.active_nav
            : styles.unactive_nav
        }
      >
        Operations
      </Link>
    </nav>
  );
};

export default Nav;
