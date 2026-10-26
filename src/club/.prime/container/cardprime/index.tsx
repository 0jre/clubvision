import styled from "styled-components";
import InfoRecurso from '../prime/components/rec.p';
import CardPrimeInfo from '../prime/components/card.prime';
import { useRouter } from "next/router";
import NVXROUTE from '@/routes/routes';

export default function Cardprime () {
  const router = useRouter();
    return(
        <>
        <Inlineflex>

 
      

  <CardPrimeInfo 
    descriptionbottom={'*Alcançe o nível 22 e tenha acesso a novos recursos exclusivo de privilégios!'}
  Title={'One'} 
  MsButton={
    <>
           <li className="xcnjd">
           <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock c" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bec7d3" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
  <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
  <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
</svg>
           </li>
      
   
    </>
  }
  ImageProp={"/web/pack-basic.jfif"}
  Description={'LEVEL VIP'} 
  children={
    <>
   <InfoRecurso 
    Recurso={'Entrega instantânea de transporte'} 
    />

<InfoRecurso 
    Recurso={'Montagem instantânea de armas'} 
    />

<InfoRecurso 
    Recurso={'Sair da org/clã por conta própria'} 
    />


<InfoRecurso 
    Recurso={'Adquira até 12 casas'} 
    />


<InfoRecurso 
    Recurso={'Adquira até 28 veiculos'} 
    />

<InfoRecurso 
    Recurso={'Tratamento hospitalar acelerado'} 
    />


<InfoRecurso 
    Recurso={'Redução do tempo na prisão'} 
    />


<InfoRecurso 
    Recurso={'Vision Store +'} 
    />

 
<InfoRecurso 
    Recurso={'Prioridade na Fila: 50'} 
    />

<InfoRecurso 
    Recurso={'Experiência em dobro'} 
    />
 
 <InfoRecurso 
    Recurso={'Remover 1 aviso uma vez por mês'} 
    />
 
 <InfoRecurso 
    Recurso={'CEO/VIP business'} 
    />

  <InfoRecurso 
    Recurso={'40% Desconto no estacionamento'} 
    />

  <InfoRecurso 
    Recurso={'28% Desconto no IPTU'} 
    />

   <InfoRecurso 
    Recurso={'28% Desconto no IPVA'} 
    />
    </>
  }/>

<CardPrimeInfo 
          descriptionbottom={'*Assine o prime. Torne sua conta Premium e obtenha todos esses recursos desbloqueados em sua conta!'}
  Title={'Premium'} 
  MsButton={
    <li className="xcnjd">
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock-open" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
  <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M8 11v-5a4 4 0 0 1 8 0" />
</svg>
 
    </li>
  }
  ImageProp={"/web/pack-prime.jfif"}
  Description={'SUBSCRIPTION'} 
  children={
    <>
    <InfoRecurso 
    Recurso={'Clubvision +'}  />

      <InfoRecurso 
    Recurso={'Vision Store Free'} 
    />

      <InfoRecurso 
    Recurso={'Isecurity'} 
    />

      <InfoRecurso 
    Recurso={'50% menos fome e sede'} 
    />


      <InfoRecurso 
    Recurso={'8% Desconto no IPTU'} 
    />

     <InfoRecurso 
    Recurso={'8% Desconto no IPVA'} 
    />

     <InfoRecurso 
    Recurso={'3x XP em missões'}  
    />


   <InfoRecurso 
    Recurso={'Prioridade nos tickets'} 
    />

      <InfoRecurso 
    Recurso={'Conta Verificada'} 
    />

      <InfoRecurso 
    Recurso={'Prioridade na Fila: 30'} 
    />

     <InfoRecurso 
    Recurso={'Acesso a cabelos exclusivos'} 
    />

    <InfoRecurso 
    Recurso={'Acesso a tatuagens exclusivas'} 
    />
   
   <InfoRecurso 
    Recurso={'Acesso a roupas exclusivas'} 
    />

   <InfoRecurso 
    Recurso={'Adquira até 4 veiculos'} 
    />

    <InfoRecurso 
    Recurso={'Adquira até 2 casas'} 
    />
 
    </>
  }/>

<CardPrimeInfo 
           descriptionbottom={'*Alcançe o nível 100 e tenha acesso a novos recursos exclusivo de privilégios!'}
            Title={'Win'}
            MsButton={
              <>
                     <li className="xcnjd">
                     <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-lock locks" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#bec7d3" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
            <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
            <path d="M8 11v-4a4 4 0 1 1 8 0v4" />

            {/* <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M5 11m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
  <path d="M12 16m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M8 11v-5a4 4 0 0 1 8 0" /> */}
          </svg>

        
                     </li>
                
             
              </>
            }
            Description={'LEVEL VIP'}
            ImageProp={"/web/pack-gold.jfif"}
            children={<>
    
 <InfoRecurso 
    Recurso={'Remover todos os avisos'} 
    />

<InfoRecurso 
    Recurso={'Sem cobranças de impostos '} 
    />

<InfoRecurso 
    Recurso={'65% menos fome e sede '} 
    />


<InfoRecurso 
    Recurso={'Vision Store Magnata'} 
    />

<InfoRecurso 
    Recurso={'Prioridade na Fila: 100'} 
    />

 
<InfoRecurso 
    Recurso={'Não perde itens na água'} 
    />
 
<InfoRecurso 
    Recurso={'Redução maxima na prisão '} 
    />
 
 
<InfoRecurso 
    Recurso={'Leadership em missões '} 
    />


<InfoRecurso 
    Recurso={'Adquira infinitas casas'} 
    />


<InfoRecurso 
    Recurso={'Adquira infinitos veiculos'} 
    />


<InfoRecurso 
    Recurso={'Benefícios Especiais nas Empresas'} 
    />

<InfoRecurso 
    Recurso={'Benefícios Específicos de Eventos'} 
    />

<InfoRecurso 
    Recurso={'Propriedades e Veículos Grátis'} 
    />

  <InfoRecurso 
    Recurso={'Socio majoritario business'} 
    />
 
 <InfoRecurso 
    Recurso={'Bônus Exclusivos '} 
    />
 
            </>} />


            
</Inlineflex>
        
        </>
    )
}






const Inlineflex = styled.div`
 display:flex;
 align-items: top;
 flex-wrap: wrap;
 justify-content: center;
 margin-top: 3em;

`;

 