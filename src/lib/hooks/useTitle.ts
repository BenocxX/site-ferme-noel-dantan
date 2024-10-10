import { useEffect } from 'react';

export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]); // AJOUTE LE TITLE ICI finalement
}
