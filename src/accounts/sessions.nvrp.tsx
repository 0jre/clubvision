import React, { useEffect, useState } from 'react'; 
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { Shield } from 'lucide-react';
import { SessionCard, theme } from './decoration/cards';

function SessionNv() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/club/gaming/comunication');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da API');
        }
        const data = await response.json();

        if (data.players && Array.isArray(data.players)) {
          // Flatten the session array from all players
          const allSessions = data.players.flatMap((player: any) => player.session).flat();
          setSessions(allSessions);
        } else {
          setSessions([]); 
        }
      } catch (error) {
        console.error('Erro ao carregar sessões:', error);
        setSessions([]); 
      }
    };

    fetchSessions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Opções de formatação para data
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    // Formatar a data (sem a hora)
    const formattedDate = date.toLocaleDateString('pt-BR', options);

    // Formatar a hora
    const hour = date.getHours();
    const minute = date.getMinutes();
    const hourText = hour === 12 && minute === 0 ? "meio-dia" : 
                     (hour === 0 && minute === 0 ? "meia-noite" : `${hour}:${minute.toString().padStart(2, '0')}`);

    // Retornar a data e a hora
    return `${formattedDate} às ${hourText}`;
  };

  // Função para agrupar as sessões por data (sem considerar a hora)
  const groupSessionsByDate = (sessions: any[]) => {
    return sessions.reduce((acc, session) => {
      const date = formatDate(session.date).split(' às ')[0];  // Pegar apenas a parte da data (sem a hora)
      if (!acc[date]) {
        acc[date] = []; // Se ainda não existe, cria um novo array para a data
      }
      acc[date].push(session);  // Adiciona a sessão ao array da data correspondente
      return acc;
    }, {} as { [key: string]: any[] });
  };

  const groupedSessions = groupSessionsByDate(sessions);

  // Ordenar as datas agrupadas de forma decrescente
  const sortedDates = Object.keys(groupedSessions).sort((a, b) => {
    // Extraímos as partes da data e criamos um novo objeto Date
    const [dayA, monthA, yearA] = a.split(' de ');
    const [dayB, monthB, yearB] = b.split(' de ');

    // Mapeando os meses para números
    const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    const monthAIndex = monthNames.indexOf(monthA);
    const monthBIndex = monthNames.indexOf(monthB);

    // Criando as instâncias de data com ano, mês e dia
    const dateA = new Date(Number(yearA), monthAIndex, Number(dayA));
    const dateB = new Date(Number(yearB), monthBIndex, Number(dayB));

    return dateB.getTime() - dateA.getTime();  // Ordenando de forma decrescente
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
         
          <Title>Histórico de Sessões</Title>
        </Header>

        <Description>
          Acompanhe todas as suas sessões de login no GTA Novision. Mantenha sua conta segura verificando atividades suspeitas.
        </Description>

        {sortedDates.length > 0 ? (
  sortedDates.map((date, index) => (
    <div key={index}>
      <h2>{date}</h2> {/* Exibe a data agrupada */}
      {groupedSessions[date]
        .sort((a: any, b: any) => {
          // Comparar as sessões por data
          const sessionA = new Date(a.date); // Criar Date de sessão A
          const sessionB = new Date(b.date); // Criar Date de sessão B
          return sessionB.getTime() - sessionA.getTime(); // Ordenar em ordem decrescente
        })
        .map((session: any, idx: any) => (
          <SessionCard
            key={idx}
            date={formatDate(session.date)}  // Formatar a data e a hora antes de exibir
            status={session.accepted ? 'success' : (session.recused ? 'warning' : 'danger')}
            cid={session.cid}
            license={session.license}
          />
        ))}
    </div>
  ))
) : (
  <NoSessionsMessage>Nenhuma sessão encontrada.</NoSessionsMessage>
)}

      </Container>
    </ThemeProvider>
  );
}

export default SessionNv;




const NoSessionsMessage = styled.p`
  font-size: 1.2rem;
  color: #888;
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  h2{
    font-family: 'Inter', monospace;
    margin-bottom: 2em;
    font-size: 15px;
    color: #bec5c0;
  }

  
   @media screen and (max-width: 680px) {
      padding: 0;
    } 
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1<{ theme: any }>`
  font-size: 22px;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  font-family: 'InterSemiBold', monospace;
  gap: 0.75rem;

 
`;

const Description = styled.p<{ theme: any }>`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 1rem;
  font-size: 12px;
  max-width: 390px;
  font-family: 'Inter', monospace;
  line-height: 1.5;
`;
