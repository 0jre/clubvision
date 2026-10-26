import AccountNvxre from "@club/components/account/account.user";
import HeadGlobal from "@/club/head/glob.n";
import { useEffect, useState } from "react";
import styled from "styled-components";


const ListLogo = [
  "https://i.imgur.com/HO8Mhc0.jpg",
  "https://i.imgur.com/JVa4vQu.jpg",
  "https://i.imgur.com/5Ga56pD.jpg",
  "https://i.imgur.com/Yn5htE4.jpg",
  "https://i.imgur.com/wEk9gJb.jpg",
  "https://i.imgur.com/kGxIHO3.jpg",
  "https://i.imgur.com/kYxafCe.jpg",
  "https://i.imgur.com/1jixw7u.png",
  "https://i.imgur.com/yrfDSXP.png",
  "https://i.imgur.com/imbyqwS.png",
  "https://i.imgur.com/bEwdfwz.png",
  "https://i.imgur.com/mXit4fI.jpg",
];


export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch top users from API
    const fetchTopUsers = async () => {
      try {
        const response = await fetch('/api/club/leaderboard'); // Alterar para a URL correta da sua API
        const data = await response.json();
        setTopUsers(data.log); // Atualize o estado com a lista dos usuários
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    fetchTopUsers();
  }, []);



  const getRandomAvatar = () => {
    return ListLogo[Math.floor(Math.random() * ListLogo.length)];
  };

 const formatCurrency = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.00';
  }

  const suffixes = ['M', 'B', 'T', 'Q'];
  const thresholds = [1e6, 1e9, 1e12, 1e15];

  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) {
      return (value / thresholds[i]).toFixed(2).replace(/\.00$/, '') + suffixes[i];
    }
  }

  return value.toLocaleString('pt-BR');
};

  return (
    <>
      <HeadGlobal Title="Leaderboard - TOP 29 Clubrs" />
      <AccountNvxre />
      <ContainerVX>
        <Container>
          <BackgroundOverlay>
            <Header />
            <div className="sadhaisd">
              <ContainerXV>
                {/* Renderizar os três primeiros usuários de forma estática */}
                {topUsers.length > 0 && (
                  <>
                    <CollectorCardnB
                   link={`/@${topUsers[1]?.name}`}
                      top="top2"
                      image={topUsers[1]?.avatar || getRandomAvatar()}
                      id={topUsers[1]?.name}
                      ValueTop="/icons/top2.webp"
                      badge="/icons/sdhjdsfc.webp"
                      value={formatCurrency(topUsers[1]?.wealthScore)|| '0.000'}
                      top1anime="topanimg"
                    />
                    <CollectorCardnB
                    link={`/@${topUsers[0]?.name}`}
                      top1anime="topanimg"
                      top="top1"
                      image={topUsers[0]?.avatar || getRandomAvatar()}
                      id={topUsers[0]?.name}
                      ValueTop="/icons/top1.webp"
                      badge="/icons/hsadin.webp"
                      value={formatCurrency(topUsers[0]?.wealthScore) || '0.000'}
                    />
                    <CollectorCardnB
                    link={`/@${topUsers[2]?.name}`}
                      top="top3"
                      image={topUsers[2]?.avatar || getRandomAvatar()}
                      id={topUsers[2]?.name}
                      badge="/icons/sadhsjakdc.webp"
                      ValueTop="/icons/top3.webp"
                      value={formatCurrency(topUsers[2]?.wealthScore) || '0.000'}
                      top1anime="topanimg"
                    />
                  </>
                )}
              </ContainerXV>
            </div>
          </BackgroundOverlay>
          <ContentWrapper>
            <ContainerCV>
              <TitleWrapper>
                <Title>NVRP&nbsp;</Title>
                <Subtitle>Visionarios</Subtitle>
              </TitleWrapper>
              <BadgeContainer>
                <BadgeCs>Top 29 Clubrs</BadgeCs>
              </BadgeContainer>
            </ContainerCV>

            <ContainerJks>
              {/* Renderizar os usuários restantes dinamicamente */}
              {topUsers.length > 0 &&
                topUsers.slice(3).map((user, index) => (
                  <CollectorCard
                    key={user.userId}
                    link={`/@${user.name}`}
                    image={user.avatar}
                    momentum={user.momentum}
                    id={user.name} 
                    badgeValue={user.position}
                    value={formatCurrency(user.wealthScore) || '0.000'}
                  />
                ))}
            </ContainerJks>
          </ContentWrapper>
        </Container>
      </ContainerVX>
    </>
  );
}
  


const CollectorCard = ({ link, momentum,image, id, badgeValue, value }: any) => {
 

 const reversedBadgeValue = 29 - badgeValue + 0;  
 const levelIcon = `/icons/badges/icon-level-${reversedBadgeValue}.svg`;
  return (
    <Overlay>
    <LinkWrapper href={link} target="_blank" rel="noreferrer">
      <FlexContainer>
        <GridContainer>
          <Badge>
            <img src={levelIcon}alt="The Order" />
          </Badge>
          <div>{badgeValue}</div>
          <StyledImage src={image} alt="Collector" />
        </GridContainer>
        <CollectorId>
        <li>
          <h1> {id}</h1>
          <p>{momentum}</p>
        </li>
        
        </CollectorId>
      </FlexContainer>
      <Value>{value}</Value>
    </LinkWrapper>
  </Overlay>
  );
};
 



const CollectorCardnB = ({link, top1anime, top, badge, image, id, ValueTop, value }: any) => (
  <OverlayX>
    <LinkWrapperX className={top} href={link} target="_blank" rel="noreferrer">
      <FlexContainerX>
          <div className={top1anime}>
          <StyledImageX className="ojs1 pixel" src={image} alt="Collector" />
          </div>
    
        <CollectorIdX>{id}</CollectorIdX>
      </FlexContainerX>


      <div className="hjsdd">
 
      <StyledImageX className="absolute"  src={ValueTop} alt="Collector" />
           
      <ValueX>{value}</ValueX>

      </div>
      
     
    </LinkWrapperX>

  </OverlayX>
);




 


const ContainerXV = styled.div`
width: 50vw;
margin-top: -5em;
display: flex;
place-content: center;
justify-content: space-evenly;
align-items: center;
gap: 5px;


@media screen and (max-width: 730px) {
 width: 100vw;
 margin-top: 8em;
}
`;

const OverlayX = styled.div`

transition: transform 0.1s ease-out;


.top2{
  transform: scale(0.9);
}


.top3{
  transform: scale(0.9);
}

.top1{
  transform: scale(1.4);
 
}


.topanimg{
  
  

 img{
  border-radius: 12px 12px 12px 52px;
 }



}



.ojs{
  display: none;
}

&:hover{

  .topanimg{
      border-image: none;
      box-shadow: none;
  }
}



`;

const LinkWrapperX = styled.a`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 1rem;
position: relative;
color: inherit;


.absolute{

   border-radius: 0;
   height: 40px;
   width: auto;
   top: 35%;
   left: 9%;
   position: absolute;
}


.hjsdd{
  display: flex;
  align-items: center;
  gap: 12px;
}
`;

const FlexContainerX = styled.div`

display: flex;
flex-direction: column;
gap: 1rem;
justify-content: center;
align-items: center;

  .pixel{
    image-rendering: pixelated;
  }
`;


const StyledImageX = styled.img`
width: 5.5rem;
height: 5.5rem;
border-radius: 0.625rem;
 

`;

const CollectorIdX = styled.div`

font-weight: bold;
text-transform: uppercase;
font-size: 13px;
max-width: 100px;
overflow: hidden;
   word-wrap: break-word;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;


`;

const ValueX = styled.div`
font-size: 19px;
text-align: right;
font-family: 'ldvision';
 

 

`;

const ContainerCV = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
 
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
 
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  
  align-items: center;
  text-transform: uppercase;
  color: white;
  flex-direction: column;
  align-items: flex-start;
  
`;

const Title = styled.span`
  line-height: normal;
  letter-spacing: -0.02em;
  font-size: 1.9rem;
  font-weight: 900;
  font-family: 'Graffiti';
  color: #14aa52;
  
  @media screen and (max-width: 730px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.span`
  line-height: normal;
  letter-spacing: -0.02em;
  font-size: 50px;
  font-weight: 900;
  font-family: 'Europa Grotesk';

  @media screen and (max-width: 730px) {
    font-size: 30px;
  }
`;

const BadgeContainer = styled.div`
  text-align: center;
  background-color: #3bc77a;
  border-radius: 9999px;
  padding: 0.125rem;
  display: inline-block;

   
`;

const BadgeCs = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.25rem 1rem;
  border: 2px solid #0a0a0a; /* Azuki Gray 800 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: black;
`;

 

const ContainerJks = styled.div`
  border: 1px solid #252627;
  background-color: rgb(19, 18, 18);
  color: white;
  overflow: hidden;
  border-radius: 1rem;
 
  width: 100%;
 
`;

const Overlay = styled.div`
 background-color: rgba(23, 23, 23);
 border-bottom: 1px solid #1b1c1d;
  transition: transform 0.1s ease-out;
  overflow: hidden;
  cursor: pointer;

  @media (min-width: 768px) {
    &:hover {
      background-color: #1b1c1d;
      transform: scale(1.02);
      border-radius: 0.375rem;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    }
  }
`;

const LinkWrapper = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: inherit;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-right: 1rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.125rem;
  text-align: center;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
`;

const Badge = styled.div`
  border: 1px solid #292727;
  background-color: black;
  padding: 0.125rem;
  border-radius: 50%;
  width: 35px;
  height: 35px;

  img{
    height: 30px;
    width: 30px;
  }

  @media (min-width: 768px) {
    width: 38px;
    height: 38px;
  }
`;

const StyledImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;

 
`;

const CollectorId = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 1.125rem;
   
  li{


    h1{
      font-family: 'InterSemiBold', monospace;
      font-size: 14px;
      text-transform: uppercase;
    }

    p{
      font-family: 'ProximaNova-Italic', sans-serif;
      font-size: 12px;
    }
  }
 
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Value = styled.div`
    font-size: 21px;
  text-align: right;
  font-family: 'ldvision';
 
`;

const ContainerVX = styled.main`
  position: fixed;
  height: 100vh;
 
  width: 100vw;
  overflow: hidden;
  background-color: rgba(23, 23, 23, var(--tw-bg-opacity));
`;


const Container = styled.div`
  width: 100vw;
  height: 99vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  place-items: center;
  
  justify-content: center;
  overflow-y: auto;
  padding-top: 40vw;
  padding-left: 1rem;
  padding-right: 1rem;
 
 
  @media (min-width: 1024px) {
    padding-left: 0;
    padding-right: 0;
  }


  @media screen and (max-width: 730px) {
    padding-top: 112vw;
  }
`;

const BackgroundOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: auto;
  top: -20vw;
  inset-inline: 0;
  z-index: 0;
  z-index: 0;
  
  .sadhaisd{
    margin-top: -12em;
    display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: 100%;
  align-items: center;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1012px;
  z-index: 10;
  height: 100vh;

`;
const Header = styled.header`
 background-image: linear-gradient(to top, rgb(23, 23, 23), transparent), url('/theim/backgrounds/hbsbfjsdfbin.png');
    background-size: 100%, 100%;
    background-repeat: no-repeat;
    background-position: center top;
    aspect-ratio: 11 / 5;
    opacity: 1;
  image-rendering: pixelated;

`;


 