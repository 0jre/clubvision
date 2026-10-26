import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CardVisionPost from "../../dashboard/foryou/card.post";
import Image from "next/image";
import { UserData } from '@/types/user/types';
import NotificationUI from '@club/components/notification/card.mnc';
import StudioPlayer from '../container/player/studio.player';

interface NewPost {
    video: File | null;
    thumbail: File | null;
    description: string;
    title: string;
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

export default function VideoVisionAdd ({activecontract} : Props) {
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [title, settitle] = useState('');
    const [videourl, setvideourl] = useState('');
    const [imageUrl, setImageUrl] = useState<NewPost>({
        video: null,
        thumbail: null,
        description: '',
        title: '',
      });

     
      const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
      const [isValidUrl, setIsValidUrl] = useState(true);
    
      const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setvideourl(url);
    
        // Expressão regular para verificar se a URL tem um arquivo de vídeo no final
        const urlRegex = /^.*\.(mp4|webm|mov|avi|mkv)$/i;
        const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
        setIsValidUrl(urlRegex.test(url) || youtubeRegex.test(url));
    };
    
   

      const isFormValid = imageUrl && videourl && title && description;
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
      setImageUrl({ ...imageUrl, thumbail: null });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
  
          // Check file size
          const maxSize = 500 * 1024 * 1024; // 500 MB
          if (file.size > maxSize) {
              alert("File is too large, please select a file less than 500MB.");
              e.target.value = ""; // Clear the input
              return;
          }
  
          setImageUrl({ ...imageUrl, thumbail: file });
          setThumbail(true);
          setFile(file);
          setSelectedFile(file);
          setFileType(file.type || '');
      }
      // Continue with your file processing if needed
  };
  
  
    const isImageAttached = imageUrl.thumbail !== null && imageUrl.thumbail !== undefined;
  
    const [isvideoPlayer, setVideoPlayer] = useState(false);
    const [isThumbail, setThumbail] = useState(false);
    

     const handleVideoClick = () => {
      setVideoPlayer(true);
      setThumbail(false);
     }

     const handleThumbailClick = () => {
      setVideoPlayer(false);
      setThumbail(true);
     }

    const renderImagePreview = () => {
      try {
        return (
          <>

          
        {isThumbail &&(
        <Image src={URL.createObjectURL(imageUrl.thumbail as Blob)} height={400} width={800} alt='attached' className="borderrad"/>
        )}
          
      {isvideoPlayer && (
  <>
    {videourl && isValidUrl ? (
      <StudioPlayer 
        videoPath={videourl} 
        videotitle={title} 
        onClose={() => {
          throw new Error("Function not implemented.");
        }}
      />
    ) : (
      <CardInputMa onClick={handleClick}>
        <li>
          <i className="fi fi-br-upload" />
          <h3>Adicione a URL do vídeo</h3>
          <p>TheNoVision</p>
          <span>Arquivo suportado: Vídeos</span>
        </li>
      </CardInputMa>
    )}
  </>
)}
           

          </>
        );
      } catch (error) {
        console.error('Failed to create object URL', error);
        return null;
      }
    };
  
 
    const loadingMessages = [
      "Carregando vídeo...",
      "Verificando condições...",
      "Realizando o pagamento...",
      "verificando Chave vision...",
      "Última verificação...",
      "Postagem realizada...",
    ];
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsFormSubmitted(true);
    
      try {
        // Exibir mensagens de loading
        for (let i = 0; i < loadingMessages.length; i++) {
          setMessage(loadingMessages[i]);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula tempo para cada etapa
        }
    
        // Criar FormData para enviar a thumbnail como arquivo
        const formData = new FormData();
        formData.append('description', description);
        formData.append('title', title);
        formData.append('userId', userInfo?.user.id || '');
        formData.append('videourl', videourl);
   
        formData.append('likes', '0');
        formData.append('comments', JSON.stringify([]));
    
        if (imageUrl.thumbail) {
          formData.append('PasVideo', imageUrl.thumbail); // Envia a thumbnail como arquivo
        }
    
        const response = await fetch('/api/video/videoX/vision.video', {
          method: 'POST',
          body: formData, // Enviar como FormData
        });
    
        if (response.ok) {
          setMessage('Postagem feita com sucesso');
        } else {
          setMessage(`Erro: ${(await response.json()).error}`);
        }
      } catch (error) {
        console.error('Erro ao enviar o formulário:', error);
        setMessage('Erro interno no servidor');
      } finally {
        setIsFormSubmitted(false);
        setMessage('');
        setvideourl('');
        setImageUrl({
          video: null,
          thumbail: null,
          description: '',
          title: '',
        });
        settitle('');
        setDescription('');
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
        <h3>VisionVideo </h3>
       <p>Adicione seus videos de momentos incriveis em thenovision, e deixe registrado para todos saberem!!</p>
    </TitleUpload>
    
    

<ClickMarginVideo>
  <ButtonclickS3 onClick={handleThumbailClick} className={isThumbail ? "active" : ""}>
     {isImageAttached ? <i className="fi fi-sr-badge-check check"/> : <i className="fi fi-sr-file-image" />} 
     <h4>Thumbnail</h4>
   </ButtonclickS3>

   <ButtonclickS3 onClick={handleVideoClick} className={isvideoPlayer ? "active" : ""}>
   {videourl && isValidUrl  ? <i className="fi fi-sr-badge-check check"/> : <i className="fi fi-sr-file-video" />}
      <h4>Video url</h4>
   </ButtonclickS3>

</ClickMarginVideo>


   
   {isImageAttached ? (
      renderImagePreview()
      ) : (
        <>
<CardInputMa onClick={handleClick}>
            <li>
             <i className="fi fi-br-upload" />
             <h3>Clique para subir thumbnail</h3>
              <p>Max-Size: 1MB </p>
              <span>Arquivo suportado : Images </span>
            </li>
    
            <ItemS 
         type="text"
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
      <h5>Titulo *</h5>
      <TextTitle
            type="text"
            name="title"
            placeholder="Titulo"
            value={title}
            maxLength={64}
            onChange={(e) => settitle(e.target.value)}
            required
          />


        <h5>Descrição *</h5>
      <TextField 
          placeholder="Descrição do post"
          rows={6}
          maxLength={340}
          name="message" value={description} onChange={(e) => setDescription(e.target.value)} required/>

    {isvideoPlayer && (
      <>
        <section>
            <ul>
              <i className="fi fi-brands-youtube" />
              <h6>Youtube</h6>
            </ul>

             <ul>
              <i className="fi fi-sr-mp4-file" />
              <h6>Video link.mp4</h6>
            </ul>   
            <ul>
              <i className="fi fi-sr-file-video" />
              <h6>webm,mov,avi,mkv</h6>
            </ul>
          </section>
        <ItemSQW
      type="text"
      name="text"
      placeholder="link do video"
      value={videourl}
      onChange={handleVideoUrlChange}
      required
      id="videoLinkInput"
    />
          {!isValidUrl && <p className="color">Por favor, insira uma URL de vídeo válida</p>}
         
      </>
    )}

{selectedFile ? (
          <>
           <h5>Thumbnail *</h5>
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
            <h5>$300,00 ORBS</h5>
           </li>

             )}
        
            </section>
 
           <ButtonCL  
         type="submit"
         style={buttonStyle}
         disabled={isFormSubmitted}>
      {isFormSubmitted ? <i className="fi fi-br-loading ixma" /> :  <i className="fi fi-rs-paper-plane   ixma" />}
       
           </ButtonCL>
          
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

  font-family: 'Poppins', sans-serif;
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
    font-family: 'Poppins', sans-serif;
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
  color: rgba(76, 76, 78, 0.384);
  font-family: 'Poppins', sans-serif;
  margin: 0.1em;
  font-size: 9px;
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


const ItemSQW = styled.input`
 
 background-color: rgba(55, 55, 56, 0.096);
  width: 400px;
  height: 4em;
  margin: 0.1em;
  font-size: 14px;
  border: none;
  border: 2px solid rgba(66, 66, 70, 0.438);
  border-radius: 24px;
  color: #71717595;
  padding: 1.5em 1em 1.5em;
   margin-bottom: 0.3em;
  font-family: 'Poppins', Courier, monospace;
 
  
  :focus{
    outline: none;
  }

  
  ::placeholder {
     font-size: 14px;
     font-weight: 700;
     font-family: 'Roboto', sans-serif;
     color: #4c4c5394;
  }
  
  :focus {
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
  -webkit-text-fill-color: #ffffff96 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
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
  font-family: 'Poppins', sans-serif;

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
 
 .color{
  color: #a9acad;
 }


 section{
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  ul{
    display: flex;
  
    align-items: center;

    i{
      color: #848a8d;
    }

    h6{
      color: #848a8d;
      padding-left: 0.4em;
      margin-top: -0.2em;
    }
  }
 }
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





const ButtonclickS3 = styled.div`
   cursor: pointer;
   border-radius: 25px;
  padding: 0.3em 1em 0.2em;
  margin: 0.1em;
  display: flex;
  align-items: center;
  background-color: rgba(24, 24, 26, 0.233);
  border: 2px solid rgba(24, 24, 26, 0.233);
  
  h4{
    margin: 0.3em;
    color: #d9d9df;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    margin-top: -0.1em;
   }

  i{
    color: #959ca3;
  }

  .check{
    color: #5bf55b;
  }
 
  &:hover{
    border: 2px solid #5bf55b;
    
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

 
`;


const TextTitle = styled.input`
  
  background-color: transparent;
  width: 400px;
  height: 4em;
  margin: 0.1em;
  font-size: 14px;
  border: none;
  border: 2px solid rgba(66, 66, 70, 0.438);
  border-radius: 24px;
  color: #ffffff96;
  padding: 1.5em 1em 1.5em;
   margin-bottom: 0.3em;
  font-family: 'Poppins', Courier, monospace;
 
  
  :focus{
    outline: none;
  }

  
  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #ffffff96;
  }
  
  :focus {
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
  -webkit-text-fill-color: #ffffff96 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`;


const ClickMarginVideo = styled.div`
  margin: 0.8em;
  display: flex;
  align-items: center;
  flex-direction: row;

   .active{
    border: 2px solid #5bf55b;
  }
`;