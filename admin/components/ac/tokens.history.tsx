import { useEffect, useState } from "react";
import styled from "styled-components";



interface Props {
    userId: string;
}

interface OHistory {
    code: string; 
    bonus: number; 
    date: string; 
    history: any[]
  
  }
export default function ReedemCode ({userId} : Props) {
    const [isLoading, setIsLoading] = useState(true);
    const [redemptionHistory, setRedemptionHistory] = useState<OHistory[]>([]);
   
    useEffect(() => {
   
          async function fetchUserXC() {
           try {
             setIsLoading(true); 
            
             const responsehistory = await fetch(`/api/_v4/bitger/getRedemptionHistory?userId=${userId}`); 
             const data = await responsehistory.json() as OHistory;
          
             setRedemptionHistory(data.history);
             setIsLoading(false);
           } catch (error) {
             console.error('Error fetching user info:', error);
             setIsLoading(false);
           } finally {
             setIsLoading(false);
           }
         }
        
          fetchUserXC();
      }, []);


    return(
        <>
        
        <MarginTitle>
          <h1>Histórico de códigos</h1>
        </MarginTitle>
 
        <CustomScrollbar>
            <Table data-testid="codes_table">
              <Thead>
                <Tr>
                  <Th>CÓDIGO PROMOCIONAL</Th>
                  <Th>MONTANTE DO BÓNUS</Th>
                  <Th>DATA DE USO</Th>
                </Tr>
              </Thead>
              <Tbody>
              {(redemptionHistory && redemptionHistory.length > 0) ? (
 redemptionHistory.sort((a, b) => {
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  return dateB - dateA;
})
    .map((entry, index) => (
      <Tr key={index}>
        <Td>{entry.code.replace('NVRP-', '')}</Td> 
        <CenteredTd>
          <BonusSpan>  <img src="/icons/coins/orbit-novision.webp" alt="" /> <p>{entry.bonus}</p> </BonusSpan>
        </CenteredTd>
        <Td>{new Date(entry.date).toLocaleString()}</Td>
      </Tr>
    ))
  ) : null}
              </Tbody>
            </Table>
          </CustomScrollbar>

        </>
    )
}



















const CustomScrollbar = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 500px;
  table-layout: fixed;
  font-size: 0.75rem; 
  text-transform: uppercase;
`;

const Thead = styled.thead``;

const Tr = styled.tr`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`;

const Th = styled.th`
  padding: 1rem 0; 
  text-align: left;
  font-weight: 600; 
  
  &:nth-child(2) {
    text-align: center;
  }
  
  &:nth-child(3) {
    text-align: right;
  }
`;

const Tbody = styled.tbody`
  width: 100%;
  font-weight: 600;

  font-family: 'ProximaNova-Italic', sans-serif;
  color: white;

  & > *:nth-child(odd) {
    background-color: #101011; 
    border-radius: 12px;
  }
`;

const Td = styled.td`
  display: flex;
  align-items: center;
  justify-content: flex-start; 
  padding: 0.75rem 0; 

  &:first-child {
    border-radius: 6px 0 0 6px; 
    padding-left: 1rem;
  }

  &:last-child {
    justify-content: flex-end;
    border-radius: 0 6px 6px 0; 
    padding-right: 1rem; 
  }
`;

const CenteredTd = styled(Td)`
  justify-content: center;
  gap: 0.25rem; 
  padding: 1rem; 
`;

const BonusSpan = styled.span`
  font-weight: 600; 
  display: inline-flex;
  align-items: center;
  color: #19e256;

   img {
    height: 20px; 
    width: 26px; 
   padding-right: 0.4em;
  }
`;


const MarginTitle = styled.div`
  display: flex;
  margin-top: 1em;
  margin-bottom: 2em;
  width: 100%;
  justify-content: center;
  border-bottom: 1px solid rgba(183, 184, 189, 0.288);

   h1{
    font-size: 18px;
    padding: 1em;
     color: #a2aca6;
     border-bottom: 1px solid rgba(213, 214, 219, 0.753);
     font-family: 'ProximaNova-Italic';
   }
`;


const CardInfoowner = styled.div`
  display: flex;
  flex-direction: column;
  
  align-items: center;
  justify-content: space-between;
  
  background-color: rgba(31, 31, 34, 0.055);
  background-image: url('/icons/084mnfgjhdgdfyt4n.png');
   
   padding: 0.9em 2em 0.9em;
   margin: 1em;
    margin-bottom: 0em;
  .logo{
    border-radius: 16px;
  }

  li{
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-top: 1em;
   
    h5{
      margin-bottom: 0.2em;
      font-size: 16px;
      font-family: 'Europa Grotesk';
      color: rgba(190, 201, 192, 0.774);
    }
   
    p{
      font-family: 'InterSemiBold', monospace;
      font-size: 13px;
      color: #bfc2c9f6;
    }
  }

  transform: translateY(20px);
  animation: fadeInUp 0.8s ease-in-out forwards;
  @keyframes fadeInUp {
    0%{ opacity: 0; transform: translateX(20%)}
    100%{ opacity: 1; transform: translateX(0)}
  }
  
`;

const ModalWrapper = styled.div`
  position: absolute;
  z-index: 10;
  bottom: 2px;
  left: 0;
  right: 0;
  margin: 0.4em;
  border-radius: 0.75rem; 
  background:  #0b0b0cfd;
  padding: 0;

  @media (min-width: 768px) {
    padding: 1.25rem; /* md:p-5 */
  }
`;

const FormContainer = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;   
  border-radius: 55px;  
  background:  #2c2c3040;
 
  @media screen and (max-width: 430px) {
    background:  transparent;
    gap: 0.5rem;
}
`;

const InputWrapper = styled.div`
  position: relative;
  flex-grow: 1;
`;

const Input = styled.input`
  height: 55px; 
  width: 100%;
  font-size: 15px;
  font-family: 'InterSemiBold', monospace;
  background: transparent;
  padding: 1rem 1.25rem; 
  color: #d6d9e6; 

  placeholder {
    color: #B8BCD0;
  }
  &:focus {
    outline: none;
    box-shadow: none; 
  }
  &:disabled {
    opacity: 0.5;
  }
`;

const ApplyButton = styled.button`
  padding: 0 1.25rem; 
  background-color: #d9e4de; 
  border: none;
  border-radius: 55px;  
  cursor: var(--f-cursor-pointer);
  font-family: 'XcSemibold';
  min-width: 140px;
  margin-right: 0.3em;
  font-size: 14px;
  height: 2.7rem; 
  color: black;
  
  
  &:hover {
    background-color: #1cbd51;   
  }

  @media screen and (max-width: 430px) {
 
    font-size: 15px;
    padding: 0.5em 0.7em 0.5em; 
}
`;

const Wrapper = styled.div`
display: flex;
align-items: center;
position: relative;
justify-content: center;
height: auto;
 
@media (min-width: 768px) {
  height: 12rem; /* md:h-48 */
}
 
`;

const ImageContainer = styled.div`
position: relative;
z-index: 10;
aspect-ratio: 0.7 / 1; 
height: 100%;
  
img {
  position: absolute;
  left: 1px;
  height: 100%;
  object-fit: contain;
  transform: scale(1);
}

@media screen and (max-width: 430px) {
  display: none;
 
}
`;

const ContentContainer = styled.div`
flex-grow:5;
margin-left: -5rem;

@media (min-width: 640px) {
  margin-left: -5rem;
  margin-right: -4rem; 
  flex-grow:2;
}

@media screen and (max-width: 430px) {
  margin-left: 0rem;
}
`;

const PromoContainer = styled.div`
display: flex;
gap: 0.5rem;
width: auto;
padding: 1rem 0.4rem 0.5rem;
background: linear-gradient(90deg, rgba(119, 255, 157, 0.1) 0%, rgba(17, 17, 20, 0) 156.79%);
 
@media (min-width: 640px) {
  padding-left: 7rem; /* sm:pl-28 */
  padding-right: 2rem; /* sm:pr-8 */
}

@media screen and (max-width: 430px) {
  padding-left: 2rem; /* sm:pl-28 */
  padding-right: 2rem; /* sm:pr-8 */
  border-radius: 12px;
}
`;

const IconWrapper = styled.span`
display: flex;
height: 2rem;
width: 2rem;
flex-shrink: 0;
align-items: center;
justify-content: center;
border-radius: 50%;
background-color: #228b22; /* bg-eco-green-800 */
color: #32cd32; /* text-green-400 */
`;

const InfoWrapper = styled.div`
flex: 1;
display: flex;
flex-direction: column;
gap: 0.5rem;
text-align: left;
color: white;
`;

const Title = styled.p`
font-size: 14px;
font-weight: 600;
`;

const TooltipButton = styled.button`
margin-left: 0.25rem;
cursor: pointer;
padding: 0.5rem;
background: none;

svg {
  height: 1.25rem;
  width: 1.25rem;
  color: rgba(255, 255, 255, 0.5);
  transition: color 200ms;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }
}
`;

const Description = styled.p`
font-size: 12px;
max-width: 280px;
margin-top: 0.25rem;

span {
  font-weight: 600;
  color: #32cd32; /* text-green-400 */
}

 
`;


const Wrapp = styled.div`

position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9345774;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  place-items: center;
  align-items: center;
  background-color: rgba(11, 12, 10, 0.349);
  background-image: url('/web/hdshfioef.png');
`;

const CardCode = styled.div`
background-color: #131414;
padding: 1em;
max-height: 90%;
width: 550px;
overflow-y: auto;
border-radius: 23px;
animation: AnimOps 1s linear;

 
@keyframes AnimOps {
  0%{ opacity: 0;}
  100% { opacity: 1;}
}
@media screen and (max-width: 430px) {
  width: 100%;
  margin: 1em;
  min-height: 330px;
  max-height: 530px;
}
`;


const MargintopSelect = styled.div`
  width: 100%;
  display: flex;
  height: 3.5rem; 
  gap: 0.125rem; 
  overflow: hidden;
  border-top-left-radius: 0.75rem; 
  border-top-right-radius: 0.75rem; 
  
  .active{
   
    img{
      filter: brightness(0); 
    }
  }

  .bits{
      background:#00ff6275;
     }
    .code{
      background:#da961940;
    }

  .button1{
    margin-left: auto; 
  display: grid;
  width: 41px; 
  cursor: var(--f-cursor-pointer);
  place-content: center;
  background:  #2c2c3040;
  transition: background-color 200ms, color 200ms; 
  
  &:hover {
    background-color: #16161b;
    color: white; 
  }

  svg {
    height: 1.25rem; 
    width: 1.25rem;  
  }
  }

  
  button{
    display: flex;
  height: 100%;
  
  flex: 1;
  cursor: var(--f-cursor-pointer);
  align-items: center;
  justify-content: center;
  gap: 0.75rem; 
  background:  #2c2c3040;
  font-size: 0.875rem; 
  font-weight: 600; 
  font-family: 'ProximaNova-Italic', sans-serif;
  text-transform: uppercase; 
  color: white;
  transition: background-color 150ms;
  
  &:hover {
    background-color: #16161b;
  }

  img {
    height: 1.25rem; 
    width: 1.25rem; 
    filter: brightness(10); 
  }

  span {
    display: none;

    @media (min-width: 640px) { /* sm:inline */
      display: inline;
    }
  }
    
  }

  .buttonclose{
    background:  #12131240;
    width: 100%;
    border-radius: 50%;
    padding: 5px;

  }
`;

const ContentCardCode = styled.div`
background:  #2c2c3040;
margin-top: 0.1em;
border-radius: 0 0 0.75rem 0.75rem;
padding: 1em;
overflow: hidden;
position: relative;
height: 280px;

 
@media screen and (max-width: 430px) {
  height: 220px;

}

`;

 
const CardViewList = styled.div`
   
  padding: 0.1em;
  border-radius: 6px;
  width: 100%;
  display: inline-flex;
  border-radius: 100px;
  overflow-x: auto;
  cursor:  var(--f-cursor-grab);

:active {
cursor:  var(--f-cursor-grabbed);
}


 
`;




///////////////////////////////

const MarginDonate = styled.div`

`;

const LinkS = styled.a`
  position: relative;
  width: 100%;
  margin-right: 12px;
  @media (min-width: 768px) {
    display: none;
  }
`;

const Butt = styled.button`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'InterSemiBold', monospace;
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #294134;
  background: linear-gradient(to left, #184731, #0B2811, #011B08);
  background-size: 100% 100%;
  padding: 0.5rem;
  transition: background-size 0.2s;
  border-radius: 34px;
  &:hover {
    background-size: 150% 150%;
  }
  @media (min-width: 640px) {
    background: linear-gradient(to right, #29522E, #0B2811, #011B08);
  }
  @media (min-width: 768px) {
    border-radius: 0.75rem;
  }
  @media (min-width: 1024px) {
    padding: 0.75rem 1rem;
  }
  height: 50px;
  width: 100%;
  justify-content: center;
  border-radius: 1rem;
`;

const Icon = styled.svg`
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  color: #38A169;
  @media (min-width: 1024px) {
    height: 1.25rem;
    width: 1.25rem;
  }
`;

const Text = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  display: inline;
  @media (min-width: 400px) {
    display: inline;
  }
  @media (min-width: 768px) {
    display: none;
  }
  @media (min-width: 850px) {
    display: inline;
  }
  @media (min-width: 1150px) {
    display: none;
  }
  @media (min-width: 1500px) {
    display: inline;
  }
`;

const Percentage = styled.span`
  font-size: 0.875rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #38A169;
  display: none;
  @media (min-width: 768px) {
    display: inline;
  }
`;

const BonusContainer = styled.div`
  position: absolute;
  right: 0;
  transform: rotate(30deg);
  font-size: 6rem;
  font-weight: bold;
  line-height: none;
  color: #38A169;
  opacity: 0.05;
  transition: transform 0.2s;
  &:hover {
    transform: translateX(-1.5rem) translateY(0.75rem) scale(1.25);
    transition-duration: 0.4s;
  }
  display: block;
  @media (min-width: 640px) {
    display: block;
  }
`;

const FlexBox = styled.div`
  position: absolute;
  right: -3rem;
  top: 0;
  height: 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 1rem;
  padding-right: 0.5rem;
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: #2E3244;
  display: none;
  @media (min-width: 768px) {
    display: flex;
  }
`;

const SmallText = styled.span`
  font-size: 0.5rem;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Username = styled.h2`
  margin: 0;
`;

const Rank = styled.div`
   margin: 0.3em;
`;



const SectionTitle = styled.h3`
  margin-top: 17px;
  text-align: start;
  font-size: 15px;
  margin-bottom: 10px;
  padding: 0.4em 1em 0.4em;
  font-family: 'ProximaNova-Italic', monospace;
  color: #d3d6df;
  text-transform: uppercase;
`;

const Section = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  

  @media screen and (max-width: 490px) {
    width: 100%;
    display: inline-flex;
  }
`;

const ButtonCb = styled.button`
    background-color: #13131432;
  border: none;
  border-radius: 13px;
  margin: 0.2em;
  padding: 6px 16px 6px ;
  cursor: pointer;
  display: flex;
  align-items: center;   
  font-weight: bold;
  transition: background-color 0.3s ease;
  
   svg{
    margin: 0.2em;
   }
   h3{
    font-size: 11px;
    font-family: 'ProximaNova-Italic', sans-serif;
    text-transform: uppercase;
   }
  &:hover {
    background-color: rgba(19, 19, 20, 0.459);
  }
`;

const GameSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin-bottom: 20px;
`;

const GameButton = styled.button`
   background-color: #131314;
  border: none;
  border-radius: 10px;
  margin: 0.3em;
 
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(19, 19, 20, 0.459);
  }

   h3{
    font-size: 12px;
    font-family: 'ProximaNova-Italic', sans-serif;
    text-transform: uppercase;
    margin-top: 0.3em;
   }

   li{
    width: 100%;
    padding: 9px 15px 9px;
    height: 100%;
   }

   .color1{
        background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(219, 75, 255, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
        h3{
      color: #6f32be;
    }
   }

   .color2{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(75, 255, 114, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #32be61;
    }
   }


   .color3{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(219, 39, 54, 0.288) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #db2736;
    }
   }

   .color4{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(255, 75, 84, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #e02232;
    }
   }


   .color5{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(219, 205, 206, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #bcccc3;
    }
   }

   .color6{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(75, 147, 255, 0.4) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #327fbe;
     }
   }


   .color7{
    background: radial-gradient(43.68% 59.18% at 50.18% -16%, rgba(41, 194, 105, 0.164) 0%, rgba(32, 32, 40, 0) 100%);
    h3{
      color: #32be6c;
     }
   }
`;
 
const Banner = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  cursor: var(--f-cursor-pointer);
`;

const OtherSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

 
`;

const OtherButton = styled.button`
  background-color: #13131432;
  border: none;
  margin: 0.3em;
  border-radius: 9px;
  padding: 8px 14px 8px ;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  display: flex; 
  align-items: center;

    svg{
    margin: 0.2em;
   }
   h3{
    font-size: 11px;
    font-family: 'ProximaNova-Italic', sans-serif;
    text-transform: uppercase;
   }

  &:hover {
    background-color: rgba(19, 19, 20, 0.459);
  }
`;
 
const CardAccount = styled.div`
  padding: 0.5em 2em 2em;
 
  width: 480px;
  margin: 1em;
  animation: LEFTANIMWR 1s alternate;
    
     
    @keyframes LEFTANIMWR {
     0%{ opacity: 0; }
     100%{ opacity: 1; }
    }
    

    .logoroda{
        border-radius: 14px;
        text-align: center;
    }


    @media screen and (max-width: 430px) {
       width: 100%;
       z-index: 6;
       margin: 0em;
    }


    ul{
    display: flex;
    align-items: center;
    padding: 0.2em 1em 0.2em;
    justify-content: space-between;

    a{
      font-family: 'InterSemiBold', monospace;
      font-size: 12px;
      color: rgba(99, 100, 105, 0.342);
      margin: 0.3em;
      transition: 0.7s all;

      &:hover{
        color: #fff;
      }
    }
  }
`;


const MarginSb = styled.div`
 position: fixed;
   height: 100%;
   width: 100%; 
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  place-items: center;
  z-index: 2232;
  background-color: rgba(0, 0, 0, 0.87);
   background-image: url('/web/hdshfioef.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

const MarginPoints = styled.div` 
display: flex;
flex-direction: column;
padding: 0.3em 0.4em 0.3em;

  li{
    display: inline-flex;
     margin-bottom: 0.1em;
    h6{
      padding-left: 0.4em;
     
    }

    .gold{
      color: #c5e9d5;
    }

    .green{
      color: #1fd471;
    }

   
  }

`;


const Marginquantity = styled.div`
   display: flex;
   align-items: center;
   padding: 0.3em 0.5em 0.3em;

   .cRS{
    background-color: #24382b;
    color: #caced6;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 52px;
    width: 35px;
    font-size: 21px;
    padding: 0.4em 0.7em 0.4em;
   }

   section{
    margin: 0.3em;

    h3{
      font-size: 16px;
      font-family: 'Inter', monospace;
    }

    p{
      font-family: 'ProximaNova-Italic', monospace;
      color: #a1a4a8;
      font-size: 9px;
      text-transform: uppercase;
    }
   }


   @media screen and (max-width: 540px) {
     display: none;
   }
`;


const ButtonSSS = styled.button`
    border-radius: 13px;
    
    color: rgb(31, 226, 96);
     
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
    line-height: 100%;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
   transition: 1s all;
   display: flex;
   align-items: center;
  

   .i{
    transition: 1s all;
      color: #d3d3da;
        font-size: 19px;
        margin-left: 0.4em;
        border-radius: 9px;
        height: 33px;
        width: 33px;
        padding: 6px 0.3em 0.2em;
    }

   h4{
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #e4dbdb;
    font-weight: 900;
    padding-left: 0.7em;
   }
  
   &:hover{
    background: linear-gradient(130deg, rgba(0,0,0,1) 0%, rgba(17,19,22,1) 100%);
     box-shadow: 0 0 1.5625rem #d4dbd652;

     h4{
      color: white;
     }
     
     i{
      color: #080808;
      background-color: rgb(228, 228, 238);
     }
   }

 
`;

 

const MobileMenuMargin = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 162;
    right: 0;
    background-color: rgba(0, 0, 0, 0.658);
    backdrop-filter: blur(29px);
    animation: Cvx 0.3s linear;
    
 @keyframes Cvx {
    0%{ transform: translateY(-100%)}
    100%{ transform: translateY(0%)}
 }
`;


const MenuMobile = styled.div`
   
   
   padding: 5em 0.3em 0em;
  width: 100vw;
  overflow-y: auto; 
   height: 100vh;
   background-color: #0B0C0A;
    

    .logoroda{
        border-radius: 14px;
        text-align: center;
    }


    @media screen and (max-width: 430px) {
       width: 100vw;
       z-index: 6;
      
    }


    ul{
    display: flex;
    align-items: center;
    padding: 0.2em 1em 0.2em;
    justify-content: space-between;

    a{
      font-family: 'InterSemiBold', monospace;
      font-size: 12px;
      color: rgba(99, 100, 105, 0.342);
      margin: 0.3em;
      transition: 0.7s all;

      &:hover{
        color: #fff;
      }
    }
  }
`;




 

const ContainerIo = styled.nav`
  
 width: 100%;
 background: linear-gradient(to top, transparent, transparent 60%, #0B0C0A);
 top: -1px;
 left: 0;

 padding: 0.5em 1em 0.5em;
 position: absolute;
 z-index: 163;

  
 .buttons {
  border-radius: 45px;
    background: transparent;
    color: rgb(31, 226, 96);
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
 
    line-height: 100%;
     
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.1em 0.3em 0.1em;
    transition: ease .2s;
    transition-property: background-color, box-shadow;
    text-decoration: unset;
    display: flex;
    overflow: hidden;
    align-items: center;
    position: relative;

    .i {
        transition: background-color 0.3s ease;
        color: #dfdfe7;
        background-color: black;
        font-size: 19px;
        border-radius: 50%;
        height: 33px;
        width: 33px;
        z-index: 1;
        padding: 6px 0.3em 0.2em;
    }

    .dcv {
        position: absolute;
        visibility: hidden;
        float: right;
        right: 7px;
        opacity: 0;
        transition: opacity 0.3s ease, visibility 0s 0.3s;
    }

    h4 {
        font-size: 12px;
        font-family: 'Inter', monospace;
        color: #050404;
        font-weight: 900;
        padding-left: 1em;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.1s ease;
    }

    &:hover {
        background: linear-gradient(130deg, #e4ebe6 0%, #bbc0bd 100%);
        width: 130px;
        h4 {
            transform: translateX(0);
            opacity: 1;
        }

        .dcv {
            visibility: visible;
            opacity: 1;
            transition-delay: 0s;
             
        }

        .i {
            background-color: #26dd6c;
        }
    }
}
@media screen and (max-width: 430px){
  top: -1px;
  position: fixed;

  .buttons{
    display: none;
  }
 }
   
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
 
  .logo{
    border: 3px solid rgba(91, 91, 99, 0.438);
    border-radius: 80%;
    cursor: var(--f-cursor-pointer);
  }


  span{
    display: inline-flex;
    align-items: center;
    cursor: var(--f-cursor-pointer);
     
    h4{
      font-size: 13px;
      padding-left: 0.4em;
      text-transform: uppercase;
      color: #27c463;
      font-family: 'XcSemibold', monospace;
    }

    &:hover{
      transform: scale(0.9);
    }
  }


  h3{
      font-family: 'XcSemibold';
      font-size: 15px; 
      color: #becac3;
      max-width: 210px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  text-transform: uppercase;
  display: -webkit-box;
  -webkit-line-clamp: 1;
 
  -webkit-box-orient: vertical;
    }



  .Logo{
    margin-top: -0.3em;
  }

   .Mobilebutton{
     display: none;
   }
  .logof{
    filter: saturate(0);
  }

 
  ul{
    display: flex;
    align-items: center;
    gap: 9px;
  
  }
 
 
  li{
    display: inline-flex;
    align-items: center;

    h3{
      font-family: 'Inter', monospace;
      font-size: 15px; 
      color: #becac3;
      max-width: 210px;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
   
  -webkit-box-orient: vertical;
    }


    

  }
   

  a{
    font-size: 13px;
    margin: 0.3em;
    font-size: 12px;
    font-family: 'Inter', monospace;
    color: #becac3;
    font-weight: 900;
    text-transform: uppercase;
  

    &:hover{
      color:#22dd5a;
    }
  }
  
  @media screen and (max-width: 450px) {
     
    .bvc{
      display: none;
    }

     .Mobilebutton{
     display: block;
   }

    .Logo{
    display: none;
    }

  

   .activemobile{
    display: none;
   }
 
   li{
 
     svg,h3{
      display: none;
   
     }
   }
  }
`;

/////////////////////////////////////////////////////////////////


const Button = styled.button`
   margin: 0.4em;
   height: 40px;
   width: 40px;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 50%;

    &:hover{
       background-color: rgba(160, 162, 170, 0.089);

    }

  
  
`;
 
 
