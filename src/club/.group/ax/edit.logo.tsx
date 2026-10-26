
import Image from "next/image";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import NotificationUI from '@club/components/notification/card.mnc';
 

interface NewPost {
    image: File | null;
}

 
export default function PageEditlogoCla ({id, Close} : {id: string, Close: React.ReactNode}) {
     
  const [responseMessage, setResponseMessage] = useState('');
  const [NotificationK, setNotificationK] = useState(false);

    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState<NewPost>({
        image: null,
      });


      const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
      fileInputRef.current?.click();
    };
  
    const [fileType, setFileType] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const isImageAttached = imageUrl.image !== null && imageUrl.image !== undefined;
  
    const handlePreviewClick = () => {
      setSelectedFile(null);
      setFileType('');
    };

    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
    const isFormValid = imageUrl ;
    const buttonStyle = {
    display: isFormValid ? 'block' : 'none',
   };



    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
  
          // Check file size
          const maxSize = 20 * 1024 * 1024; // 20 MB
          if (file.size > maxSize) {
              alert("File is too large, please select a file less than 20MB.");
              e.target.value = ""; // Clear the input
              return;
          }
  
          setImageUrl({ ...imageUrl, image: file });
          setFile(file);
          setSelectedFile(file);
          setFileType(file.type || '');
      }
      // Continue with your file processing if needed
  };


 
  const handleremoviimg = () =>  {
    setImageUrl({ ...imageUrl, image: null });
    setFile(file);
    setSelectedFile(file);
    setFileType('');
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const file = imageUrl.image as File; // Obtendo o arquivo da imagem
  
    // Criando um FormData para enviar o arquivo de imagem
    const formData = new FormData();
    formData.append("userId", id);
    formData.append("LogoCla", file); // Anexando o arquivo de imagem
    formData.append("type", 'LogoCla'); // Anexando o arquivo de imagem
   
    try {
      const response = await fetch("/api/cla/edit.brading", {
        method: "POST", // Mudando para POST para enviar o arquivo
        body: formData, // Usando FormData para enviar o arquivo
      });
  
      if (response.ok) {
        setNotificationK(true);
        setResponseMessage('Formulário salvo com sucesso!');
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
        // Define uma flag no Local Storage para indicar que o formulário foi preenchido
        localStorage.setItem("formRegistered", "true");
        // Define o estado para true para evitar a exibição do formulário
        window.location.reload();
      } else {
        console.error("Erro ao salvar o registro:", await response.text());
        setNotificationK(true);
        setResponseMessage('Erro ao salvar o seu registro!');
        setTimeout(() => {
          setNotificationK(false)
        }, 5000);
      }
    } catch (error) {
      setNotificationK(true);
      setResponseMessage("Erro ao salvar o seu registro!");
      setTimeout(() => {
        setNotificationK(false)
      }, 5000);
    }
  };

  
  const renderImagePreview = () => {
    try {
      return (
        <>
         <ContainerFulli onClick={handleremoviimg}>
           
              <Image src={URL.createObjectURL(imageUrl.image as Blob)} height={240} width={240} alt='attached' className="borderrad"/>
      
         
          </ContainerFulli>
        </>
      );
    } catch (error) {
      console.error('Failed to create object URL', error);
      return null;
    }
  };

    return(
        <ContentMarginM>
            <NavRegs>
            {Close}
            </NavRegs>
       

        <form onSubmit={handleRegistration}>

  {isImageAttached ? (
      renderImagePreview()
      ) : (
        <>
<CardInputMa onClick={handleClick}>
<li>
             <i className="fi fi-br-upload" />
             <h3>Clique para enviar sua imagem ou logo.</h3>
             
             <ul>
             <p>Max-Size: 20MB</p>
             <span>JPEG,PNG</span>
             </ul>
            </li>


            <ItemS 
         type="file"
         name="file"
         ref={fileInputRef}
         accept="image/jpeg,image/png"
        style={{ display: "none" }}
        onChange={handleFileChange}
        required id="fileInput" 
        />
      </CardInputMa>
       
        </>
      )}
    <MarginRight>
    <AboutInfoCO>
     
{selectedFile && (
             <>
           <MarginView>

           <ButtonCL  
         type="submit"
         style={buttonStyle}
         disabled={isFormSubmitted}>
            {isFormSubmitted ? <i className="fi fi-rs-paper-plane ixma" /> :  <i className="fi fi-rs-paper-plane ixma" />}
       
           </ButtonCL>

 
 
</MarginView>
</>
           )}
      </AboutInfoCO>
    </MarginRight>

  
</form>

{message && (
    <>
     <NotificationUI message={message} />
    </>
  )}
        </ContentMarginM>
    )
}


//////

const NavRegs = styled.nav`
  display: flex;
  justify-content: space-between;
  position: fixed;
  left: 0;
  right: 0;
  top: 10%;
  z-index: 1999;
  margin: 0.8em;

  .logf{
    opacity: 0.2;
  }

  button{
  border-radius: 83px;
  height: 40px;
  width: 40px;
  margin:0.3em;
  background-color: rgba(77, 76, 78, 0.178);
  padding: 0.6em 0.7em 0.4em;
  color: #42474b;
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
 

const CardInputMa = styled.div`
  border: 2px dashed rgba(58, 58, 61, 0.301);
   border-radius: 14px;
   padding: 1em 1em 1em;
   display: flex;
   align-items: center;
   text-align: center;
   justify-content: center;
   width: 800px;
    height:400px; 
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
   position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  z-index: 19999;
  backdrop-filter: blur(30px);
   background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #c5ccc940 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  background-repeat: no-repeat;
  background-size: cover; 
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex; 
  place-items: center;
  justify-content: center;
  align-items: center;
 
  flex-direction: column;
  animation: opacityModl 1s;

  @keyframes opacityModl {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
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
   .borderrad{
    border-radius: 50%;
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