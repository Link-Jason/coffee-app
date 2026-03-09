import React, { createContext, useState } from 'react';

export const CoffeeContext = createContext<any>(null);

export function CoffeeProvider({ children }: any) {
  const [grams, setGrams] = useState('');
  const [liters, setLiters] = useState('');
  const [ratio, setRatio] = useState('16'); 

  const sanitize = (val: string) => val.replace(/[^0-9.]/g, '');

  return (
    <CoffeeContext.Provider value={{ grams, setGrams, liters, setLiters, ratio, setRatio, sanitize }}>
      {children}
    </CoffeeContext.Provider>
  );
}