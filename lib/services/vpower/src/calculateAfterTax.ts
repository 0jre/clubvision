import { SMALL_VALUE_THRESHOLD, } from './calc_tax';

 
// Função para arredondar valores para 2 casas decimais
export const roundToTwoDecimals = (value: number): number => {
    const rounded = Math.round(value * 100) / 100;
    return Math.abs(rounded) < SMALL_VALUE_THRESHOLD ? 0 : rounded;
  };
   
  
// Função para calcular o valor após a taxa aplicada e custo fixo
export const calculateAfterTax = (amount: number, taxRate: number, networkCost: number): number => {
    const fee = roundToTwoDecimals(amount * taxRate);
    const amountAfterFee = roundToTwoDecimals(amount - fee - networkCost);
    return Math.max(amountAfterFee, 0);
  };