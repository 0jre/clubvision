import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { UserData } from "@/types/user/types";
import NotificationUI from "@club/components/notification/card.mnc";

interface NewPost {
    image: File | null;
  }


async function fetchUserInfo(): Promise<UserData> {
    const response = await fetch('/api/autentic/searchuser');
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário.');
    }
    const data = await response.json();
    return data;
  }

  
interface Props {
  activecontract: React.ReactNode;
}
export default function PostVisionAdd ({activecontract} : Props) {
    const [description, setDescription] = useState('');
    const [loadingpost, setloadingpost] = useState(false)
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState<NewPost>({
        image: null,});

      const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
      const isFormValid = imageUrl && description;
      const buttonStyle = {
      display: isFormValid ? 'block' : 'none',
     };
  

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
      fileInputRef.current?.click();
    };
  
    const [fileType, setFileType] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [file, setFile] = useState<File | null>(null);
    
    const handlePreviewClick = () => {
      setSelectedFile(null); 
      setFileType('');  
      setFile(null);  
      setImageUrl({ ...imageUrl, image: null });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
  
          // Check file size
          const maxSize = 15 * 1024 * 1024; // 15 MB
          if (file.size > maxSize) {
              alert("File is too large, please select a file less than 1MB.");
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
  
    const isImageAttached = imageUrl.image !== null && imageUrl.image !== undefined;
  
    const [OpenFullimage, setOpenFullimage] = useState(true);
    const [ImageSET, setImageSET] = useState(false);
    
    const handleOpenImage = () => {
        setOpenFullimage(true);
        setImageSET(false)
    }

    const handleOpenImageOp = () => {
        setOpenFullimage(false);
        setImageSET(true)
    }

    const renderImagePreview = () => {
      try {
        return (
          <>
           <ContainerFulli>
            
            {OpenFullimage && (
                <Image src={URL.createObjectURL(imageUrl.image as Blob)} height={400} width={800} alt='attached' className="borderrad"/>
            )}
           
            {ImageSET && (
            <Image src={URL.createObjectURL(imageUrl.image as Blob)} height={500} width={500} alt='attached' className="borderrad" />
            )}
            </ContainerFulli>
          </>
        );
      } catch (error) {
        console.error('Failed to create object URL', error);
        return null;
      }
    };
  
    const loadingMessages = [
      "Carregando imagem...",
      "Verificando condições...",
      "Realizando analise...",
      "Realizando pagamento...",
      "Verificando chave vision...",
      "Última verificação...",
      "Postagem realizada...",
    ];
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsFormSubmitted(true);
    
      if (imageUrl.image) {
        try {
          // Exibir mensagens de loading
          for (let i = 0; i < loadingMessages.length; i++) {
            setMessage(loadingMessages[i]);
            await new Promise((resolve) => setTimeout(resolve, 1000));  // Simula tempo para cada etapa
          }
    
          // Criação do FormData para enviar a imagem como arquivo
          const formData = new FormData();
          formData.append('description', description);
          formData.append('userId', userInfo?.user.id || ''); // Verifica o ID do usuário
          formData.append('image', imageUrl.image); // Envia a imagem diretamente
    
          // Envia a requisição para a API
          const response = await fetch('/api/nvxre/postvision/gnvxpost', {
            method: 'POST',
            body: formData,  // Envia o FormData com a imagem
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setMessage('Postagem feita com sucesso');
    
            // Redefine o estado após o sucesso
            setTimeout(() => {
              setIsFormSubmitted(false);
              setMessage('');
            }, 5000);
    
            setDescription(''); // Limpa a descrição
          } else {
            setMessage(`Erro: ${data.error}`);
          }
        } catch (error) {
          console.error('Erro ao enviar o formulário:', error);
          setMessage('Erro no servidor');
        } finally {
          // Finaliza o estado do formulário
          setIsFormSubmitted(false);
          setMessage('');
          setImageUrl({
            image: null,
          });
          setDescription('');
        }
      } else {
        setMessage('Imagem não anexada.');
      }
    };
    

    const [userInfo, setUserInfo] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
   
    useEffect(() => {
      let isMounted = true;
  
      fetchUserInfo()
        .then((data) => {
          if (isMounted) {
            setUserInfo(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
  
      return () => {
        isMounted = false;
      };
    }, []);
  
    if (!userInfo) {
      return (
        <>
      
        </>
      );
    }

    
    return(
        <>
       <ContainerXPloreAD>
  <form onSubmit={handleSubmit}>
  

   <ContentMarginM>
    
    <MarginLeft>
    <TitleUpload>
        <h3>PostVision</h3>
       <p>Adicione imagem de algum momento incrivel em thenovision, e deixe registrado para todos saberem!!</p>
    </TitleUpload>
      

    {isImageAttached ? (
      renderImagePreview()
      ) : (
        <>
<CardInputMa onClick={handleClick}>
            <li>
             <i className="fi fi-br-upload" />
             <h3>Clique para subir uma imagem</h3>
              <p>Max-Size: 15MB</p>
              <span>JPG,PNG,AVIF,IMAGES</span>
            </li>

            <ItemS 
         type="file"
         name="file"
         ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
        required id="fileInput" 
        />
      </CardInputMa>
       
        </>
      )}

   
    </MarginLeft>
     
    <MarginRight>
        <h5>Usuario*</h5>
      <CardInfouser>
        <li>
        <Image src={userInfo.user.avatar} alt={userInfo.user.username} height={70} width={70} className="logo"/>
        <h3>{userInfo.user.name}</h3>
        </li>
        <i className="fi fi-sr-circle-user" />
      </CardInfouser>
      <p>Sua postagem sera vinculada com sua conta {userInfo.user.username}</p>

      <AboutInfoCO>
        <h5>Descrição*</h5>
      <TextField 
          placeholder="Descrição do post"
          rows={6}
          maxLength={340}
          name="message" value={description} onChange={(e) => setDescription(e.target.value)} required/>


{selectedFile ? (
          <>
           <h5>Arquivo *</h5>
           <ViewSelectI onClick={handlePreviewClick}>
            <h5>{selectedFile.name}</h5>
             <i className="fi fi-sr-trash"/>
            </ViewSelectI>
          </>
       
        ) : (
          <>
         
            <Button  onClick={handleClick}>
            <ItemS 
             type="file"
             name="file"
             ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            required id="fileInput" 
            />
            <i className="fi fi-sr-add-image"/>
            </Button> 
  
        </>
        )}

{selectedFile && (
             <>
           <MarginView>
            <section>
             {activecontract ? activecontract : (
              
            <li className="lis">
            <Image src='/icons/coins/orb-novision.webp' alt="orbs" width={30} height={30}/>
            <h5>-230,00 ORBS</h5>
           </li>

             )}
    
            </section>

     <ul> 
           <ButtonCL  
         type="submit"
         style={buttonStyle}
         disabled={isFormSubmitted}>
            {isFormSubmitted ? <i className="fi fi-br-loading ixma" /> :  <i className="fi fi-rs-paper-plane   ixma" />}
       
           </ButtonCL>

        
{ImageSET ? (
     <ButtonclickS onClick={handleOpenImage}>
      <i className="fi fi-br-expand" />
     </ButtonclickS>
) : (
 <ButtonclickS onClick={handleOpenImageOp}>
   <i className="fi fi-br-tool-crop" />
 </ButtonclickS>
)}
</ul>
</MarginView>
</>
           )}
      </AboutInfoCO>
    </MarginRight>

   </ContentMarginM>

   </form>
   {message && (
         <>
          <NotificationUI message={message} />
         </>
       )}
       </ContainerXPloreAD>
        </>
    )
}



const ContainerXPloreAD = styled.div`
   height: 100%;
   overflow-y: auto;

   .borderrad{
    border-radius: 12px;
   }

`; 

const Button = styled.button`

  border: 3px solid #e4e4e726;
  padding: 0.8em 0.9em 0.8em;
  border-radius: 15px;
  color: #e4e4e758;
  margin: 0.8em;

  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: 0.8s all;
  
  
  :hover{
    position: relative;
    top: -2px;
    transition: 0.8s all;
    border-radius: 19px;
    background: rgb(5, 5, 5);

    i{
      color: aliceblue;
    }
  }
`;

//// CARDD POST 


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
 


const ViewSelectI = styled.div`
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 cursor: pointer;
 margin: 0.9em;
  width: 400px;
  height: 40px;
  background-color: #3b42491d;
  padding: 0.3em 1em 0.3em;
  border-radius: 12px;
 
 
   h5{
  color: rgba(138, 137, 143, 0.384);
  font-family: 'Inter', sans-serif;
  margin: 0.1em;
  font-size: 11px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;

 }
 
 i{
    color: #e5e6e71d;
 }

 .ImageSelect{
  border-radius: 14px;
 }
  



 
`;

const ItemS = styled.input`
  display: inline-block;
  background-color: rgba(43, 44, 66, 0.664);
  border: 1px 1px 1px 0px solid rgba(221, 221, 221, 0.021);
  color: #0f0e11;
  padding: 10px 20px; 
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;

  &:hover {
    background-color: rgba(8, 8, 8, 0.849);
  }

  input[type='file'] {
    display: none;
  } 

`;





///// ADD IMAGE 
const TitleUpload = styled.li`
  text-align: left;
  margin-bottom: 0.8em;
   
   h3{
    font-size: 26px;
    font-family: 'Inter', monospace;
    font-weight: 600;
    margin-bottom: 0.4em;
  }

  p{
    font-size: 13px;
    max-width: 500px;
    color: rgb(97, 98, 104);
  }
`;

const CardInputMa = styled.div`
   border: 2px dashed rgba(58, 58, 61, 0.301);
   border-radius: 14px;
   padding: 1em 1em 1em;
   display: flex;
   align-items: center;
   justify-content: center;
   width: 800px;
    height:400px; 
   cursor: pointer;
  

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

`;



const ContentMarginM = styled.div`
   display: flex;
   flex-direction: row;
   align-items: center;
   justify-content: space-evenly;
   margin: 5%;
   margin-top: 3%;
   margin-bottom: 0;
`;


//// MARGIN  

const MarginLeft = styled.div`
   display: flex;
   flex-direction: column;
`;

const MarginRight = styled.div`
   display: flex;
   flex-direction: column;
   width: 440px;
   background-color: rgba(12, 12, 14, 0.281);
   padding: 0.8em 0.4em 0.8em;
   border-radius: 9px;
   margin: 0.9em;

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


///// CONST CARD POST

const CardInfouser = styled.div`
background-color: rgba(24, 24, 26, 0.233);
    padding: 1em 1em 1em;
    border-radius: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0.9em; 
    width: 400px;

    li{
        display: flex;
        align-items: center;
    }

    i{
        font-size: 20px;
        color: #5e5e61;
    }
    h3{
        font-size: 15px;
        color: #e4e4e7;
        margin-left: 12px;
    }

    .logo{
        border-radius: 50%;
        height: 50px;
        width: 50px;
        margin: 0.3em;
    }
`;

const AboutInfoCO = styled.div`
 margin-top: 0.9em;
 
`;


const TextField = styled.textarea`
   
  background-color: transparent;
  max-width: 400px;
  min-width: 400px;
  min-height: 14em;
  max-height: 14em;
  padding: 8px;
  font-size: 13px;
  border: 2px solid rgba(66, 66, 70, 0.438);
  border-radius: 14px;
  color: #ebebf09e;
  padding: 1em 1em 2em;
  font-family: 'Inter', monospace;
  resize: none;
  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-size: 14px;
     font-family: 'Inter', monospace;
     color: #ffffff96;
  }
`;


const ContainerFulli = styled.div`
 
`;

const ButtonclickS = styled.div`
   cursor: pointer;
   border-radius: 25px;
  padding: 8px 4px 2px;
  margin: 0.1em;
  height: 40px;
  width: 40px;
  background-color: #1e1e1f;

  i{
    color: #959ca3;
  }
 
`;

const MarginView = styled.div`
  margin: 0.6em;
  background-color: rgba(61, 61, 66, 0.247);
  padding: 0.6em 0.6em 0.6em;
  border-radius: 13px;
 display: flex;
 flex-direction: column;
 align-items: center;
 



 section{
  display: flex;
 flex-direction: row;
  justify-content: space-evenly;
 align-items: center;
 .lis{
    background-color: rgba(69, 70, 75, 0.13);
  padding: 0.4em 1em 0.4em;
  border-radius: 42px;
  margin: 0.4em;
  display: flex;
  align-items: center;

  h5{
    font-family: 'InterSemiBold', monospace;
    font-size: 14px;
    color: #77797e;
  }
 }
 }


 ul{
  display: flex;
  align-items: center;
 }
`;