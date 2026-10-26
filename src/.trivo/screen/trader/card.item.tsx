import { useState } from "react";
import styled from "styled-components";
 

interface Prop {
  Item: any;
  click: (id: any) => void;
  isActive: boolean; // Recebe o estado do pai
}
const CardItemView = ({Item, click,isActive} : Prop) => {

   const handleOnClick = () => {
    if (typeof click === "function") {
      click(Item.tokenID);
    } else {
      console.warn("click não é uma função!", click);
    }
  };

  return (
  <Card onClick={handleOnClick}>
    
    <InfoWrapper>
      <Condition>
         {Item.rarity && (
          <>
          {Item.rarity == 'raro' && <span style={{ color: "#f91643" }}>RO</span> }
          {Item.rarity == 'epico' && <span style={{ color: "#9f3ddd" }}>EP</span> }
          {Item.rarity == 'comum' && <span style={{ color: "#9ea5a3" }}>CM</span> }
          </>
         )}
         <span className="text-[#686d6a] text-[9px]">{Item.containerType ? Item.containerType : Item.type ? Item.type : 'Desconhecido'}</span>
         
      </Condition>
       
    </InfoWrapper>
    <ImageWrapper>

      <div className="iuddc">  
    <div className="relative w-full h-full">
       <ItemImage bannerUrl={Item.imagem}  className="img"/>
       </div>
      <HoverEffect className={isActive ? "djdsk  acti" : "acti"}>
       
         <Icn className="bg-[#4ec070]">
           
          {isActive ? (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
            </>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
     
          )}
         
         </Icn>

      </HoverEffect>
      </div>
    </ImageWrapper>
    <ItemName>{Item.nameitem}</ItemName>
    <ItemCategory>  {Item.rarity && (
          <>
          {Item.rarity == 'raro' && <span style={{ color: "#bbce50" }}>★★★</span> }
          {Item.rarity == 'epico' && <span style={{ color: "#37c86f" }}>★★★★★</span> }
          {Item.rarity == 'comum' && <span style={{ color: "#9ea5a3" }}>★</span> }
          </>
         )}  </ItemCategory>
   {Item.rarity == 'raro' && <TopBorder style={{ color: "#bbce50" }}/> }
          {Item.rarity == 'epico' && <TopBorder style={{ color: "#37c86f" }}/> }
          {Item.rarity == 'comum' && <TopBorder style={{ color: "#9ea5a3" }}/> }
    
  </Card>
  )}


export default CardItemView;


const Icn = styled.div`
  padding: 0.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-shadow: 1px 1px 26px #56dc85;

`;

const Card = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 127px;
  height: 180px;
  cursor: var(--f-cursor-pointer);

  background: #212322;
  border-radius: 8px;
  background-size: cover;
  background-position: center;

  @media screen and (max-width: 680px){
    width: 115px;
  height: 180px;
  }
`;

const TopBorder = styled.div`
  position: absolute;
  bottom: -1px;
  height: 26px;
  width: 100%;
  border-bottom: 4px solid;
  border-radius: 8px;
 
  pointer-events: none;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 21px;
  width: 100%;
`;

const Condition = styled.div`
  position: relative;
  z-index: 10;
  margin: 6px 4px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10px;
  color: white;
  display: flex;
  gap: 4px;
`;


const ImageWrapper = styled.div`
  position: relative;
  display: grid;
  flex: 1;
  place-content: center;
  justify-items: center;
  
   .djdsk{
    transform: translate(-50%, -50%);
    opacity: 1;
   }

  .iuddc:hover {
     
    .acti{
      opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    }

    .img{
      transform: translate(-50%, -50%) scale(0.75);
      opacity: 0.25;
    }
  }
`;


interface ViewHeaderProps {
  bannerUrl: string;
}
 
const ItemImage = styled.div<ViewHeaderProps>`
 
 background-repeat: no-repeat;
 background-position: center;
 background-size: 50%;
 position: absolute;
 left: 0;
 right: 0;
 bottom: 0;
 top: 0;
 background-image: ${({bannerUrl }) => `url('${bannerUrl}')`};
 width: 220px;
 height: 180px;
 transform: scale(1);
 z-index: 17;
 display: flex;
 transform: translate(-50%, -50%);
 justify-content: center;
 transition: 1s all;
 transition: transform 0.5s ease-out, opacity 0.5s ease-out;
 

`;
 
const HoverEffect = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
 z-index: 233;
  justify-content: center;
  width:  190px;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
 
  svg{
    min-width: 20px;
    width: 20px;
    height: 20px;
    color: rgb(237, 242, 239);
  }


  
`;

const ItemName = styled.p`
  width: 100%;
  padding: 4px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemCategory = styled.p`
  width: 100%;
  padding: 2px;
  margin-bottom: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
