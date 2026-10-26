'use client'
// Importe useEffect e useState
import { useEffect, useState } from 'react';
import { convertToBRL } from '@/lib/oauth/tebex/currency';

const Price = ({
  amount,
  className,
  currencyCode = 'BRL',
  currencyCodeClassName
}: {
  amount: number | string; // Permitir tanto números quanto strings
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'h4'>) => {
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);

  useEffect(() => {
    // Converter para número apenas se for uma string
    const amountValue = typeof amount === 'string' ? parseFloat(amount as string) : amount;
    
    convertToBRL(amountValue, currencyCode)
      .then((convertedPrice) => {
        if (convertedPrice !== null) {
          setConvertedAmount(convertedPrice);
        } else {
          // Se a conversão falhar, manter o valor em dólar
          setConvertedAmount(null);
        }
      })
      .catch((error) => {
        console.error('Error converting to BRL:', error);
        // Se a conversão falhar, manter o valor em dólar
        setConvertedAmount(null);
      });
  }, [amount, currencyCode]);

  return (
    <div suppressHydrationWarning={true} className={className}>
      {convertedAmount !== null ? `${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'BRL',
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(convertedAmount || '0.00'))}` : `${new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD', // Manter em dólar se a conversão falhar
        currencyDisplay: 'narrowSymbol'
      }).format(parseFloat(amount as string) || 0)}`}
    </div>
  );
};

export default Price;
