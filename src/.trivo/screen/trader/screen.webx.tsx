import styled from "styled-components"
import FilterPanel from './FilterPanel';
import {MarketplaceHeader, MarketplaceHeaderReceipt} from './MarketplaceHeader';
import { useEffect,  useState } from "react";
import CardItemView from './card.item';
import { Item } from '@/data/list_tvl/list.container';
import axios from "axios";
import LoadingPageView from "@/resources/loading/market.loading";
import SkinTradingInterface from "./top.items";
import Scrollmargin from "@/components/scrollingcard/scroll.xc";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import ROUTENVX from "@/routes/routes";
import { useRouter } from 'next/router';
 



export default function ScreenTrader () {
  const router = useRouter()
  const [value, setValue] = useState("");
  const [vhash, setVhash] = useState("");
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const [inventory, setInventory] = useState<any>(null);
  const [inventory2, setInventory2] = useState<any>(null);
  const [items2, setItems2] = useState<Item[]>([]);
  const [items2x, setItems2x] = useState<Item[]>([]);
  const [isloading, setLoading] = useState(true);
  const [user, setuser] = useState<any>(null)
  const [showItems, setShowItems] = useState(true)
  const [page, setpage ] = useState(0)
  const [showSecurity, setShowSecurity] = useState(false)
  const [response, setResponse] = useState<any>(null);
  const [trade, setrade] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState({ minutes: 0, seconds: 0,days: 0 });
  const [timerProgress, setTimerProgress] = useState(0);  
  const [isbutton,setbitton] = useState(false);
  const [istradeFailure, setistradefailure] = useState(false);
  const [isfailureopen, setfailureopen] = useState(false)
  const [istradeSuccess, setistradesuccess] = useState(false);
  const [itemId1, setItemId1] = useState('');
  const [itemId2, setItemId2] = useState('');
  const [isactivet, setactivet] = useState(false)
  const [activeItems, setActiveItems] = useState<{ [key: string]: boolean }>({});
  const [activeItemsx, setActiveItemsx] = useState<{ [key: string]: boolean }>({});
  const [islock, setislock] = useState(false);
  const [ismessage, message] = useState('')
 

  const handleItemClick = (id: any) => {
    setActiveItems((prev) => {
      const activeCount = Object.keys(prev).filter((key) => prev[key]).length;
  
      if (prev[id]) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
  
      if (activeCount >= (trade.prime ? 6 : 1)) return prev; // Limita a 4 itens ativos
  
      return { ...prev, [id]: true };
    });
  
    setItemId1((prev) => (prev === id ? '' : prev ? prev : id));
  };
  
  const handleItemClick2 = (id: any) => {
    setActiveItemsx((prev) => {
      const activeCount = Object.keys(prev).filter((key) => prev[key]).length;
  
      if (prev[id]) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
  
      if (activeCount >= (trade.prime ? 6 : 1)) return prev; // Limita a 4 itens ativos
  
      return { ...prev, [id]: true };
    });
  
    setItemId2((prev) => (prev === id ? '' : prev ? prev : id));
  };
  
   
  useEffect(() => {
    setislock(!itemId1 && !itemId2);
    setistradefailure(trade?.status == "expired"|| trade?.status == "refused" || trade?.status == "failure" || trade?.status == "cancelled" ? true : false)
    setistradesuccess(trade?.status == "completed" ? true : false)
 
  }, [itemId1, itemId2,trade]);
 
 
      const handleConfirm = () => {
        setError("");
        setloading(true);
      
        if (!value.trim()) {
          setError("O vhash é obrigatório.");
          return;
        }
    
        setVhash(value.trim());
        setloading(false);
      };
 
   
      const fetchInventory = async () => {
        setError("");
        setLoading(true);
        try {
          const params = new URLSearchParams({ vhash });
          if (itemId1) params.append('itemId1', itemId1);
          if (itemId2) params.append('itemId2', itemId2);
          if (response?.vid) params.append('vid', response?.vid);
            
          const fetchResponse = await fetch(`/api/trivo/trade/search.vhash?${params.toString()}`);
          const data = await fetchResponse.json();
  
          if (!fetchResponse.ok) {
            throw new Error(data.error || "Erro ao buscar inventário.");
          }
  
    
          
          setInventory(data.inventory);
          setInventory2(data.inventory2)
          setrade(data.trade)
          setuser(data.user)
          return data;
        } catch (err: any) {
          setError(err.message);
        }
        setLoading(false);
      }; 

      useEffect(() => {
        if (!vhash) return;
        fetchInventory();
      }, [vhash, itemId1, itemId2, response]);
      
      useEffect(() => {
        let lastStatus = trade?.status;
      
        const interval = setInterval(async () => {
          const updated = await fetchInventory(); // modifique fetchInventory() para retornar os dados
      
          if (updated?.trade?.status !== lastStatus) {
            lastStatus = updated.trade.status;
            setrade(updated.trade);
          }
        }, 10000);



        return () => clearInterval(interval);
      }, [trade]);
      
      useEffect(() => {
       fetchInventory();
      }, [isactivet]);
       
      useEffect(() => {
        const fetchItems = async () => {
          try {
            if (inventory.length > 0) { // Certifique-se de que há um item no array
              const userId = inventory[0].userId;
              const response = await axios.get(`/api/autentic/my.tvl?userId=${userId}`);
              
              if (response.data.success) {
                setItems2(response.data.mytvls);
              } else {
                setError(response.data.message || 'Erro ao carregar itens');
              }
            } else {
              setError('Inventário vazio');
            }
          } catch (error) {
            setError('Erro ao buscar itens do servidor');
          } finally {
            setLoading(false);
          }
        };
      
        fetchItems();
      }, [inventory]);
      
      useEffect(() => {
        if (router.query.vhash) {
          setVhash(router.query.vhash as string)

        }
      }, [router.query]);
      
  
      useEffect(() => {
        const fetchItems = async () => {
          try {
            if (inventory2.length > 0) { // Certifique-se de que há um item no array
              const userId = inventory2[0].userId;
              const response = await axios.get(`/api/autentic/my.tvl?userId=${userId}`);
              
              if (response.data.success) {
              
                setItems2x(response.data.mytvls);
               
              } else {
                setError(response.data.message || 'Erro ao carregar itens');
              }
            } else {
              setError('Inventário vazio');
            }
          } catch (error) {
            setError('Erro ao buscar itens do servidor');
          } finally {
            setLoading(false);
          }
        };
      
        fetchItems();
      }, [inventory2]);
      
      const formattedDate = user?.firstLoginDate
      ? format(new Date(user.firstLoginDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : "Data não disponível";

      const totalItemsInventory1 = Object.keys(activeItems).length;
      const totalItemsInventory2 = Object.keys(activeItemsx).length;
      
      // Cada item vale 2 pontos, então multiplicamos por 2
      const quantitytoken = (totalItemsInventory1 + totalItemsInventory2) * 2;
     
      const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
      
        const payload = {
          quantitytoken,
          startedtrade: true,
          itemId1,
          itemId2,
          vhash,
        };
      
        try {
          const params = new URLSearchParams();
          if (activeItems) params.append('itemId1', Object.keys(activeItems).join(','));
          if (activeItemsx) params.append('itemId2', Object.keys(activeItemsx).join(','));
      
          const res = await fetch(`/api/trivo/trade/search.vhash?${params.toString()}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            // Aqui capturamos a mensagem vinda do backend
            const errorMessage = data?.error || data?.message || "Erro desconhecido";
            message(errorMessage); // exibe a mensagem
            setfailureopen(true); // abre modal ou algo similar
            return; // encerra o fluxo aqui
          }
      
          setResponse(data); // resposta bem-sucedida
        } catch (error: any) {
          console.error("Erro inesperado:", error);
          message("Erro ao conectar com o servidor.");
          setResponse(error);
          setfailureopen(true);
        } finally {
          fetchInventory();
          setLoading(false);
        }
      };
      

 
   
      useEffect(() => {
        if (!trade) return;
      
        const tradeTimeUTC = new Date(trade.tradetime);
        const now = new Date();
      
        // Converte para horário do Brasil (UTC-3)
        const timezoneOffsetMs = 3 * 60 * 60 * 1000;
        const tradeTimeInBrazil = new Date(tradeTimeUTC.getTime() - timezoneOffsetMs);
        const nowInBrazil = new Date(now.getTime() - timezoneOffsetMs);
      
        const totalDuration = trade.totaltime; // já está em milissegundos
        const endTime = tradeTimeInBrazil.getTime();
        const startTime = endTime - totalDuration;
      
        const updateTimer = () => {
          const current = new Date().getTime() - timezoneOffsetMs;
          const timeLeft = endTime - current;
      
          if (timeLeft <= 0) {
            setTimeRemaining({ minutes: 0, seconds: 0, days: 0 });
            setTimerProgress(283);
            setbitton(true);
            setactivet(true)
            return;
          }
          
          const minutes = Math.floor(timeLeft / 1000 / 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);
      
          const elapsed = current - startTime;
          const progress = Math.min((elapsed / totalDuration) * 283, 283);
          const days = Math.floor(trade.totaltime / 1000 / 60);  ;

          setTimeRemaining({ minutes, seconds, days});
          setTimerProgress(progress);
        };
      
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
      }, [trade]);
       


    
      

      const handleclosemenu = async () => {
        try {
          setShowItems(false);
          setShowSecurity(false);
          setpage(0);
          await fetchInventory();
          setInventory('');
          setInventory2('');
          setItems2([]);
          setItems2x([]);
          setactivet(false);
          setItemId1('');
          setItemId2('');
          setVhash('');
          setResponse({});
          setActiveItems({});
          setActiveItemsx({});
          
        } catch (error) {
          console.error('Erro ao fechar menu:', error);
        } 
      };
      
    return(
        <div className="relative  w-full">
         
  {!inventory && 
          <>
           <WrappVc>
        <CardSelectUser>
          <h3>Adicione o V-hash do usuário com quem deseja negociar.</h3>

         <div className="flex-col flex">
         <label>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M18 13c-.94 0-1.81.33-2.5.88A3.97 3.97 0 0 0 14 17c0 .75.21 1.46.58 2.06A3.97 3.97 0 0 0 18 21c1.01 0 1.93-.37 2.63-1 .31-.26.58-.58.79-.94.37-.6.58-1.31.58-2.06 0-2.21-1.79-4-4-4Zm2.07 3.57-2.13 1.97c-.14.13-.33.2-.51.2-.19 0-.38-.07-.53-.22l-.99-.99a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l.48.48 1.6-1.48c.3-.28.78-.26 1.06.04s.26.77-.04 1.06Z" fill="#626e67"></path><path opacity=".4" d="M21.09 21.5c0 .28-.22.5-.5.5H3.41c-.28 0-.5-.22-.5-.5 0-4.14 4.08-7.5 9.09-7.5 1.03 0 2.03.14 2.95.41-.59.7-.95 1.61-.95 2.59 0 .75.21 1.46.58 2.06.2.34.46.65.76.91.7.64 1.63 1.03 2.66 1.03 1.12 0 2.13-.46 2.85-1.2.16.54.24 1.11.24 1.7Z" fill="#626e67"></path><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" fill="#626e67"></path></svg>
        <InputList
        type="text"
        name="name"
        placeholder="V-Hash do destinatario"
        autoComplete="off"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}/>
          
       </label>
       {error && <p className="text-red-500 text-center text-[11px] font-['InterSemiBold']">{error}</p>}
      
       </div>
     
       <TradeButton onClick={handleConfirm} disabled={!value}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" data-sentry-element="ExchangeFundsIcon" data-sentry-component="getPaymentButtonLeftComponent" data-sentry-source-file="ExchangerSummarySubmitButton.tsx"><path fill="currentColor" d="M19.379 15.106A8.001 8.001 0 0 0 8.035 5.056l-.993-1.737a10 10 0 0 1 9.962.023c4.49 2.593 6.21 8.143 4.118 12.77l1.342.775-4.166 2.214-.165-4.714zM4.629 8.9a8.001 8.001 0 0 0 11.345 10.05l.992 1.737a10 10 0 0 1-9.962-.024c-4.49-2.593-6.21-8.142-4.117-12.77L1.545 7.12 5.71 4.905l.165 4.714zm8.79 5.931-2.829-2.828-2.828 2.828-1.415-1.414 4.243-4.243 2.828 2.829 2.829-2.829 1.414 1.415z"></path></svg>
          {loading ? <span>Procurando...</span> : <span>Confirmar o v-hash</span>}
        </TradeButton>
       </CardSelectUser>
        </WrappVc>

          </>
      }


   <Containerxv>
      
     
      <SkinTradingInterface 
      islocked={islock}
      trade2={
        <>

{!loading && items2.filter((item: any) => activeItems[item.tokenID]).length === 0 && (
  <> <svg width="200" height="80" viewBox="0 0 300 100">
  <path d="M20,50 L60,50 L70,40 L240,40 L250,50 L270,50 L280,40 L290,50 L290,60 L280,70 L250,70 L240,60 L70,60 L60,70 L20,70 Z" fill="#333" />
</svg></>
)}


{!loading && items2.filter((item: any) => activeItems[item.tokenID]).length === 1 ? (
  <>
  {loading ? (
<LoadingPageView />
) : items2
.filter((item: any) => activeItems[item.tokenID]) // Filtra apenas os itens ativos
.map((item: any) => (
<div key={item.tokenID} data-testid="mini_skin">
<ItemImage src={item.imagem} height={240} width={240} />
</div>
))}
 
  </> ) : !loading && items2.filter((item: any) => activeItems[item.tokenID]).length > 1 && (
  <>    <Boxtrade data-testid="price_box">
                  
                 
  <Scrollmargin >
    <div className="gap-1 flex"> 
  {loading ? (
<LoadingPageView />
) : items2
.filter((item: any) => Boolean(activeItems[item.tokenID])) // Garante que o valor seja true
.map((item: any) => (
<ItemCardx key={item.tokenID} data-testid="mini_skin">
<ItemIcon>
<img src="/nvrp/logonvrp.png" className="ghb" alt="novision" width={60} height={60} />
</ItemIcon>
<ItemImage src={item.imagem} />
</ItemCardx>
))}

</div>
  </Scrollmargin>

 
</Boxtrade></>
)}


       
       
        </>
      } 
      trade1={
        <>
              {!loading && items2x.filter((item: any) => activeItemsx[item.tokenID]).length === 0 && (
  <> <svg width="200" height="80" viewBox="0 0 300 100">
  <path d="M20,50 L60,50 L70,40 L240,40 L250,50 L270,50 L280,40 L290,50 L290,60 L280,70 L250,70 L240,60 L70,60 L60,70 L20,70 Z" fill="#333" />
</svg></>
)}


{!loading && items2x.filter((item: any) => activeItemsx[item.tokenID]).length === 1 ? (
  <>
  {loading ? (
<LoadingPageView />
) : items2x
.filter((item: any) => activeItemsx[item.tokenID]) // Filtra apenas os itens ativos
.map((item: any) => (
<div key={item.tokenID} data-testid="mini_skin">
<ItemImage src={item.imagem} height={240} width={240} />
</div>
))}
 
  </> ) : !loading && items2x.filter((item: any) => activeItemsx[item.tokenID]).length > 1 && (
  <> <Boxtrade data-testid="price_box">
                  
     
            
  <Scrollmargin>
  <div className="gap-1 flex"> 
  {loading ? (
<LoadingPageView />
) : items2x
.filter((item: any) => activeItemsx[item.tokenID]) // Filtra apenas os itens ativos
.map((item: any) => (
<ItemCardx key={item.tokenID} data-testid="mini_skin">
<ItemIcon>
<img src="/nvrp/logonvrp.png" className="ghb" alt="novision" width={60} height={60} />
</ItemIcon>
<ItemImage src={item.imagem} />
</ItemCardx>
))}


</div>


  </Scrollmargin>
 
</Boxtrade></>
)}

          
        </>
      }
      click={() => setpage(1)} />
      
  
      {page == 1 && (
          <div className="wjjc">
           <FlexColumn>
          <Grow>
            <PaymentExchangerModal data-testid="payment_exchanger_modal_method_proposed">

        {istradeSuccess ? (
   <CardConfirmedpay>
 
   <main className="cd__main">
   
      <div className="main-container">
         <div className="check-container">
            <div className="check-background">
             
               <svg viewBox="0 0 65 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 25L27.3077 44L58.5 7" stroke="white" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
               </svg>
            </div>
            <div className="check-shadow"></div>
         </div>
      </div>
      <p>
        Negociação feita com sucesso!<br /> <br /> Você pode acompanhar o status da troca em <Link href={ROUTENVX.orders}>account {'->'} orders</Link>.
   </p>
   </main>

     </CardConfirmedpay>
   )  : istradeFailure || isfailureopen ? (
   <CardFailurepay>
 
   <main className="cd__main">
   
      <div className="main-container">
         <div className="check-container">
            <div className="check-background">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="3"  stroke-linecap="round"  strokeLinejoin="round"/>
</svg>
            </div>
            <div className="check-shadow"></div>
         </div>
      </div>
      <p>
        {ismessage ? ismessage : (
          <>
           Negociação falhou!<br /> <br /> Você pode acompanhar o status da troca em <Link href={ROUTENVX.orders}>account {'->'} orders</Link>.
          </>
        )}
        
      </p>
   </main>
     </CardFailurepay>
   ) : (
    <>
    {trade?.status === 'completed' ? (
 <ConfirmationText>Negociação feita com sucesso</ConfirmationText>
    
    ) : (
       <ConfirmationText>Aguarde a negociação ser aceita</ConfirmationText>
    
    )}
    
     
    {trade?.status === 'pendente' && trade?.tradetime && (
            <AwaitingTimeContainer data-testid="awaiting_time">
              <AwaitingTimeContent>
                <AwaitingTimeTitle>Aguardando confirmação...</AwaitingTimeTitle>
                <AwaitingTimeDescription>
                  Aguarde por <HighlightedText>{(trade?.totaltime ?? 0) >= 60 * 60 * 1000
  ? `${Math.floor((trade?.totaltime ?? 0) / 1000 / 60 / 60)} horas`
  : `${Math.floor((trade?.totaltime ?? 0) / 1000 / 60)} minutos`}
</HighlightedText> para que o trade seja confirmado.
                  <br />
                  Após este intervalo de tempo, a oferta de troca será cancelada.
                </AwaitingTimeDescription>
              </AwaitingTimeContent>
    
              <TimerContainer>
                <Timer data-testid="timer">
                  <CircleSvg viewBox="0 0 100 100">
                    <BackgroundCircle cx="50" cy="50" r="45" />
                    <ProgressCircle
                      cx="50"
                      cy="50"
                      r="45"
                      transform="rotate(-90 50 50)"
                      progress={timerProgress}
                    />
                  </CircleSvg>
                  <TimerDisplay>
                  <TimerDisplay>
   
                  {timeRemaining.days > 60 ? (
  <span className="absolute left-6 top-[-12px] bottom-0">{Math.floor(timeRemaining.days / 60)}h</span>
) : ( 
  <>
    <TimerMinutes>{timeRemaining.minutes.toString().padStart(2, "0")}</TimerMinutes>
    <TimerSeparator>:</TimerSeparator>
    <TimerSeconds>{timeRemaining.seconds.toString().padStart(2, "0")}</TimerSeconds>
  </>
)}

</TimerDisplay>

                  </TimerDisplay>
                </Timer>
              </TimerContainer>
            </AwaitingTimeContainer>
          )}
      
                  <div>
                    <OrderInfoHeader>
                      <OrderIdText>
                        {response?.vid ? (
                        <> Ordem de troca - {response.vid}</>
                        ) : (
                          <>
                          Envie a solicitação de troca!
                          </>
                        )}
                       
                      </OrderIdText>
                    </OrderInfoHeader>
      
                    <UserInfoContainer>
                      <UserInfoWrapper>
                        <UserProfile>
                          <UserAvatarLink>
                            <UserAvatar src={user.avatar} alt="" referrerPolicy="no-referrer" />
                          </UserAvatarLink>
      
                          <UserInfoDetails>
                            <Username>{user.username}{user.subdominio ? user.subdominio : ''}</Username>
                            <UserMetaInfo>
                              <SteamLevel>Nível Clubr {user.level} - momentum o {user.momentum}</SteamLevel>
                              <RegistrationDate>Data de registro: {formattedDate}</RegistrationDate>
                            </UserMetaInfo>
                          </UserInfoDetails>
                        </UserProfile>
      
                        
                        {trade?.status? (
                         <SteamButton
                        
                          >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"  viewBox="0 0 24 24" fill="none" stroke="#6a716d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
                            <h3>{trade.status  === 'pendente' && 'Esperando'} {trade.status  === 'refused' && 'Rejeitado'} {trade.status  === 'expired' && 'Expirado'} {trade.status  === 'canceled' && 'Cancelado'} {trade.status  === 'completed' && 'Troca feita'}   {trade.status  === 'failed' && 'Falhou'}</h3>
                          </SteamButton> )  : (
                           <SteamButton
                        
                          >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <path d="M12 3v6"/><circle cx="12" cy="12" r="3"/><path d="M12 15v6"/></svg>
                          </SteamButton> 
                          )}
                    
                      </UserInfoWrapper>
      
                      <TransactionInfo data-testid="transaction_info">
                      
    
                     
      
    
    {!loading && items2.filter((item: any) => activeItems[item.tokenID]).length > 0 && (
      <> 
      
      <ToggleButton onClick={() => setShowItems(!showItems)}>
                          <span>O QUE IRÁ RECEBER</span>
                          <ToggleIcon viewBox="0 0 10 6" fill="none" isOpen={showItems}>
                            <path d="M1 1L5 5L9 1" stroke="currentColor" />
                          </ToggleIcon>
                        </ToggleButton>
      
                        <ItemsContainer isOpen={showItems}>
                          <ItemsWrapper>
    
      <Boxtrade data-testid="price_box">
                      
         
                
      <Scrollmargin>
      <div className="gap-1 flex"> 
      {loading ? (
    <LoadingPageView />
    ) : items2
    .filter((item: any) => activeItems[item.tokenID]) // Filtra apenas os itens ativos
    .map((item: any) => (
    <ItemCard key={item.tokenID} data-testid="mini_skin">
    <ItemIcon>
    <img src="/nvrp/logonvrp.png" className="ghb" alt="novision" width={60} height={60} />
    </ItemIcon>
    <ItemImage src={item.imagem} />
    </ItemCard>
    ))}
    
    
    </div>
    
    
    </Scrollmargin>
    </Boxtrade>
    
    
    <GradientOverlay position="left" isVisible={false} />
     <GradientOverlay position="right" isVisible={true} />
                           
                          </ItemsWrapper>
                        </ItemsContainer>
                        
                        
       </>
       )}   
      
                        
    
    
    {!loading && items2x.filter((item: any) => activeItemsx[item.tokenID]).length > 0 && (
      <> 
      
      <SecurityToggleButton onClick={() => setShowSecurity(!showSecurity)}>
                          <span>OS MEUS ITENS A SER TROCADOS</span>
                          <ToggleIcon viewBox="0 0 10 6" fill="none" isOpen={showSecurity}>
                            <path d="M1 1L5 5L9 1" stroke="currentColor" />
                          </ToggleIcon>
                        </SecurityToggleButton>
    
                        <ItemsContainer isOpen={showSecurity}>
                          <ItemsWrapper>
    
                     
      
            <ItemsScroll>
               
    
      <Boxtrade data-testid="price_box">
                      
         
                
      <Scrollmargin>
      <div className="gap-1 flex"> 
      {loading ? (
    <LoadingPageView />
    ) : items2x
    .filter((item: any) => activeItemsx[item.tokenID]) // Filtra apenas os itens ativos
    .map((item: any) => (
    <ItemCard key={item.tokenID} data-testid="mini_skin">
    <ItemIcon>
    <img src="/nvrp/logonvrp.png" className="ghb" alt="novision" width={60} height={60} />
    </ItemIcon>
    <ItemImage src={item.imagem} />
    </ItemCard>
    ))}
    
    
    </div>
    
    
    </Scrollmargin>
    </Boxtrade>
    
    <GradientOverlay position="left" isVisible={false} />
                              <GradientOverlay position="right" isVisible={true} />
                            </ItemsScroll>
                          </ItemsWrapper>
                        </ItemsContainer>
       </>)}  
                            
                       
                      
     
    
                      </TransactionInfo>
                    </UserInfoContainer>
                  </div>
    </>
   )}

 
            </PaymentExchangerModal>
          </Grow>
  
          <FooterContainer>
            <FooterContent data-testid="payment_exchanger_modal_footer">
              <FooterRow>
                <RewardsContainer>
                  <RewardsLabel>
                    <RewardsLabelText>CHAVES DE TROCAS </RewardsLabelText>
                    <div></div>
                  </RewardsLabel>
  
                  <div>
                    <PriceBox data-testid="price_box">
                     
                      <CoinsContainer>
                        <EventCoinsContainer className="flex items-center gap-1">
                          <CoinIcon
                            src="/icons/market/sadasjdub.webp"
                            alt=""
                          />
                           
                             
                              <ul className="flex items-center ">
                              <span data-testid="animated-number" className="text-[15px] text-[#FF5E5E]">
                                -{quantitytoken} 
                              </span>

                              <span className="text-[15px] text-[#8a8e8e]"> /{trade.vtoken}</span>
                              </ul>
                           
                        </EventCoinsContainer>
                      </CoinsContainer>
                    </PriceBox>
                  </div>
                </RewardsContainer>
  
                <ButtonContainer>
                  <ConfirmButton onClick={handleSubmit} disabled={islock || response?.success} className="bg-[#a9acaa]" >  {response?.success ? 'Solicitação Enviada' : loading ? "Enviando..." : "Enviar solicitação"} </ConfirmButton>
                </ButtonContainer>
      
              </FooterRow>
              
              <ButtonContainer>
                 
                 {isbutton && (
                      <ConfirmButton className="bg-[#9e3c3c]" onClick={handleclosemenu}>Fechar</ConfirmButton>
                 )}
               
                </ButtonContainer>
            </FooterContent>
          </FooterContainer>
        </FlexColumn>
          </div>
      )}
  
  
      </Containerxv>



        <Container>
          <Margix>
            <Card>
            <MarketplaceHeader 
          itemCount={0} 
          totalPrice={0} 
          label="OS SEUS ITENS" 
        />

         <div className="flex p-1 flex-wrap  gap-1">

         {loading ? (
  <LoadingPageView />
) : [...items2x]
    .filter((item: any) => !item.sold) // Filtra os itens não vendidos
    .map((item: any) => (
      <CardItemView 
        key={item.id} 
        Item={item} 
        click={() => handleItemClick2(item.tokenID)} 
        isActive={!!activeItemsx[item.tokenID]} 
      />
    ))}

         </div>

            </Card>

            {/* <Cardx>
           
           
        
        <SideContainer>
         
          
          <FilterPanel 
            title="COLEÇÕES" 
            isOpen={openFilters.options}
            onToggle={() => toggleFilter('options')}
          >
            <div>
              <input type="checkbox" id="stacked" />
              <label htmlFor="stacked">STACKED VIEW</label>
            </div>
            <div>
              <input type="checkbox" id="stattrak" />
              <label htmlFor="stattrak">STATTRAK™</label>
            </div>
            <div>
              <input type="checkbox" id="adesivo" />
              <label htmlFor="adesivo">ITEM COM ADESIVO</label>
            </div>
            <div>
              <input type="checkbox" id="locked" />
              <label htmlFor="locked">TRADE LOCKED</label>
            </div>
          </FilterPanel>
          
          <FilterPanel 
            title="BLOQUEIO DE TROCA" 
            isOpen={openFilters.blockTrade}
            onToggle={() => toggleFilter('blockTrade')}
            type="colors"
          />
          
        
          <FilterPanel 
            title="TIPO" 
            isOpen={openFilters.type}
            onToggle={() => toggleFilter('type')}
          />
          
          <FilterPanel 
            title="QUALIDADE" 
            isOpen={openFilters.stickers}
            onToggle={() => toggleFilter('stickers')}
          />
           
          <FilterPanel 
            title="RARIDADE" 
            isOpen={openFilters.color}
            onToggle={() => toggleFilter('color')}
          />
        </SideContainer>
            </Cardx> */}



            <Card>
           
           {user && (
             <MarketplaceHeaderReceipt 
             itemCount={0} 
             totalPrice={0} 
           
             avatar={user.avatar}
             label={`${user.username}${user.subdominio ? user.subdominio : ''}`} 
           />
           )}

<div className="flex p-1 flex-wrap gap-1">

{loading ? (
  <LoadingPageView />
) : [...items2]
    .filter((item: any) => !item.sold) // Filtra os itens não vendidos
    .map((item: any) => (
      <CardItemView 
        key={item.id} 
        Item={item} 
        click={() => handleItemClick(item.tokenID)} 
        isActive={!!activeItems[item.tokenID]} 
      />
    ))}

 
 
</div>
            </Card>
          
          </Margix>
       
       
       
       </Container>

        </div>
    )
}



const WrappVc = styled.div`
  position: absolute;
 background: linear-gradient(to bottom, transparent, #171a19 28%);;
 width: 100%;
 border-radius: 12px;
 height: 100%;
 z-index: 88;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 display: flex;
   flex-direction: column;
   justify-content: center;
   place-items: center;
   align-items: center;
`;



const InputList = styled.input`
  
  background-color: transparent;
  width: 100%;
  height: 2.2em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 0.9em 1em 0.9em;
 
  font-family: 'ldvision', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'ldvision', sans-serif;
     color: #9c9ca7;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #9e9ea0 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0; /* Remove margem padrão */
}

/* Para ocultar o botão em navegadores Firefox */
input[type="number"] {
  -moz-appearance: textfield; /* Remove os botões */
}
`;




const TradeButton = styled.button`
  background-color: #2d3231;
  border: none;
  border-radius: 28px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0 20px;
  height: 42px;
 
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  font-size: 11px;
  text-transform: uppercase;
  font-family: 'Europa Grotesk', monospace;
  font-weight: 600;
  letter-spacing: 0.5px;
 transition: 1s all;

  svg{
    height: 19px;
    width: 19px;
  }

  &:hover{
    background-color: #191a1a;
    color: #606764;
  }

   
`;
const CardSelectUser = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    
  
   h3{
    font-size: 14px;
    font-family: 'Europa Grotesk', monospace;
    max-width: 350px;
    text-align: center;
    color: #9293a0;
    
   }

   button:disabled {
    border: 1px solid #313133; 
    background-color: rgba(129, 33, 33, 0.165);
    color: #8A93B2; 
    cursor: not-allowed;
  }

   label{
    margin: 1em;
    background-color: rgb(29, 31, 30);
  width: 100%;
  height: 3em;
  padding: 0.6em 1em 0.6em;
  border-radius: 14px;
  font-size: 16px;
  color: #9293a0;
  border: 2px solid #262629;
  box-shadow: 1px 1px 52px  rgba(216, 220, 217, 0.086);
  font-family: 'Poppins', Courier, monospace;
 
  margin-left: 0;

    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;


    i{
        color: #262629;
        font-size: 20px;
    }
  }



`;

const Container = styled.div`
 width: 100%;
 padding: 0.3em;
 display: flex; 
 flex-direction: column;
 overflow: hidden;

 &::-webkit-scrollbar {
display: none;

}

&::selection{
display: none;
}
`;


const Margix = styled.div`
  display: flex;
 flex-direction: row;
 align-items: top; 
 justify-content: space-evenly;
`;


const Card = styled.div`
   width: 50vw;
  padding: 1em;
  height: 90vh;
  overflow-y: auto;
  background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  border-radius: 12px;
`;

const Cardx = styled.div`
 width: 30vw;
 height: 90vh;
 overflow-y: auto;
  
 
`;

const SideContainer = styled.div`
  padding: 15px;
`;


///////////////////////////////////////////////////



// Main container
const Containerxv = styled.div`
  height: 100%;
  width: 100%;


  .wjjc{
    position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
 
  z-index: 9928;
  height: 100vh;
  padding: 1em;
  background-color: rgba(0, 0, 0, 0.353);
  width: 100vw;
  }

  
 &::-webkit-scrollbar {
display: none;

}

&::selection{
display: none;
}
`

const FlexColumn = styled.div`
  display: flex;
 
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  right: 1px;
  top: 0;
 
  bottom: 1;
  max-width: 540px;
  height: 96vh;
  margin: 0.9em;
  margin-right: 0;
  padding: 1em;
  border-radius: 12px 0 0 12px;
  min-width: 450px;
  
  border-right: none;
  overflow-y: auto;
  background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
   
  animation: Opjbc 0.5s linear ;

  @keyframes Opjbc {
    0%{ transform: translateX(100%); opacity: 0 };
    100%{ transform: translateX(0%); opacity: 1 }
  }


  ::-webkit-scrollbar {
display: none;

}

::selection{
display: none;
}
`

const Grow = styled.div`
  flex-grow: 1;
`

// Payment exchanger modal
const PaymentExchangerModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const ConfirmationText = styled.p`
  text-align: center;
  font-size: 15px;
  font-family: 'Europa Grotesk';
  text-transform: uppercase;
  font-weight: 300;
  color: rgb(147, 150, 156);
  
 
`

const CardConfirmedpay = styled.div`
 .cd__main{
  background: linear-gradient(204deg, #15f05e40 -7%, #b85cff00 33%), linear-gradient(162deg, #18f53d40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 12px;
   padding: 20px;
   flex-direction: row;
   flex-wrap: wrap;
   justify-content: center;

   
   p{
    font-family: 'InterSemiBold', monospace;
    color: #d7d9e0;
    font-size: 14px;
    text-align: center;
    max-width: 90%;
   }

 }
 .cd__main{
     display: flex;
     width: 100%;
 }

 @media only screen and (min-width: 1360px){
     .cd__main{
       max-width: 1280px;
       margin-left: auto;
       margin-right: auto; 
       padding: 24px;
     }
 }

.main-container {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.check-container {
  width: 6.25rem;
  height: 7.5rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
}

a{
  color: #3171d2;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  font-family: 'InterSemiBold', monospace;
  transition: all 0.3s ease-in-out;
 }

.check-container .check-background {
  width: 100%;
  height: calc(100% - 1.25rem);
  background: linear-gradient(to bottom right, #5de593, #41d67c);
  box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  transform: scale(0.84);
  border-radius: 50%;
  animation: animateContainer 0.75s ease-out forwards 0.75s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.check-container .check-background svg {
  width: 65%;
  transform: translateY(0.25rem);
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: animateCheck 0.35s forwards 1.25s ease-out;
}
.check-container .check-shadow {
  bottom: calc(-15% - 5px);
  left: 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, #49da83, transparent);
  animation: animateShadow 0.75s ease-out forwards 0.75s;
}

@keyframes animateContainer {
  0% {
    opacity: 0;
    transform: scale(0);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  25% {
    opacity: 1;
    transform: scale(0.9);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  43.75% {
    transform: scale(1.15);
    box-shadow: 0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  62.5% {
    transform: scale(1);
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 21.667px rgba(255, 255, 255, 0.25) inset;
  }
  81.25% {
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
  100% {
    opacity: 1;
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
}
@keyframes animateCheck {
  from {
    stroke-dashoffset: 80;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes animateShadow {
  0% {
    opacity: 0;
    width: 100%;
    height: 15%;
  }
  25% {
    opacity: 0.25;
  }
  43.75% {
    width: 40%;
    height: 7%;
    opacity: 0.35;
  }
  100% {
    width: 85%;
    height: 15%;
    opacity: 0.25;
  }
}

`;

const CardFailurepay = styled.div`
  width: 440px;
   
.cd__main{
  background: linear-gradient(204deg, #ff5c6440 -7%, #b85cff00 33%), linear-gradient(162deg, #e7234e40 -10%, #2c88dd00 25%), linear-gradient(0deg, rgba(84, 84, 92, 0.048), rgba(84, 84, 92, 0.048));
  border-radius: 12px;
   padding: 20px;
   flex-direction: row;
   flex-wrap: wrap;
   align-items: center;
   justify-content: center;
   
   p{
    font-family: 'InterSemiBold', monospace;
    color: #d7d9e0;
    font-size: 15px;
    text-align: center;
    max-width: 90%;
   }
 }
 .cd__main{
     display: flex;
     width: 100%;
 }

 a{
  color: #3171d2;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  font-family: 'InterSemiBold', monospace;
  transition: all 0.3s ease-in-out;
 }

 @media only screen and (min-width: 1360px){
     .cd__main{
       max-width: 1280px;
       margin-left: auto;
       margin-right: auto; 
       padding: 24px;
     }
 }

.main-container {
  width: 100%;
  height: 70vh;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.check-container {
  width: 6.25rem;
  height: 7.5rem;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-between;
}
.check-container .check-background {
  width: 100%;
  height: calc(100% - 1.25rem);
  background: linear-gradient(to bottom right, #e42626, #d64141);
  box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  transform: scale(0.84);
  border-radius: 50%;
  animation: animateContainer 0.75s ease-out forwards 0.75s;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}
.check-container .check-background svg {
  width: 65%;
  transform: translateY(0.25rem);
  stroke-dasharray: 80;
  stroke-dashoffset: 80;
  animation: animateCheck 0.35s forwards 1.25s ease-out;
}
.check-container .check-shadow {
  bottom: calc(-15% - 5px);
  left: 0;
  border-radius: 50%;
  background: radial-gradient(closest-side, #d82d3c, transparent);
  animation: animateShadow 0.75s ease-out forwards 0.75s;
}

@keyframes animateContainer {
  0% {
    opacity: 0;
    transform: scale(0);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  25% {
    opacity: 1;
    transform: scale(0.9);
    box-shadow: 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  43.75% {
    transform: scale(1.15);
    box-shadow: 0px 0px 0px 43.334px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 65px rgba(255, 255, 255, 0.25) inset;
  }
  62.5% {
    transform: scale(1);
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 21.667px rgba(255, 255, 255, 0.25) inset;
  }
  81.25% {
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
  100% {
    opacity: 1;
    box-shadow: 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset, 0px 0px 0px 0px rgba(255, 255, 255, 0.25) inset;
  }
}
@keyframes animateCheck {
  from {
    stroke-dashoffset: 80;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes animateShadow {
  0% {
    opacity: 0;
    width: 100%;
    height: 15%;
  }
  25% {
    opacity: 0.25;
  }
  43.75% {
    width: 40%;
    height: 7%;
    opacity: 0.35;
  }
  100% {
    width: 85%;
    height: 15%;
    opacity: 0.25;
  }
}


`;
// Awaiting time section
const AwaitingTimeContainer = styled.div`
  display: flex;
  
  overflow: hidden;
  border-radius: 0.5rem;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11); /* navy-800 */
 animation: Csc 0.5s linear;

  @keyframes Csc {
    0%{ transform: translateY(-20%); opacity: 0 };
    100%{ transform: translateY(0%); opacity: 1 }
  }

`

const AwaitingTimeContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  font-family: 'InterSemiBold', monospace;
  @media (min-width: 640px) {
    gap: 0.625rem;
    padding: 1.5rem;
  }
`

const AwaitingTimeTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #2bcd64; /* gold-500 */
  
  @media (min-width: 320px) {
    line-height: 2;
  }
`

const AwaitingTimeDescription = styled.p`
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1.25;
  color: #8A93B2; /* navy-300 */
`

const HighlightedText = styled.span`
  font-weight: 600;
  color: #2bcd64; /* gold-500 */
`

const TimerContainer = styled.div`
  display: grid;
  place-content: center;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11); /* navy-800 */
  padding: 1rem;
  
  @media (min-width: 640px) {
   background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11); /* navy-800 */
  }
`

const Timer = styled.div`
  position: relative;
  height: 5rem;
  width: 5rem;
`

const TimerDisplay = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  text-align: center;
  width: 100%;
  
  transform: translate(-50%, -50%);
  font-variant-numeric: lining-nums;
  color: #2bcd64; /* gold-500 */
`

const TimerMinutes = styled.p`
  flex: 1;
  text-align: right;
`

const TimerSeparator = styled.span`
  text-align: center;
`

const TimerSeconds = styled.p`
  flex: 1;
  text-align: left;
`

// Order info section
const OrderInfoHeader = styled.div`
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11); /* navy-800 */
  padding: 0.75rem 1rem;
`

const OrderIdText = styled.p`
  text-align: left;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.25;
  font-family: 'InterSemiBold', monospace;
  color: #8A93B2; 
`

const OrderIdValue = styled.span`
  font-weight: 400;
  color: white;
`

const UserInfoContainer = styled.div`
  padding: 0.75rem 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const UserInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
   width: 100%;
   position: relative;
   overflow: hidden;
  gap: 1rem;
  
`

const UserProfile = styled.div`
  display: flex;
  min-width: fit-content;
  flex: 1;
  align-items: center;
  
  @media (min-width: 640px) {
    align-items: flex-start;
  }
`

const UserAvatarLink = styled.div`
  min-width: fit-content;
`

const UserAvatar = styled.img`
  height: 5rem;
  width: 5rem;
  border: 1px solid #535557;
  border-radius: 0.555rem;
  object-fit: cover;
`

const UserInfoDetails = styled.div`
  margin-left: 0.5rem;
  display: flex;
  height: 100%;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
`

const Username = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  color: #2bcd64;  
  
   
`

const UserMetaInfo = styled.div`
   
   
`

const SteamLevel = styled.p`
  color: #e66b36;
  font-size: 9px;
  text-transform: uppercase;
  font-family: 'ProximaNova-Italic', sans-serif;
`

const RegistrationDate = styled.p`
  font-weight: 300;
  font-size: 11px;
  font-family: 'ProximaNova-Italic', sans-serif;
  color: #4b4c50;  
`

 

const SteamButton = styled.div`
  display: inline-flex;
  align-items: center;
  
  border-radius: 2.375rem;
  background-color: rgba(150, 149, 150, 0.1);  
  color: #ddd9d1;  
  position: absolute;
  right: 8px;
  top: 9px;
  font-weight: 500;
  gap: 2px;
  padding: 0.3em 0.5em 0.3em;
  transition: background-color 0.2s;
  

  h3{
    font-family: 'InterSemiBold', monospace;
    font-size: 11px;
  }
 
  &:hover {
    background-color: rgba(52, 240, 146, 0.2);
  }
`
 

// Transaction info section
const TransactionInfo = styled.div`
  height: 250px;
  color: #8A93B2; /* navy-300 */
  
  @media (min-width: 640px) {
    height: 195px;
  }
`

const ToggleButton = styled.button`
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11); /* navy-800 */
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 300;
  text-transform: uppercase;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`

const ToggleIcon = styled.svg<{ isOpen: boolean }>`
  height: 0.75rem;
  width: 0.75rem;
  transition: transform 0.2s;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
`

const ItemsContainer = styled.div<{ isOpen: boolean }>`
  overflow: hidden;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  height: ${(props) => (props.isOpen ? "auto" : "0")};
  transition: opacity 0.3s, height 0.3s;
`

const ItemsWrapper = styled.div`
  position: relative;
`

const ItemsScroll = styled.div`
  overflow-x: auto;
  display: flex;
  width: 100%;
  gap: 0.5rem;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
`
const ItemCardx = styled.div`
position: relative;
z-index: 10;
overflow: hidden;
aspect-ratio: 1;
height: 7.25rem;
border-radius: 0.5rem;
background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #1f2120, #1f2120); /* navy-800 */
background-image: linear-gradient(to bottom, #2b2c2c40, #222a28);
padding: 0.25rem;
border: 2px solid #39c78b;
box-shadow: 1px 1px 52px  rgba(85, 164, 105, 0.086);
animation: CardView 0.2s linear;

@keyframes CardView {
  0%{ transform: translateY(100%); opacity: 0 };
  100%{ transform: translateY(0%); opacity: 1 }
}

`

const ItemCard = styled.div`
  position: relative;
  z-index: 10;
  overflow: hidden;
  aspect-ratio: 1;
  height: 6.25rem;
  border-radius: 0.5rem;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #1f2120, #1f2120); /* navy-800 */
  background-image: linear-gradient(to bottom, #2b2c2c40, #222a28);
  padding: 0.25rem;
  border: 2px solid #1f2120;
`

const ItemIcon = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
   
  transform: translate(-50%, -50%);

  img{
    opacity: 0.1;
    height: 85px;
    width: 85px;
   
  }
   
`

const ItemImage = styled.img`
  position: relative;
  aspect-ratio: 1;
`

const GradientOverlay = styled.div<{ position: "left" | "right"; isVisible: boolean }>`
  pointer-events: none;
  position: absolute;
  ${(props) => props.position}: 0;
  top: 0;
  z-index: 10;
  height: 100%;
  width: 5rem;
  background-image: linear-gradient(to ${(props) => (props.position === "left" ? "left" : "right")}, transparent, rgba(0, 0, 0, 0.6));
  transition: opacity 0.2s;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
`

const SecurityToggleButton = styled.button`
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11); /* navy-800 */
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  font-weight: 300;
  text-transform: uppercase;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #232838;
  }
`

// Footer section
const FooterContainer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 20;
`

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 0.5rem;
 background: linear-gradient(204deg, #2b2c2c40  -7%, #b85cff00 33%), linear-gradient(162deg, #2122229f -10%, #2224229f 25%), linear-gradient(0deg, #0e0e11, #0e0e11);  
  padding: 1.5rem;
`

const FooterRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
  
  @media (min-width: 640px) {
    flex-direction: row;
  }
`
const FooterRowtrade = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  
  
`

const RewardsContainer = styled.div`
  width: 100%;
`

const RewardsLabel = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  gap: 0.5rem;
`

const RewardsLabelText = styled.p`
  display: flex;
  align-items: center;
  font-size: 0.6rem;
  font-family: 'Europa Grotesk';
  text-transform: uppercase;
  color: #8A93B2;  
`
const Boxtrade = styled.div`
  display: flex;
  
  width: 100%;
  max-width:580px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
 
  padding: 0 0.75rem;


  
`

const PriceBox = styled.div`
  display: flex;
  height: 2.75rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background-color: #212222;
  padding: 0 0.75rem;
`

 

const CoinsContainer = styled.div`
  margin-left: 0.375rem;
  display: flex;
  gap: 9px;
  align-items: center;
`

const EventCoinsContainer = styled.div`
  display: flex;
  width: 50%;
  align-items: center;
  
`

const CoinIcon = styled.img`
  margin-right: 0.25rem;
  height: 1.3rem;
  width: 1.3rem;
  flex-shrink: 0;
 
`

const CoinValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`



const ButtonContainer = styled.div`
  width: 100%;
  
`

const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4.875rem;
  color: #181a1a;  
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  width: 100%;
  transition: background-color 0.2s;
  font-family: 'InterSemiBold', monospace;
  font-size: 13px;
  
  &:hover:not(:disabled) {
    background-color: #323635dd;
  }
  
  &:disabled {
    border: 1px solid #202021; 
    background-color: rgba(129, 33, 33, 0.165);
    color: #8A93B2; /* navy-300 */
    cursor: not-allowed;
  }
`

// SVG Circle for the timer
const CircleSvg = styled.svg`
  height: 100%;
  width: 100%;
`

const BackgroundCircle = styled.circle`
  stroke: #2E3244;
  fill: none;
  stroke-width: 10;
`

const ProgressCircle = styled.circle<{ progress: number }>`
  stroke: #2bcd64; /* gold-500 */
  fill: none;
  stroke-width: 10;
  stroke-dasharray: 283;
  stroke-dashoffset: ${(props) => props.progress};
  transition: stroke-dashoffset 0.3s ease-in-out;
`