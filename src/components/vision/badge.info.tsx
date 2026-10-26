import styled from "styled-components";
import Image from 'next/image';
import { StaticImageData } from 'next/image';

/// IMAGE 
import Unbadge from '@/public/icons/badges/unbadge.png'
import Bronze from '@/public/icons/badges/bronze.png'
import Prata from '@/public/icons/badges/prata.png'
import Gold from '@/public/icons/badges/gold.png'
import Platinum from '@/public/icons/badges/platinum.png'
import Diamante from '@/public/icons/badges/diamante.png'
import Master from '@/public/icons/badges/master.png'



interface Props {
    value: number;
}

interface BadgeImageMap {
    [key: string]: StaticImageData;
}

 
const badgeImages: BadgeImageMap = {
    Unbadge: Unbadge,
    Bronze: Bronze,
    Prata: Prata,
    Gold: Gold,
    Platinum: Platinum,
    Diamante: Diamante,
    Master: Master
};

const BadgeInfo: React.FC<Props> = ({ value }) => {
    let badgeLevel: string;
    
    if (value >= 0 && value <= 1) {
        badgeLevel = 'Unbadge';
    } else if (value >= 2 && value <= 7) {
        badgeLevel = 'Bronze';
    } else if (value >= 8 && value <= 21) {
        badgeLevel = 'Prata';
    } else if (value >= 22 && value <= 37) {
        badgeLevel = 'Gold';
    } else if (value >= 38 && value <= 69) {
        badgeLevel = 'Platinum';
    } else if (value >= 70 && value <= 100) {
        badgeLevel = 'Diamante';
    } else {
        badgeLevel = 'Master';
    }

    const badgeImage = getBadgeImage(badgeLevel);

    return (
        <Container>
            <Content>
                <Image src={badgeImage.src} alt="badgelevel" height={60} width={60} />
              <span>
              <h1 className="h1">{badgeLevel}</h1>
              </span>
         </Content>
        </Container>
    )
}


// Função para obter a imagem do distintivo com base no nível
function getBadgeImage(badgeLevel: string): StaticImageData {
    return badgeImages[badgeLevel];
}

export default BadgeInfo;
// sty

const Container = styled.div`
  margin-top: 0.8em;
`;


const Content = styled.div`
   display: inline-flex;
   align-items: center;

  .h1{
    font-family: 'Vultra';
    color: silver;
    padding-top: 0.7em;
    padding-left: 0.5em;
  }

  span{
  
  }
`;