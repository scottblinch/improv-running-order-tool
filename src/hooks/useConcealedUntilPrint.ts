import { useEffect, useRef } from 'react';

export function useConcealedUntilPrint<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reveal = () => {
      node.removeAttribute('aria-hidden');
      node.inert = false;
    };

    const conceal = () => {
      node.setAttribute('aria-hidden', 'true');
      node.inert = true;
    };

    conceal();
    window.addEventListener('beforeprint', reveal);
    window.addEventListener('afterprint', conceal);

    return () => {
      window.removeEventListener('beforeprint', reveal);
      window.removeEventListener('afterprint', conceal);
      reveal();
    };
  }, []);

  return ref;
}
