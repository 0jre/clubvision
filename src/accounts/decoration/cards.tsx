import styled from 'styled-components';
import { LogIn } from 'lucide-react';

interface SessionCardProps {

  date: string;
  status: 'success' | 'warning' | 'danger';
  cid: string;
  license: string;
}

export const theme = {
  colors: {
    background: '#121214',
    card: '#2631286f',
    primary: '#00b37e',
    secondary: '#121214',
    text: '#ffffff',
    textSecondary: '#8d8d99',
    success: '#00b37e',
    warning: '#d33013',
    danger: '#f75a68'
  }
};

 
export function SessionCard({  date, status , cid , license}: SessionCardProps) {
  return (
    <Card>
      <IconContainer>
        <LogIn size={24} color="#d8e2dd" />
      </IconContainer>
      <InfoContainer>
        <Location>Autorização de acesso - CID {cid}</Location>

        <Date>{date}</Date>
        <p>{license}</p>
      </InfoContainer>
      <StatusBadge status={status}>
        {status === 'success' && 'Autorizado'}
        {status === 'warning' && 'Recusado'}
        {status === 'danger' && 'Erro'}
      </StatusBadge>
    </Card>
  );
}




const Card = styled.div`
  background: linear-gradient(204deg, #21c9754b -7%, #b85cff00 33%), linear-gradient(162deg, #12131240 -10%, #2c88dd00 25%), linear-gradient(0deg, #12131240, #12131240);
  border-radius: 9px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;

 
`;

const IconContainer = styled.div<{ theme: any }>`
  background: ${props => props.theme.colors.secondary};
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoContainer = styled.div`
  flex: 1;

  p{
    font-family: 'ProximaNova-Italic', sans-serif;
    color: #3c413e;
    font-size: 13px;
  }
`;

const Location = styled.h3<{ theme: any }>`
  color: ${props => props.theme.colors.text};
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
  color: #b4beb6;
  font-family: 'InterSemiBold', monospace;
`;

const Date = styled.h4<{ theme: any }>`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
  font-family: 'ProximaNova-Italic', monospace;
`;

const StatusBadge = styled.span<{theme: any, status: 'success' | 'warning' | 'danger' }>`
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 2px solid;
  
  ${props => {
    switch (props.status) {
      case 'success':
        return `
          background: rgba(0, 179, 126, 0.1);
          border-color: ${props.theme.colors.success};
          color: ${props.theme.colors.success};
        `;
      case 'warning':
        return `
          background: rgba(218, 53, 32, 0.1);
          border-color: ${props.theme.colors.warning};
          color: ${props.theme.colors.warning};
        `;
      case 'danger':
        return `
          background: rgba(247, 100, 90, 0.1);
          border-color: ${props.theme.colors.danger};
          color: ${props.theme.colors.danger};
        `;
      default:
        return `
          background: rgba(0, 179, 126, 0.1);
          border-color: ${props.theme.colors.success};
          color: ${props.theme.colors.success};
        `;
    }
  }}
`;
