
import styled, { keyframes } from "styled-components";
import Image from "next/image";
import React, { useEffect,useState } from "react";
import { useRouter } from "next/router";
import { UserInfo } from "@/types/discord/usersearch";
import { decrypt } from '@/core/security/encryption';
import axios from "axios";
import HeadGlobal from "@/club/head/glob.n";
import ROUTENVX from "@/routes/routes";
import { GetInfo_nvxre_xyloQuerier } from "@/hooks/InfoData";
 
interface Props {
   id: string;
}


interface PIO {
  isAuthorized: boolean,
  isLevel5OrAbove: boolean,
  hasPremium: boolean;
  isOneMonthOrMore: boolean,
  verified: boolean;
  isverified: boolean;
  clubactivity: boolean;
}

export default function MonetizationPage({ id}: Props){
 

  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [userInfo, setUserInfo] = useState <UserInfo | null>(null);
  const [availableRescue, setAvailableRescue] = useState<number>(0);
  const [adpat,setadapt ] = useState('')
  const [adpatx,setadaptx ] = useState(false)
  const [withdrawAmount, setwithdrawAmount] = useState<number>(0);
  const [withdrawMessage, setWithdrawMessage] = useState<string>('');
  const [withdrawHistory, setWithdrawHistory] = useState<Array<{ amount: number,status: string, timestamp: string }>>([]);
 const { isLoadingx, error, userInfoObject,mutate } = GetInfo_nvxre_xyloQuerier();
   
  const [accepted, setaccepted] = useState<PIO | null>(null)
   // Calcular o saldo disponível para saque
   const availableForWithdrawal = availableRescue >= 1000 ? availableRescue : 0;
   
  useEffect(() => {
    // Fetch available rescue amount and withdrawal history on component mount
    const fetchRescueData = async () => {
      try {
        const response = await axios.get('/api/_v4/studio/monetization');
        setAvailableRescue(response.data.availableRescue);
        setWithdrawHistory(response.data.history);
        setaccepted(response.data.verification)
        setLoading(false)
        setwithdrawAmount(response.data.availableRescue)

     

      } catch (error: any) {
        console.error('Erro ao buscar dados de saque:', error);
        if (error.response?.status === 401) {
          router.push(ROUTENVX.signin);  // Redirect to login if not authenticated
        }

        if (error.response?.status === 400) {
          setadapt(error.response.data.message)
          setadaptx(true)
        }

      }  
    };

    fetchRescueData();
  }, []);


  const handleWithdraw = async () => {
    try {
      const response = await axios.post('/api/_v4/studio/monetization', { amount: withdrawAmount });
      setWithdrawMessage(response.data.message);
      setAvailableRescue(response.data.availableRescue);
      setWithdrawHistory(response.data.history);
    } catch (error) {
      console.error('Erro ao processar saque:', error);
      setWithdrawMessage('Erro ao processar saque.');
    }
  };

// Função para formatar valores em dólares
const formatCurrency = (value: number): string => {
     if (value === undefined || value === null || isNaN(value)) {
     return '•••'; 
  }

  return value.toLocaleString('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
 
  
    if (isLoadingx) setLoading(true);
    if (error) return;  
  
        
      
    useEffect(() => {
     if (!isLoadingx && userInfoObject ) {
    setUserInfo(userInfoObject);
    setLoading(false);
     }
   }, [userInfoObject,isLoadingx])


    if (adpatx) {
      return(
        <>

        <ContainerN>
                        <Image src={"/nvrp/logonvrp.png"} alt="novision" height={165} width={165}/>
                        <li>
                        <h4>Clubr Monetização</h4>
                        <p>  {adpat}</p>
                        </li>
                      </ContainerN>
       
        </>
      )
    }
 
    return(
        <>
         <HeadGlobal />
    
  
       <MainDashboardN>
        {userInfo !== null && (
        <>
      {loading ? (
        <>

        </>
      ) : accepted?.verified ? (
        <>
           
<CardViewsdates>
         <Content>
            <ContentAbout> 
              <ul>
        
            <li> 
            <h6>Bits é a moeda virtual principal do TheNovision. Ele permitem que você acesse e adquira uma ampla gama de produtos e serviços exclusivos dentro da nossa plataforma. Com Bits, você pode comprar conteúdo premium, desbloquear recursos especiais, e muito mais.</h6>

<h6>Para garantir que você possa retirar seus Bits, é necessário acumular um mínimo de 1000 Bits. Isso ajuda a manter a eficiência do sistema e permite que você aproveite ao máximo as funcionalidades oferecidas. Assim que atingir o valor mínimo, você poderá solicitar o saque dos seus Bits e utilizá-los conforme desejar.</h6>

            </li>
            </ul>

            <Image src={'/icons/coins/orbit-novision.webp'} alt="coinvision" height={40} width={40} />
            </ContentAbout>
             </Content>
        <h3 className="h3">Clubvision Monetização</h3>
        <ul>
          <section>
            <h5>Saldo acumulado</h5>
            <li className="lise">
            <Image src={'/icons/coins/orbit-novision.webp'} alt='bits' width={30} height={30}/>
            <h1> {formatCurrency(availableRescue ? availableRescue : 0)} Bits</h1>
            </li>
          </section>

          <section>
            <h5>Saldo disponível para saque</h5>
            <li className="lise">
            <Image src={'/icons/coins/orbit-novision.webp'} alt='bits' width={30} height={30}/> 
            <h1>{formatCurrency(availableForWithdrawal ? availableForWithdrawal : 0)} Bits</h1>
            </li>
            {availableForWithdrawal ? (
   <button onClick={handleWithdraw} disabled={withdrawAmount <= 0 || withdrawAmount > availableRescue}>
   Realizar Saque
 </button>
            ) : null}
          

        {withdrawMessage && <p>{withdrawMessage}</p>}
          </section>

          
        </ul>
      </CardViewsdates>
       
      <h3 className="h3">Histórico de Saques</h3>

     
      <div>
        
        <ContainerCollum>
        <Contentuser className='bod'>
           <h3>Data/Hora</h3>
           <h3>STATUS</h3>
            <h3>QUANTIA</h3>
        </Contentuser>

          {withdrawHistory.length > 0 ? (
            withdrawHistory.map((entry, index) => (
              <Contentuser key={index}>
                  <h3 className='maxtext'>{new Date(entry.timestamp).toLocaleString()}</h3>
          <h3>{entry.status}</h3>
          <h3>{entry.amount} Bits</h3>
              </Contentuser>
            ))
          ) : (
            <ContainerN>
            <Image src={'/nvrp/nvrp_bc.png'} alt="novision" height={65} width={65}/>
            <li>
            <h4>Aqui está uma calmaria!</h4>
            <p>Nenhum saque realizado ainda.</p>
            </li>
            </ContainerN>
          )}
        </ContainerCollum>
      </div>
        </>
     ) : (
      <>

<li>
           <h1 className="sdh1">Programa de Recompensas para Clubrs</h1>
           </li>
        <Containerr>
         
          
        <div className="flex flex-col ">
        <CardOp BG="rgba(51, 99, 68, 0.144)">
           <h3>
           Ganhe Bits ao participar ativamente da comunidade TheNoVision
           </h3>
          <img src="/icons/coins/gem.png" height={90} width={90} alt="sticker" />
        </CardOp>

        <CardOp  BG="rgba(219, 30, 30, 0.205)">
           <h3>
            Colete recompensas em Bits por convidar amigos para o thenovision
           </h3>
          <img src="/icons/tickets.png" height={90} width={90} alt="sticker" />
        </CardOp>

        <CardOp  BG="rgba(177, 197, 103, 0.103)">
           <h3>
            Colete recompensas de suas postagem engajadas do clubvision
           </h3>
          <img src="/icons/stamps.png" height={90} width={90} alt="sticker" />
        </CardOp>
         
        </div>
 
        <Adpat>
            <h2>Para Participar, Você deve:</h2>
           
            <ul>
           <li>
            {accepted?.isverified ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            </li>
            <h4>Obter o selo de verificado em sua conta clubvision</h4>
           </ul>


           <ul>
           <li>
            {accepted?.isAuthorized ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            </li>
            <h4>Estar na lista de membros da comunidade</h4>
           </ul>

           <ul>
           {accepted?.hasPremium ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <h4>É necessário que sua assinatura de conta obtenha o selo premium</h4>
           </ul>


           <ul>
           {accepted?.isLevel5OrAbove ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <h4>Ser maior que level 10</h4>
           </ul>

           <ul>
           {accepted?.clubactivity ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <h4>Seu perfil deve ter no minimo 1000 Pontos de atividades no clubvision</h4>
           </ul>

           <ul>
           {accepted?.isOneMonthOrMore  ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23"><circle cx="10" cy="13" r="10" fill="currentColor"></circle><path fill="#E3E3E6" d="M15.713 10.113c-.875 1.352-1.678 2.782-2.456 4.235q-.21.397-.398.81l-.197.41-.228.46a26 26 0 0 1-.447.83c-.076.14-.158.26-.246.387a3 3 0 0 1-.246.316 1.34 1.34 0 0 1-.49.369.8.8 0 0 1-.288.041h-.013V18h-.061l-.054-.047a1 1 0 0 1-.115-.062 6 6 0 0 1-.435-.42c-.071-.107-.143-.208-.209-.322l-.196-.364-.371-.758-.246-.519q-.41-.96-.833-1.905c-.38-.859-.837-1.681-1.274-2.491-.283-.52-.6-1.012-.897-1.506-.145-.26-.292-.498-.442-.731a5 5 0 0 0-.462-.65.6.6 0 0 1-.098-.137.17.17 0 0 1 0-.12c.022-.07.133-.147.336-.152.27.002.538.061.786.173.316.142.601.348.84.608.113.122.219.241.322.368l.283.387q.273.39.53.779c.17.26.337.532.491.802.155.27.295.553.438.83q.421.836.803 1.687c.128.283.245.569.373.854l.18.428.083.218.042.11a.4.4 0 0 1 .027.082q.043.261.167.491a.4.4 0 0 0 .034.052.03.03 0 0 0 .024.012.03.03 0 0 0 .023-.012.5.5 0 0 0 .071-.086 3 3 0 0 0 .11-.205l.391-.8c.737-1.497 1.46-3.012 2.265-4.487a47 47 0 0 1 1.564-2.68 39 39 0 0 1 2.73-3.813c.766-.943 1.515-1.908 2.478-2.72q.313-.285.66-.52.28-.18.585-.303.222-.078.457-.07a.8.8 0 0 1 .34.088q.162.082.277.228.12.12.22.26c.182.317-.078.73-.532 1.176-.354.306-.695.628-1.047.955-.351.327-.69.675-1.026 1.038a28 28 0 0 0-1.965 2.375 47 47 0 0 0-2.631 4.012z"></path></svg>
              </>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 23">
              <circle cx="10" cy="13" r="10" fill="currentColor"></circle>
              <path fill="#E3E3E6" d="M6.5 9.5 L13.5 16.5 M6.5 16.5 L13.5 9.5" stroke="#E3E3E6" stroke-width="2"/>
            </svg>            

            )} 
            <h4>Estar há 1 mês na comunidade</h4>
           </ul>


           <p className="dp">Quando você cumprir os requisitos para o programa de recompensas clubrs, a ativação do sistema será feita automaticamente em sua conta. Por enquanto, concentre-se em atender aos critérios necessários.</p>
           </Adpat>
         
          
        </Containerr>
  
      </>
     )}

         
    
 
        </>
       )}
       
        </MainDashboardN>
     
        </>
    )
}


interface Po {
  BG: string;
}

const CardOp = styled.div<Po>`
 
  background-color: ${({ BG }) => BG};
  border-radius: 19px;
  padding: 1em 1em 1em;
  display: flex;
  position: relative;
  transform: rotate(7deg);
  justify-content: space-between;
  align-items: center;
  margin: 0.4em;

  
  h3{
    font-family: 'Inter',monospace;
    font-size: 14px;
    max-width: 230px;
    
  }
`; 


const Adpat = styled.div`
  
  margin: 0.4em;
  padding: 0.9em 1em 0.9em;
  position: relative;
 
  h2{
    font-family: 'InterSemiBold', monospace;
    font-size: 15px;
    margin-bottom: 0.9em;
    color: #c4cbcf;
  }

  svg{
    min-width: 20px;
    width: 20px;
    display: block;
    height: 20px;
    color: rgb(61, 61, 61);
  }


  ul{
    margin-bottom: 0.4em;
    display: flex;
    align-items: center;
    gap: 7px;
   
    h4{
      font-size: 15px;
      font-family: 'ProximaNova-Italic', sans-serif;
      color:  #cfd4db;


    }

  }

  .dp{
   
    position: absolute;
    bottom: 9px;
    margin: 0.1em;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 11px;
    font-family: 'InterSemiBold', monospace;
    color: #a0a5a8;
  }

    @media screen and (max-width: 768px) {
    .dp{
      position: relative;
      margin-top: 1em;
      bottom: 0;
    }
  padding: 0.5em;
  
 }

`;
 
const Containerr = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: center;

li{
  text-align: center;

}
  
  

  p{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    color: #a0a5a8;
  }

  @media screen and (max-width: 768px) {
  flex-direction: column;
  padding: 0.5em;
  
 }
`;



const ContainerN = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
place-items: center;
flex-direction: column;
margin-top: 5%;
text-align: center;

 li{
  margin: 0.9em;

 }

h4{
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  margin-top: 0.8em;
  color: #afb2b4;
}

p{
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin: 0.4em;
  color: #676a6d;
}
`;
const Content = styled.div`
   margin: 1em;
   background-color: rgba(83, 84, 87, 0.048);
   padding: 1em 1em 0.8em;
   margin-top: 0;
   margin-bottom: 0;
   border-radius: 12px;

`;


const ContentAbout = styled.div`

   display: flex;
   align-items: top;
   justify-content: space-between;
   
   h6{

 font-size: 9px;
 margin-bottom: 0.5em;
 color: #808186ce;
}

p{
 margin-bottom: 0.6em;
 color: #a9abafce;
 font-weight: 300;
 font-size: 15px;
}
`;
 
const ContainerCollum = styled.section`
  width: 60vw;
  
  border-bottom: 1px solid rgba(38, 37, 41, 0.376);

  .bod{
    background: linear-gradient(204deg, rgba(224, 236, 233, 0.075) -7%, #b85cff00 33%), linear-gradient(162deg, #14151852 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(0, 0, 0, 0.308), rgba(0, 0, 0, 0.363));
    padding: 0.4em 1em 0.4em;
    border-radius: 3px 3px 0 0;
  }
 
`;



const Contentuser = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.4em 0em 0.4em;
  justify-content: space-between;
  background-color: black;
  text-align: center;
  border: 1px solid rgba(33, 33, 36, 0.267);
   
  h3{
    font-size: 14px;
    font-weight: 400;
    color: #c6c6cc;
    margin: 0.5em;
    margin-bottom: 1px solid rgba(33, 33, 36, 0.267);

    font-family: 'InterSemiBold', sans-serif;
  }
  
  .maxtext{
    max-width: 103px;
     overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  &:hover{
    -webkit-line-clamp: 2;
  }
  }
  button{
    padding: 0.3em 1em 0.3em;
    border-radius: 18px;
    background-color: #46474b21;
    font-family: 'InterSemiBold', sans-serif;
    color: rgb(186, 189, 194);
     transition: 0.8s all;
     
    &:hover{
      background-color: #46474b52;
      box-shadow: 3px 8px 18px rgb(11, 11, 12);
    }
 
   }


   .green{
        background-color: #24743f;
       }

       .red{
        background-color: #61252d;
       }
       
   .h42{
    padding: 0.3em 1em 0.3em;
    border-radius: 18px;
    font-weight: 400;
    font-family: 'InterSemiBold', sans-serif;
    color: rgb(182, 186, 192);
     transition: 0.8s all;
    }
`;

 
// STYLED 
 
const CardViewsdates = styled.div`
  

  ul{
     
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);  
    gap: 16px;  

    section{
      margin: 0.4em;
    flex-basis: 20.5rem;
    padding: 16px;
    color: white;
    font-family: 'InterSemiBold', monospace;
    background: rgba(203, 205, 218, 0.068);
    border-radius: 8px;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    }
  }

   .lise{
    display: inline-flex;
    align-items: center;
    padding: 0.5em 0.3em 0.5em;
   }

   h1{
    padding: 0 0.7em 0;
   }

   button{
     position: absolute;
     right: 8px;
     bottom: 12px;
     font-size: 13px;
     font-family: 'Poppins', sans-serif;
     background: linear-gradient(204deg, #c6d4cd -7%, #b85cff00 33%), linear-gradient(162deg, #cdd1db -10%, #2c88dd00 25%), linear-gradient(0deg, rgb(228, 219, 219), rgb(187, 190, 194));
  border-radius: 52px;
  color: #0d0e0fe1;
  padding: 0.8em 2em 0.8em;


    &:hover{
      transform: scale(0.9);
    }
   }
   
   p{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
    color: #9e9fa7;
   }
`;
 
 
// STYLED 
 
const MainDashboardN = styled.section`
  
  margin: 0 auto;
 
  z-index: 999;
  width: 95%;
 padding: 1em ;
  border-radius: 19px;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation: PageAnim 0.8s linear;
 
  @keyframes PageAnim {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }
 
  .sdh1{
    font-family: 'Europa Grotesk';
    font-size: 23px;
    max-width: 540px;
    text-align: center;
    font-weight: 300;
    color: #7c817f;
    margin-bottom: 1em;
  }
  .h3{
    font-family: 'XcSemibold';
    font-size: 21px;
    margin: 0.6em;
    color: #c3c7d3;
  }

 @media screen and (max-width: 768px) {
  margin: 0%;
  margin-left: 0%;
  padding: 0.5em;

 }
`;

const ContentCard2 = styled.div`
 padding-left: 1em;
   margin-left: 1em;
   border-left: 1px solid rgba(173, 174, 187, 0.11);
   display: flex;
    flex-direction: row;
    align-items: center;
    
   h3{
    font-size: 12px;
   }

   p{
    font-size: 9px;
    color: #9b9eafab;
   }
    
    li{
       padding-left: 1em;

       hr{
        width: 100%;
       }
    }

    i{
      font-size: 23px;
      margin-top: 0.3em;
      color: #1ef164;
    }

    .colorred{
        color: #f82828;
      }

`;
 
 

const OPSC = styled.div`
height: 100%;
width: 100%;
display: flex;
justify-content: center;
align-items: center;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: black;
`;






// SELECT CHARACTER
 
const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const ContainerText = styled.div`
  margin-top: 1em;
  p{
  max-width: 440px;
  flex-wrap: wrap;
  font-family: 'ProximaNova-Italic';
    font-size: 11px;
    color: rgb(164, 170, 175);
  }

  
`;

const Text = styled.span`
  overflow: hidden;
  white-space: nowrap;
  animation: ${typingAnimation} 3s steps(40, end);
`;
  
