
import { ChangeEvent, useEffect, useRef, useState } from "react"
import styled from "styled-components";
import axios from 'axios';
import { useRouter } from "next/router";
import Image from "next/image";
import NotificationUI from "@club/components/notification/card.mnc";
import Eventicon from '@/public/icons/event.png'

interface AdsAnnounce {
    _id: string;
    descriptions: string;
    title: string;
    about: string;
    redirect: string;
    thumbnailUrl: string;
  }

  interface NewPost {
    image: File | null;

  }



export default function EventModal ({Close} : {Close: React.ReactNode}) {

  

    const [title, setTitle] = useState('');
    const [About, setAbout] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [DateLanc, setDateLanc] = useState(''); 
    const [isAdsAnnounce, setAdsAnnounce] = useState<AdsAnnounce[]>([]);
    const [descriptions, setDescriptions] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [responseMessage, setNotificationMessage] = useState('');
    const [imageUrl, setImageUrl] = useState<NewPost>({
      image: null,
    });
    const isFormValid = title && imageUrl && About  && descriptions;
    const buttonStyle = {
      display: isFormValid ? 'block' : 'none',
    };



    const [currentStep, setCurrentStep] = useState(1);
    const [ isopenimageadd ] = useState(true);
    const [ isevent, setevent ] = useState(false);


    const handlevent = () => {
      setevent(true)
      setCurrentStep(2)
    }

    useEffect(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
  
      // Formata a data como "day/month/year"
      const formattedDate = `${day}/${month}/${year}`;
  
      setDateLanc(formattedDate);
    }, []);
  

    const fetchVideos = async () => {
      const response = await fetch('/api/ads/event/events');
      const data = await response.json() as any;
      setAdsAnnounce(data);
    };



    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
      fileInputRef.current?.click();
    };
  
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
   
    const handlePreviewClick = () => {
      setSelectedFile(null);
    };
 
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
  
          // Check file size
          const maxSize = 1 * 1024 * 1024; // 1 MB
          if (file.size > maxSize) {
              alert("File is too large, please select a file less than 1MB.");
              e.target.value = ""; // Clear the input
              return;
          }
  
          setImageUrl({ ...imageUrl, image: file });
          setSelectedFile(file);
      }
      // Continue with your file processing if needed
  };
  
    const isImageAttached = imageUrl.image !== null && imageUrl.image !== undefined;
  

    const renderImagePreview = () => {
      try {
        return (
          <>
           <label>
            
           <ItemS 
             type="file"
             name="file"
             ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
            required id="fileInput" 
            />
                <Image 
                src={URL.createObjectURL(imageUrl.image as Blob)} 
                height={200} width={400} alt='attached' className="borderrad"/>
            
           
            </label>
          </>
        );
      } catch (error) {
        console.error('Failed to create object URL', error);
        return null;
      }
    };


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

       const reader = new FileReader();
    reader.readAsDataURL(imageUrl.image as Blob);
    reader.onloadend = async () => {
    const base64Image = reader.result?.toString().split(',')[1];
    
      try {
     const response = await fetch('/api/ads/event/add', {   
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title, 
      thumbnailUrl: base64Image, 
      descriptions, 
      DateLanc, 
      About 
    }),
  });


  const data = await response.json()  as any;

  if (response.ok) {
    setNotificationMessage(`Evento criado com sucesso`);

    setTimeout(() => {
      setIsFormSubmitted(false);
      setNotificationMessage('')
    }, 5000);
    // Redefinir o estado do formulário após o envio bem-sucedido
    setTitle('');
      setThumbnailUrl('');
      setDescriptions('');
      setDateLanc('');
      setAbout('');
      fetchVideos();
   
  } else {
    setNotificationMessage(`Error: ${data.error}`);
  }
} catch (error) {
  setNotificationMessage('Internal Server Error');
} finally { 
  setIsFormSubmitted(true);
}
}
}

    const AdsAnnounceDetails = () => {
       const [Ads, setAds] = useState<AdsAnnounce[]>([]);

       const fetchAds = async () => {
        const response = await fetch('/api/ads/event/events');
        const data = await response.json()  as any;
        setAds(data);
        };
        
        useEffect(() => {
        fetchAds();
        }, [Event]);
      
const handleDeleteAds = async (_id: string) => {
try {
const deleteResponse = await axios.delete(`/api/ads/event/delete?Event=${_id}`);
console.log(deleteResponse.data.message); // Ads deleted successfully
fetchAds()
  } catch (error) {
console.error('Error deleting Ads:', error);
}
};
        return (
          <>
          
        {Ads.map((Ads) => (
          <>
              
                <ContentList key={Ads._id}>    
              <ul>
              <img
                    className="ImageEvent2"
                    src={`data:image/png;base64,${Ads.thumbnailUrl}`}
                    alt="novision video"
                    height={200} width={390} />
                     <li>
              <h3>{Ads.title}</h3>
              <p>{Ads.descriptions}</p>   
              </li> 
              </ul>

              <section>
            
   <ButtonRemov onClick={() => handleDeleteAds(Ads._id)}>
                <h3>Remover evento</h3>
              </ButtonRemov>
              </section>
               
            </ContentList>
              </>
              ))}
          </>
        );
      };

      
  const [isAnnounceserver, setsAnnounceserver] = useState(true);
  const [isInfoserver, setInfoserver] = useState(false);
 
  const HandleOpensAnnounceserver = () => {
   setsAnnounceserver(true);
   setInfoserver(false)
    
  }

  const HandleOpenInfo = () => {
   setsAnnounceserver(false);
   setInfoserver(true)
 
  }
 
    return(
        <>
    
           <ContainerWrapp>
   
        {isAnnounceserver && (
             <>
      
         <ContainerMn>
              <ContentAboutButtons>
           
              {currentStep === 2 && isevent && ( 
          <Mxn>
            <form onSubmit={handleSubmit}> 
         
                  <ContentEvent>
                  
                  <h2 className="h2">VISION EVENT</h2>
   
     
        <Image 
        src={URL.createObjectURL(imageUrl.image as Blob)} 
        height={200} width={400} alt='attached' className="borderrad"/>
   
   
                  <ul>
 
                  <label>
                  <h5>DATA DO EVENTO *</h5>
                  <ButtonIn>
                    
                    <li>
                    <i className="fi fi-rr-calendar-star" />
                      <InputVideo 
               type="text"
               placeholder="Data do evento"
               value={DateLanc}
               onChange={(e) => setDateLanc(e.target.value)}
             /> 
                    </li>

                    <li>
 
              <InputAB 
             type="time"
             placeholder="Horario do evento"
             maxLength={20}
             value={About}
             onChange={(e) => setAbout(e.target.value)}
             required
           />
          <i className="fi fi-sr-clock" />
           </li> 
         
                  </ButtonIn>
        </label>
                 

                    <label>
                  <h5>ASSUNTO DO EVENTO *</h5>
                  <InputThumb 
            type="text"
            placeholder="Sobre o que é o seu evento?"
            maxLength={30}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
                    </label>
      

      
                    <label>
                  <h5>DESCRIÇÃO</h5>
                    <InputTextLi 
            placeholder="Conte às pessoas um pouco mais sobre o seu evento."
            value={descriptions}
            maxLength={200}
            onChange={(e) => setDescriptions(e.target.value)}
            required
              /> 

              </label>

                  </ul>
         
                </ContentEvent>
   
                <Dust>
        
                {Close}

  <ul> 
  <ButtonCon type="submit" 
      disabled={isFormSubmitted}
      style={buttonStyle}
    >
      {isFormSubmitted ? <i className="fi fi-rr-loading" /> : 'Criar evento'}
  </ButtonCon>
  
 
  {currentStep > 1 && (
       <ButtonCon onClick={() => setCurrentStep(1)} type="button">
       <i className="fi fi-br-arrow-left"/>
     </ButtonCon>
      )}
</ul>
      </Dust>
      </form>
          </Mxn>
         )}         

          {currentStep === 1 && isopenimageadd && ( 
            <Mxn>
          <ContentEvent>

         <h2 className="h2">VISION EVENT </h2>
  
         {isImageAttached ? (
      renderImagePreview()
      ) : (
        <>
        <CardInputMa onClick={handleClick}>
            <li>
             <i className="fi fi-br-upload" />
             <h3>Clique para subir uma imagem</h3>
              <p>Max-Size: 1MB</p>
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

       
{selectedFile ? (
          <>
           <h5>IMAGEM DE APRESENTAÇÃO *</h5>
           <ViewSelectI onClick={handlePreviewClick}>
            <h5>{selectedFile.name}</h5>
             <i className="fi fi-sr-trash"/>
            </ViewSelectI>
          </>
       
        ) :null}



<ContentAbout> 
              <ul>
            <p>Adicione uma imagem de representação!</p>

            <h6>Adicione uma imagem com o tamanho igual a 200x400, para que a imagem se encaixe perfeitamente ao card do evento! </h6>
            </ul>

            <Image src={'/icons/imagecs.png'} alt="coinvision" height={100} width={100} />
            </ContentAbout>

          </ContentEvent>
    
          <Dust>
  
  {Close}


<ButtonClick onClick={HandleOpenInfo}
            className={isInfoserver ? "navbar-active" : ""}>
     <span>
         <i className="fi fi-rr-calendar-star" />
        <h4>Eventos</h4>
      </span>
</ButtonClick>
 

  {isImageAttached && (
  <ButtonCon  onClick={handlevent}>
   Proximo
  </ButtonCon>
  )}
 
</Dust>

          </Mxn>
          )}                               
 
                  
              
                </ContentAboutButtons>  
         

                </ContainerMn>

                {responseMessage && (
             <NotificationUI message={responseMessage}/>
                )}
       
          </>
        )}

 
         {isInfoserver && (
         <>
          <ContainerMn>
              <ContentAboutButtons>
           
            
            <Mxn>
          <ContentEvent>

         <h2 className="h2">EVENTOS CRIADOS</h2>
  
         
         <AdsAnnounceDetails />
 
 
          </ContentEvent>
    
          <Dust>
  
  {Close}

      
<ButtonClick onClick={HandleOpensAnnounceserver}
            className={isAnnounceserver ? "navbar-active" : ""}>
    <span>
    <i className="fi fi-sr-add" />
        <h4>Criar</h4>
      </span>
</ButtonClick>
 
</Dust>

          </Mxn>   
                </ContentAboutButtons>  
                </ContainerMn>
         </>
         )}

         
                {responseMessage && (
             <NotificationUI message={responseMessage}/>
                )}
       
           </ContainerWrapp>
       
        </>
    )
}





const ContainerN = styled.div`
width: 100%;
height: 100%;
display: flex;
justify-content: center;
place-items: center;
text-align: center;
flex-direction: column;
margin-top: 5%;

 li{
  margin: 0.9em;

 }

h4{
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  margin-top: 0.8em;
  color: #afb2b4;
}

p{
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 12px;
  margin: 0.4em;
  color: #676a6d;
}
`;

const ContentAbout = styled.div`

   display: flex;
   align-items: center;
   justify-content: space-between;
   
    ul{
      text-align: start;
    }
   h6{
 max-width: 440px;
 font-size: 9px;
 color: #808186ce;
}

p{
 margin-bottom: 0.6em;
 color: #a9abafce;
 font-weight: 300;
 font-size: 15px;
}
`;

const Mxn = styled.div`
 width: 100%;
 height: 100%;
 
`;

const ContainerMn2 = styled.div`
   height: 60vh;
  width: 70vw;
  background-color: rgba(36, 36, 39, 0.151);
  padding: 1em;
  border-radius: 9px;
  overflow-y: auto;
 
 
`;

const ContainerMn = styled.div`
 display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: top;
 
  flex-flow: wrap;
 
  ul{
   display: flex;
   flex-direction: row;
   
  }
 
`;
 

const ContentList = styled.ul`
   background: rgba(17, 17, 19, 0.651);
   margin-bottom: 0.3em;
    border-radius: 18px;
    border-radius: 8px;
   padding: 0.4em 0.6em 0.4em;
  
   ul{
      display: flex;
      align-items: top;
    }
   
    li{
      margin-top: 0.9em;
      width: 97%;
      padding: 0.8em;
      text-align: start;
      border-radius: 9px;
      background-color: rgba(15, 15, 17, 0.712);
    }

    h3{
      color: #dfdfe6;
      width: 100%;
     }

    p{
      font-size: 12px;
      color: #dfdfe6;
    overflow: hidden;
     word-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  
    }
   animation: LisOnline 1s;


   @keyframes LisOnline {
    0%{ opacity: 0;}
    100%{ opacity: 1;}
   }

   .ImageEvent2{
    border-radius: 13px;
 
}

  section{
    justify-content: center;
   display: flex;
   width: 100%;
    

   }
 
`;


const ButtonRemov = styled.button`

   background-color: rgba(97, 25, 25, 0.37);
   padding: 0.7em 1em 0.7em;
   margin-top: 0.5em;
   justify-content: center;
   display: inline-flex;
   align-items: center;
   border-radius: 12px;
   font-size: 15px;
   color: #b2b2bb;

   :hover{
    background-color: rgba(56, 58, 61, 0.082);
   }

   h3{
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #b2b2bb;
   }

   i{
    background-color: rgba(17, 19, 20, 0.863);
    font-size: 12px;
   }
`;


const ContainerS = styled.section`
display: flex;
position: fixed;
top: 15px;
width: 97%;
justify-content: end;
 

.navbar-active{
background-color: rgba(125, 125, 128, 0.171);

 i{
  color: rgba(229, 229, 235, 0.877);
 }
}
`;


const ButtonClick = styled.button`

padding: 0.6em 1em 0.6em;
border-radius: 24px;
border: 1px solid transparent;
transition: 0.8s all;
margin: 0.3em;


span{
 display: flex;
align-items: center;
text-align: left;
flex-direction: row;
}

i{
 font-size: 16px;
  color: #76767e;
}

h4{
 color: #76767e;
 padding-left: 0.3em;
 font-family: 'Poppins', sans-serif;
 font-size: 14px;
}

&:hover{
 background-color: rgba(103, 103, 104, 0.062);
}

`;
//// styled 

const Dust = styled.ul`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   width: 100%;
   padding: 0.5em 1em 0.5em;
   background-color:rgb(12, 12, 14);
`;

 

const ButtonCon = styled.button`
  backdrop-filter: blur(100px);
  background-color: rgba(24, 236, 105, 0.87);
  padding: 0.6em 1em 0.6em;
  border-radius: 52px;
  margin: 0.2em;
  font-family: 'Poppins', sans-serif;
  color: #101011;
  display: flex;
  align-items: center;
 
   `;

 

const InputVideo = styled.input`

  background: transparent ;
  width: 100%;
  padding: 8px;
  font-size: 13px;
  border: none; 
  color: #dfdfe6;
  border-radius: 4px;
  font-family: 'Poppins', Courier, monospace;
  
  :focus{
    outline: none;
  }

  
  ::placeholder {
     font-size: 11px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #dfdfe6;
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
  -webkit-text-fill-color:#dfdfe6 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`;

const InputThumb = styled.input`
  background-color: rgba(15, 15, 17, 0.712);
  width: 100%;
  height: 4em;
  font-size: 13px;
  border: none;
  padding: 1.5em 1em 1.5em;
  border-radius: 9px;
  color: #dfdfe6;
  font-family: 'Inter',  monospace;
  
  :focus{
    outline: none;
  }

  
  ::placeholder {
     font-size: 13px;
     font-weight: 400; 
     font-family: 'Inter',  monospace;
     color: #dfdfe6;
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
  -webkit-text-fill-color: #dfdfe6 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}


`;

const InputAB = styled.input`

background: transparent;
  border: none;
  font-size: 12px;
  max-width: 92px;
  color: #dfdfe6;
  font-family: 'Inter',  monospace;
  
  :focus{
    outline: none;
  }

  
  ::placeholder {
    font-size: 11px;
    color: #dfdfe6;
    font-family: 'Inter',  monospace;
  
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
  -webkit-text-fill-color: #dfdfe6 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`;


const InputTextLi = styled.textarea`

background-color: rgba(15, 15, 17, 0.712);
 border-radius: 12px;
  width: 100%;
  height: 120px;
  padding: 8px;
  font-size: 13px;
  color: #dfdfe6;
  font-family: 'Inter', sans-serif;
  border: 1px solid transparent;
  resize: none;

  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-size: 13px;
  color: #5c5c64;
  font-family: 'Inter', sans-serif;
  }
`;


const ContainerWrapp = styled.div`
  background: radial-gradient(circle, #0b0c0e53 0%, rgba(7, 8, 11, 0.377) 100%), url('/web/hdshfioef.png') !important;
   backdrop-filter: blur(4px);
  background-repeat: no-repeat;
  background-size: cover;      
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  position: fixed;
  z-index: 1999;

display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
overflow: scroll;
transition: 1s all;


   label{
    display: flex;
    align-items: center;
   }
`;


///////////////////////// 
 

 

const ContentEvent = styled.div`
 
 padding: 1em;
 height: 545px;
 overflow-y: auto;
 text-align: center;

.borderrad{
  border-radius: 9px;
  cursor: pointer;
}


.h2{
  font-family: 'Europa Grotesk', monospace;
      font-size: 24px;
      background:  linear-gradient(47deg, #e4d4d7 0%, #434449 1%, #b6b7c4 100%);
    -webkit-background-clip: text;  
    -webkit-text-fill-color: transparent;
      font-family: 'Europa Grotesk';
      margin-bottom: 0.6em;
    }

ul{ 
   
    display: flex;
    flex-direction: column;
    align-items: start;
   
    h4{
        font-size: 11px;
        max-width: 450px;
        color: #dfdfe6;
        font-family: 'Roboto', sans-serif;
    }

    h2{
      font-size: 23px;
      margin-bottom: 0.4em;
    }

    h5{
      color: #70737c;
      font-size: 12px;
      margin-left: 0.3em;
    }

} 

  label{
    width: 100%;
    display: flex;
    align-items: start;
    flex-direction: column;
    margin-bottom: 1em;
  }
 
  i{
    font-size: 19px;
    background-color: rgba(49, 49, 53, 0.089);
    height: 35px;
    border-radius: 8px;
    width: 35px;
    padding: 0.3em;

  }

.ImageEvent{
    border-radius: 13px;
    width: 100%;
    height: 13em;
}

 
.ihg{
  opacity: 0.1;
  filter: saturate(0);
}
`;


const ContentAboutButtons = styled.div`
display: flex;
flex-direction: column;
align-items: center;
background: linear-gradient(330deg, rgba(33,33,38,1) 0%, rgba(14,14,15,1) 100%);
width: 440px;
height: 600px;
margin: 0.8em;
margin-bottom: 0;
border-radius: 5px;

p{
font-size: 10px;
color: #dfdfe6;
font-family: 'Roboto', sans-serif;
font-weight: 500;
max-width: 300px;
}

`;

const ButtonIn = styled.div`
width: 100%;
display: flex;
justify-content: space-between;
flex-direction: row;
align-items: center;
font-family: 'Poppins', sans-serif;
color: #dfdfe6;
background-color: rgb(18, 18, 20);
border-radius: 8px;
padding: 0.9em 1em 0.9em;
margin: 0.9em;
margin-left: 0;
font-size: 11px;


li{
display: flex;
 
align-items: center;
}

`;

/////////////////////////////////
 

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
 margin-left:0;
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


 
  

const CardInputMa = styled.div`
   border: 2px dashed rgba(58, 58, 61, 0.301);
   border-radius: 14px;
   padding: 1em 1em 1em;
   display: flex;
   align-items: center;
   justify-content: center;
   width: 100%;
   margin-bottom: 2em;
    height: 230px; 
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
