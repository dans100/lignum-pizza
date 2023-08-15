import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="error">
      <h1>Page not Found!</h1>
      <div className="error-navigate">
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
};

export default NotFound;
