import { useCounter } from '../../hooks/useCounter'; 

export function ButtonCounter() {
  const { count, increment } = useCounter();

  return (
    <button onClick={increment} aria-label="increment-button">
      Contador: {count}
    </button>
  );
}
