"use client"
import { NextPage, NextPageContext } from 'next';
import Image from 'next/image';
import ErrorRobot from '@/public/icons/shiba.png'
import { useRouter } from 'next/navigation';
import { 
  GlobalError,
  MarginXC,
  Conyent,
  Marginfooter,
  ButtonNox,
  Card,
  ContainerNox
} from '@/styles/styled.view'
import Link from 'next/link';
import NVXROUTE from '@/routes/routes';
import HeadGlobal from '@/club/head/glob.n';
import ROUTENVX from '@/routes/routes';
 
interface ErrorPageProps {
  statusCode?: number;
}

  
const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <>
    <GlobalError />
    <HeadGlobal Title='NVRP / ? ' />
    <ContainerNox> 

    <MarginXC>
    <Card>
    {/* {statusCode ? `${statusCode}` : 'Algo esta dando Conflito!'} */}
    <Image src={"/nvrp/nvrp_bc.png"}  alt='thenovision' height={70} width={70}/>

      <h1>Não encontrei nada aqui</h1>
      <p>Parece que você tentou acessar uma página que não existe. Enquanto você está aqui, aproveite a companhia do dog. Esperamos que ele traga um sorriso ao seu rosto e um pouco de alegria ao seu dia.</p>
       
     <ButtonNox onClick={handleGoBack}>
         Voltar aonde estava?
      </ButtonNox>
     </Card>
     <Image src={ErrorRobot} alt='problema aqui!' className='dogg'  height={400}/>
     
    </MarginXC>
  

    <Conyent>

<Link href={NVXROUTE.Dashboard}>
  Clubvision
</Link>

<Link href={NVXROUTE.Store}>
  Shopvision
</Link>

<Link href={NVXROUTE.policy}>
 Politica de privacidade
</Link>
<Link href={NVXROUTE.terms}>
Termos de Serviço
</Link>
<Link href={NVXROUTE.Legal}>
  Regras da comunidade
</Link>

<Link href={'/gtarp'}>
{ROUTENVX.cop}
</Link>

</Conyent>

    </ContainerNox>


    <Marginfooter>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1519 200">
        <defs></defs>
        <path d="M708 103l9-5 13 1 2-2 5 1h8l1-1 42-5h7l7 3v1l12-2a9368 9368 0 0129-6l2-5 12 1 6-2 3 1 2 1v-2l13-2v1l4 2 7-1h1l17-3 1 2 4-1 18-7 3-1 4-1h9l13-1 1-4 3-2 13 1v2l22-2 10-3h6l10 5 16-5 15-3 2-1 8-4 6-2 12-1 7-2 8 5 7 1 22-9h7l5-1v-1l25-3 1 2 5 2v1h11l2 1 8-4h3l-1 1h11l10-6 6 3 9-1 4-1 1 1 1-2 6-1 1-1 10-2h2l7-5v1h4l3-1c11 0 23 2 34-3 2-2 7 0 10 0l12 1 4 1 9 2 12-1 11-3 11 1h4l10-6 17 1 2 1c9 2 19-3 22-11l1-1 9 1 15-5c3-1 9 4 9-5 5 0 5 3 5 7l2 3 4-1 4-2 9-4 3-3h3l8-4 6-3 26 2 7-4h18l7 1c10 3 13-6 17-12l8 4 3-1 14-3 15-2a38 38 0 01-5-1l-8-4 7-8 8-4-10-136-922 71 16 205z"></path>
        <path d="M-36 193l9-5 13 1 2-2 5 1h8l1-1 42-5h7l7 3v1l12-2a9328 9328 0 0129-6l2-5 12 1 6-2 3 1 2 1v-2l13-2v1l4 2 7-1h1l17-3 1 2 4-1 18-7 3-1 4-1h9l13-1 1-4 3-2 13 1v2l22-2 10-3h6l10 5 16-5 15-3 2-1 8-4 6-2 12-1 7-2 8 5 7 1 22-9h7l5-1v-1l25-3 1 2 5 2v1h11l2 1 8-4h3l-1 1h9a6 6 0 002 0l10-6 6 3 9-1 4-1a6 6 0 001 1l1-2 6-1 1-1 10-2h2l7-5v1h4l3-1c11 0 23 2 34-3 2-2 7 0 10 0l12 1 4 1 9 2 12-1 11-3 11 1h4l10-6 17 1 2 1c9 2 19-3 22-11l1-1 9 1 15-5c3-1 9 4 9-5 5 0 5 3 5 7l2 3 4-1 4-2 9-4 3-3h3l8-4 6-3 26 2 7-4h18l7 1c10 3 13-6 17-12l8 4 3-1 14-3 15-2a37 37 0 01-5-1l-8-4 7-8 8-4-10-136-922 71 16 205z"></path>
      </svg>

    
    </Marginfooter>
    </>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
 

  
