import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

 
export default function Pageaddavatar({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false); // Estado de loading
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<{ image: File | null }>({ image: null });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nametvl, setname] = useState('')
  const [imageCost, setImageCost] = useState<number | null>(null); // Estado para o custo da imagem
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openl, setopenl] = useState(false)
  const isImageAttached = imageUrl.image !== null;

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
  
      const maxSize = 20 * 1024 * 1024; // 20MB
      if (file.size > maxSize) {
        setMessage("Arquivo muito grande. Selecione um arquivo menor que 20MB.");
        return;
      }
  
      // Calculando o custo baseado no tamanho da imagem
      const fileSizeInMB = file.size / (1024 * 1024); // Tamanho em MB
      let cost = 1000 + (fileSizeInMB * (80000 - 1000)) / 2 ; // Custo de 1000 a 20000 bits
  
      cost = Math.min(Math.max(1000, Math.round(cost))); // Garantir que o custo fique entre 1000 e 20000
  
      setImageCost(cost); // Atualizando o custo

      setImageUrl({ image: file });
      setSelectedFile(file);
    }
  };

  const handleremoviimg = () => {
    setImageUrl({ image: null });
    setSelectedFile(null);
    setImageCost(null); // Resetando o custo
  };

  const handleRegistration = async (e: React.FormEvent, type: 'faixaclubr' | 'avatarcubr') => {
    e.preventDefault();
  
    if (!imageUrl.image) {
      setMessage("Por favor, selecione uma imagem.");
      return;
    }
  
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("nametvl", nametvl);
    formData.append("type", type);
    formData.append("file", imageUrl.image); // Envia o arquivo diretamente
  
    try {
      const response = await fetch("/api/club/upload", {
        method: "POST",
        body: formData, // Envia o FormData com o arquivo
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        setMessage(`Imagem salva com sucesso! Custo: ${responseData.cost} bits.`);
      } else {
        setMessage(responseData.message || "Erro ao salvar a imagem.");
      }
    } catch (error) {
      setMessage("Erro ao salvar a imagem. Tente novamente mais tarde.");
    } finally {
      setImageUrl({ image: null });
      setSelectedFile(null);
      setImageCost(null); // Resetando o custo
    }
  
    setIsLoading(false);
  };
  

  const formatNumber = (value: number): string => {
    return value.toLocaleString('en-US', {
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
    
  const renderImagePreview = () => {
    try {
      return (
        <ContainerFulli onClick={handleremoviimg}>
          <Image
            src={URL.createObjectURL(imageUrl.image as Blob)}
            height={100}
            width={100}
            alt="attached"
            className="borderrad"
          />
        </ContainerFulli>
      );
    } catch (error) {
      console.error("Erro ao carregar prévia da imagem", error);
      return null;
    }
  };

  return (
    <>
 <CardInputMa2 onClick={() => setopenl(true)}>
       <li>
         <i className="fi fi-br-upload" />

       </li>
     </CardInputMa2>

    {openl && (
      <Warrap>
  <ButtonclickS  onClick={() => setopenl(false)}>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>

  </ButtonclickS>
 <ContentMarginM>
 <form onSubmit={(e) => handleRegistration(e, 'faixaclubr')}>
   {isImageAttached ? (
     renderImagePreview()
   ) : (
     <CardInputMa onClick={handleClick}>
       <li>
         <i className="fi fi-br-upload" />
         <h3>Clique para enviar uma imagem.</h3>
         <ul>
           <p>Max-Size: 20MB</p>
           <span>JPEG, GIF</span>
         </ul>
       </li>

       <ItemS
         type="file"
         name="file"
         ref={fileInputRef}
         accept="image/jpeg, image/gif"
         style={{ display: "none" }}
         onChange={handleFileChange}
         required
         id="fileInput"
       />
     </CardInputMa>
   )}


<label>
   <i className="fi fi-rr-attribution-pen"/>   
   <InputList2
       name="text"
       type="text" 
       autoComplete="off"
       value={nametvl} 
       onChange={(e) => setname(e.target.value)}
       placeholder="Dé um nome legal"
       maxLength={16}
     /> 
     </label>


   {/* Exibe o custo da imagem antes do envio */}
   {isImageAttached && imageCost !== null && (
     <p className="adummb3"> O custo para enviar esta imagem será de {formatNumber(imageCost)} bits.</p>
   )}

   <MarginRight>
     <AboutInfoCO>
       {selectedFile && (
         <MarginView>
            <BadgeContainer type="submit" disabled={isLoading}>
                <BadgeCs> {isLoading ? <i className="fi fi-rs-spinner ixma" /> : <>Carregar faixa</>}</BadgeCs>
              </BadgeContainer>

         </MarginView>
       )}
     </AboutInfoCO>
   </MarginRight>
 </form>

 {message && (
   <div className="cardalert">
     <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" className="w-8 h-8" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
       <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17z"></path>
       <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m250.26 195.39 5.74 122 5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95z"></path>
       <path d="M256 397.25a20 20 0 1 1 20-20 20 20 0 0 1-20 20z"></path>
     </svg>
     <p>{message}</p>
   </div>
 )}
</ContentMarginM>
 
</Warrap>
    )}
    
    </>
  );
}

const Warrap = styled.div`
 position: fixed;
  left: 0;
  top: 0;
  right: 0;
   height: 100%;
   width: 100%; 
   display: flex;
   z-index: 1923;
  justify-content: center;
  place-items: center;
  bottom: 1px;
 background: linear-gradient(204deg, #2425242e -7%, #b85cff00 33%), linear-gradient(162deg, #b2b9b22f -10%, #2c88dd00 25%), linear-gradient(0deg, #171817, #171817);
  
`;


const BadgeContainer = styled.button`
  text-align: center;
  background-color: #c7ceca;
  border-radius: 9999px;
  padding: 0.125rem;
  display: inline-block;
  transition: 1s all;

  &:hover{
     background-color: #409766;
  }
   
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
const InputList2 = styled.input`
  
  background-color:transparent;
   width: 100%;
  height: 2em;
  font-size: 16px;
  border: none;
  color: #9293a0;
  padding: 1.2em 1em 1.5em;
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
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

`;

const ButtonCL = styled.button`

  border-radius: 25px;
  padding: 5px 4px 2px;
  margin: 0.1em;
  height: 40px;
  width: 40px;
  background-color: #1e1e1f;
 
  h5{
    color: #959ca3;
    font-family: 'Inter', sans-serif;
  }

  i{
    color: #959ca3;
  }
 

  
  

  :hover{
    border: 1px solid rgba(106, 109, 122, 0.26);
  }

  .ixma{
    font-size: 18px;
  }
`;
 

  
const ItemS = styled.input`
  display: inline-block;
  background-color: rgba(43, 44, 66, 0.664);
  border: 1px 1px 1px 0px solid rgba(221, 221, 221, 0.021);
  color: #0f0e11;
  padding: 10px 20px; 
  border-radius: 4px;
  cursor:  var(--f-cursor-pointer);
  font-family: 'Inter', sans-serif;

  &:hover {
    background-color: rgba(8, 8, 8, 0.849);
  }

  input[type='file'] {
    display: none;
  } 

`;
 
const CardInputMa2 = styled.div`
border: 2px dashed rgba(58, 58, 61, 0.301);
border-radius: 14px;
padding: 1em 1em 1em;
display: flex;
align-items: center;
text-align: center;
justify-content: center;
width: 90px;
 
 height: 90px; 
cursor:  var(--f-cursor-pointer);


li{
  
 i{
     font-size: 23px;
     background-color: #1e1e1f;
     height: 60px;
     width: 60px;
     padding: 0.4em 0.6em 0.4em;
     border-radius: 70%;
 }

 h3{
   font-size: 13px;
   margin-top: 0.8em;
   text-align: center;

   color: #e4e4e7;
 }

 p{
  font-size: 15px;
  color: #1e1e1f;
 }

 span{
     font-size: 14px;
     color: #404042;
 }
}

ul{
 display: flex;
 align-items: center;
 gap: 8px;
}
`;


const CardInputMa = styled.div`
   border: 2px dashed rgba(58, 58, 61, 0.301);
   border-radius: 14px;
   padding: 1em 1em 1em;
   display: flex;
   align-items: center;
   text-align: center;
   justify-content: center;
   width: 100%;
    height:200px; 
   cursor:  var(--f-cursor-pointer);
  

   li{
     
    i{
        font-size: 23px;
        background-color: #1e1e1f;
        height: 60px;
        width: 60px;
        padding: 0.4em 0.6em 0.4em;
        border-radius: 70%;
    }

    h3{
      font-size: 13px;
      margin-top: 0.8em;
      text-align: center;
   
      color: #e4e4e7;
    }

    p{
     font-size: 15px;
     color: #1e1e1f;
    }

    span{
        font-size: 14px;
        color: #404042;
    }
   }

   ul{
    display: flex;
    align-items: center;
    gap: 8px;
   }
`;



const ContentMarginM = styled.div`
  background: linear-gradient(204deg, #2d2e2d -7%, #b85cff00 33%), linear-gradient(162deg, #2d2e2d -10%, #2c88dd00 25%), linear-gradient(0deg, #191a19, #161616);
  border-radius: 12px;
  padding: 1em;
  width: 40%;
  max-height: 75%;
  border: 2px solid #19191a;
  overflow-y: auto;
  animation: opacityModl 1s;
  text-align: center;
  @keyframes opacityModl {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
  }

  
  .adummb3{
    font-family: 'InterSemiBold', monospace;
    font-size: 13px;
    margin: 0.7em;
    color: #7b7e81;
    
  }


  label{
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-top: 0.9em;
  justify-content: space-between;
background: linear-gradient(204deg, #2d2e2d -7%, #b85cff00 33%), linear-gradient(162deg, #2d2e2d -10%, #2c88dd00 25%), linear-gradient(0deg, #191a19, #161616);
 border: 1px solid #282928;
    border-radius: 12px;
    padding: 0.3em 1em 0.3em;
  width: 100%;
 }

  .cardalert{
    grid-column: span 8 / span 8; 
  border-width: 1px;
  border-color: #252220;
  margin-bottom: 0.9em;
  color: #777370;
  background-color: rgba(48, 51, 50, 0.3); 
  font-size: 0.75rem; 
  display: flex;
  gap: 1rem;
  align-items: center; 
  padding: 0.5rem; 
  border-radius: 0.5rem; 
   
  p{
    width: 240px;
    font-size: 10px;
  }
  svg {
    width: 2rem; 
    height: 2rem; 
  }
  }


`;

 
const MarginRight = styled.div`
   display: flex;
   flex-direction: column;

   h5{
    font-size: 15px;
    color: #e4e4e7;
    margin-bottom: 0.2em;
    text-align: left;
    margin-left: 18px;
   }

   p{
    font-size: 11px;
    color: #343436;
   }
`;
 
const AboutInfoCO = styled.div`
 margin-top: 0.9em;
 
`;

 

const ContainerFulli = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
   img{
     width: 530px;
     height: 40vh;
     border-radius: 22px;
   }


   @media screen and (max-width: 540px) {
    img{
     width: 350px;
     height: 120px;
     border-radius: 22px;
   }

   }
`;

const ButtonclickS = styled.div`
   cursor:  var(--f-cursor-pointer);
   border-radius: 25px;
  padding: 8px 4px 2px;
  margin: 0.1em;
  height: 40px;
  position: fixed;
  right: 9px;
  top: 12px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
 
  
  i{
    font-size: 24px;
    color: #585b5f50;
  }

  &:hover{
    i{
     color: #585b5fb0;
  }
  }
 
`;

const MarginView = styled.div`
  margin: 0.6em;
  background-color: rgba(61, 61, 66, 0.247);
  padding: 0.6em 0.6em 0.6em;
  border-radius: 13px;
 display: flex;
 align-items: center;
 justify-content: space-evenly;
`;