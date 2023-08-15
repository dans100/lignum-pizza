'use client';

import Link from 'next/link';

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div className="error">
      <p>There was a problem</p>
      <p>{error.message || 'Something went wrong'}</p>
      <p>Please try again later</p>
      <div className="error-navigate">
        <button onClick={reset}>Try again</button>
        <Link href="/">Go back home</Link>
      </div>
    </div>
  );
};

export default error;
