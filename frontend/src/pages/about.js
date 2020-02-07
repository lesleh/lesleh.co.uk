import React, { useCallback, useEffect, useState } from 'react';

import Layout from '../components/layout';

const useCounter = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount(count + 1), [count, setCount]);
  const decrement = useCallback(() => setCount(count - 1), [count, setCount]);

  return [count, increment, decrement];
};

const Counter = () => {
  const [count, increment, decrement] = useCounter();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const id = requestAnimationFrame(() => {
      increment();
    });
    // eslint-disable-next-line no-undef
    return () => cancelAnimationFrame(id);
  }, [count, increment]);

  return (
    <div>
      <button type="button" onClick={decrement}>-</button>
      {' '}
      {count}
      {' '}
      <button type="button" onClick={increment}>+</button>
    </div>
  );
};

const About = () => (
  <Layout title="About">
    <p>About</p>
    <Counter />
  </Layout>
);

export default About;
