import { actionDescriptions, ContainerTypes, containerUpdates } from '@/types/user/notifications';
import Image from 'next/image';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TooltipProps } from 'recharts';
import styled from 'styled-components';


export interface DataPoint {
  date: string;
  time: string;
  amount: number;
  result: string | undefined;
  currency: string;
  action: string;
  newAmount: number;
}

interface Charts {
  data: DataPoint[];
}

const StyledChart: React.FC<Charts> = ({ data }) => (
  <StyledChartWrapper>
    <ResponsiveContainer>
      <LineChart data={data}>
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="amount" stroke="#24e665" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </StyledChartWrapper>
);

export default StyledChart;
 
// Função para obter a descrição da ação
export const getActionDescription = (action: string): string => {
  if (action.startsWith('purchase_')) {
    // Extrai o nome do item da ação
    const itemName = action.replace('purchase_', '') as ContainerTypes; // Garante que itemName é do tipo ContainerTypes
    const containerDescription = containerUpdates[itemName]; // Acessa a descrição correta

    // Verifica se a descrição existe para evitar undefined
    return containerDescription ? `Compra: ${containerDescription}` : 'Compra realizada - descrição desconhecida';
  }
  
  // Retorna a descrição padrão se não for uma compra
  return actionDescriptions[action] || 'Ação desconhecida';
};

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // Extraindo dados do payload
    const { date, time, amount, newAmount,result, currency, action } = payload[0].payload;
    const description = getActionDescription(action);
    const actionDescription = actionDescriptions[action] || description || 'Ação Desconhecida'; 
    
    const parseDate = (dateStr: any) => {
      if (!dateStr || typeof dateStr !== "string") return "Data inválida";
    
      let [part1, part2, year] = dateStr.split('/').map(Number);
      
      // Verifica se part1 pode ser um mês válido (1-12), caso contrário, assume que é o dia
      let day, month;
      if (part1 > 12) {
        day = part1;
        month = part2;
      } else if (part2 > 12) {
        day = part2;
        month = part1;
      } else {
        // Se ambos podem ser meses, assume o formato padrão (DD/MM/YYYY)
        day = part1;
        month = part2;
      }
    
      const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      return `${day}, ${monthNames[month - 1]} de ${year}`;
    };
    
    
    return (
      <CustomTooltipWrapper>
        <Top>
          <p>{parseDate(date)}</p>
          <p>{time}</p>
        </Top>
        <p>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coins" width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1ce670" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" />
            <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
            <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" />
            <path d="M3 6v10c0 .888 .772 1.45 2 2" />
            <path d="M3 11c0 .888 .772 1.45 2 2" />
          </svg> 
          <text>{`Quantia: ${amount} ${currency}`}</text>
        </p>
     
        {result && (
          <p>
           <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-alpha" width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1ce670" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M18.1 6c-1.1 2.913 -1.9 4.913 -2.4 6c-1.879 4.088 -3.713 6 -6 6c-2.4 0 -4.8 -2.4 -4.8 -6s2.4 -6 4.8 -6c2.267 0 4.135 1.986 6 6c.512 1.102 1.312 3.102 2.4 6" />
</svg>
           <text>{`${result}`}</text>
         </p>
        )}

        {newAmount && (
           <p>
           <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-alpha" width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1ce670" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M18.1 6c-1.1 2.913 -1.9 4.913 -2.4 6c-1.879 4.088 -3.713 6 -6 6c-2.4 0 -4.8 -2.4 -4.8 -6s2.4 -6 4.8 -6c2.267 0 4.135 1.986 6 6c.512 1.102 1.312 3.102 2.4 6" />
</svg>
           <text>{`${newAmount}`}</text>
         </p>
        )}
           
        
        <p>
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coins" width="14" height="14" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1ce670" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" />
            <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
            <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" />
            <path d="M3 6v10c0 .888 .772 1.45 2 2" />
            <path d="M3 11c0 .888 .772 1.45 2 2" />
          </svg> 
        {`Ação: ${actionDescription} `}
        </p>
        <Image src='/nvrp/20240520_081457.png' width={21} height={21} alt='novision' />
      </CustomTooltipWrapper>
    );
  }
  return null;
};

const CustomTooltipWrapper = styled.div`
  background-color: #17181a;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 0.5em 1em;
  color: #fff;
  font-size: 14px;
   
  text-align: start;
  position: relative;
  font-family: 'Inter', monospace;

  img{
    position: absolute;
    right: 1px;
    opacity: 0.1;
    bottom: 1px;
  }

  .vcx{
    align-items: center;
    display: flex;
    font-weight: 100;
    font-size: 11px;
    margin-top: 0.9em;
  }


  p{
    font-family: 'Inter', monospace;
    margin: 0.5em;
    color: rgba(186, 188, 199, 0.952);
    font-size: 11px;
  }
`;

const Top = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  p {
    padding-left: 0.4em;
    font-family: 'Inter', monospace;
    font-size: 11px;
    
   

  }
  
 
`;

  
const StyledChartWrapper = styled.div`
  width: 100%;
  height: 90px;
  background-image: url('/nvrp/logonvrp.png');
  background-position: center; 
  background-size: 10%;
  
  background-repeat: no-repeat;
`;

 