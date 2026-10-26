import { useState } from "react"
import styled from "styled-components"
import * as React from 'react';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { Box, Chip } from '@mui/joy';
import NotificationUI from "@club/components/notification/card.mnc";


 interface Userprops { 
    userId: React.ReactNode;
 }
   
 const typeOptions = [
    "WARN",
    "BAN",
    "UNBAN",
  ];

 
 export default function Banformuser({ userId }: Userprops) {
    const [isopenmenu, setisopenmenu] = useState(false);
    const handleopenmenu = () => setisopenmenu(true);
    const handleclosemenu = () => setisopenmenu(false);
    const [isFormSubmittedNotification, setIsFormSubmittedNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [reason, setReason] = useState('');
    const [admin, setadmin] = useState('');
    const [type, setType] = useState<string[]>([]);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
 
    const handleTypeChange = (event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element> | null, newValue: string[]) => {
        setType(newValue);
    };
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
   
    const buttonStyle = {
      display: reason ? 'block' : 'none',
    };

          const formData = {
            guild_id: '1175857498687807560',
            member_id: userId,
            reason,
            admin: {
              id: 'un',
             tag: admin,
            },
            type: `${type}`,
            created_at: formattedDate,
          };

          const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsFormSubmitted(true);


            const webhookUrl = 'https://discord.com/api/webhooks/1238600462878380072/BR73o-z3Qosp9xSZAXvbRTEX1RsnCvJCJR8YTIBcCCmCLttl_9tUr0GuX348IS-yNP4j'; // Substitua pelo URL do webhook do Discord
        
      // Criação da mensagem embed
      const embed = {
          icon_url: 'https://i.imgur.com/85XgJlr.png',
          title: '🔔 REGISTRO ADMIN ',
          description: 'Para analise. <@&1043283893438140497> ',
          fields: [
              {
                  name: '```🔍 ID do usuário ```',
                  value: userId,
              },
              {
                  name: '```Registro: ```',
                  value: `${type}`,  // Aqui está o valor da adesão
              },

              { 
                  name: '```REASON ```',
                  value: reason,
              },
          ],
          footer: {
              text: 'Powered by novision',
              icon_url: 'https://i.imgur.com/85XgJlr.png',
          },
      };
  
      // Criação do objeto de dados para envio do formulário
      const formDataWebhook = new FormData();
      formDataWebhook.append('payload_json', JSON.stringify({ embeds: [embed] }));
  
      // Envio do formulário para o Discord via webhook
      await fetch(webhookUrl, {
          method: 'POST',
          body: formDataWebhook,
      });

       
            try {
                const response = await fetch('/api/_v4/ban_user', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });
        
        
              if (response.status === 200) {
                //setResponseMessage(response.data);
                setIsFormSubmittedNotification(true);
                setTimeout(() => {
                    setIsFormSubmittedNotification(false);
                }, 5000);
                setNotificationMessage('Log de moderação salvo com sucesso!');
              } else {
                setResponseMessage('');
                setIsFormSubmittedNotification(true);
                setTimeout(() => {
                    setIsFormSubmittedNotification(false);
                }, 5000);
                setNotificationMessage('Erro ao salvar o log de moderação.');
              }
            } catch (error) {
              setResponseMessage('');
              setIsFormSubmittedNotification(true);
              setTimeout(() => {
                  setIsFormSubmittedNotification(false);
              }, 5000);
              setNotificationMessage('Erro ao salvar o log de moderação.');
              console.error('Erro ao salvar o log de moderação:', error);
            } finally {
              setIsFormSubmittedNotification(false);
              setIsFormSubmitted(false);
            }
          };
          
    
    return (
      <>
        <ButtonCLick onClick={handleopenmenu} className={isopenmenu ? "navbar-active" : ""} >
          <i className="fi fi-br-ban" /> 
          <h1>Punir</h1>
        </ButtonCLick>
  
        {isopenmenu && (
          <>
            <Wrraper>
          
              <CardContainer>
                <Content>
               
     
              <FormMargin onSubmit={handleSubmit}>
            
            <Margindls>
       {/* <Select
  color="neutral"
  placeholder="tipo de punição"
  size="sm"
  variant="soft"
  value={type}
  onChange={handleTypeChange}
  multiple
  renderValue={(selected: any) => (
    <Box sx={{ 
        backgroundColor: '#141414', 
        display: 'flex', 
        gap: '0.25rem',
       }}>
      {selected.map((selectedOption: any) => (
        <Chip
          sx={{
            backgroundColor: '#141414', // Cor de fundo do Chip mais escura
            color: '#e1e0ebfff', // Texto branco
            '&:hover': {
                color: '#08090a',
                backgroundColor: '#19f35a', // Cor de fundo do Option mais escura ao passar o mouse
              },
 
          }}
          variant="soft"
          color="primary"
          //key={selectedOption.label}
        >
          {selectedOption.label}
        </Chip>
      ))}
    </Box>
  )}
  sx={{
    maxWidth: '93em',
    backgroundColor: '#151416', // Cor de fundo mais escura
    color: '#b5bdc7', // Texto branco
    borderRadius: '12px',// Borda arredondada

    '&:hover': {
        color: '#d8dde2',
        backgroundColor: '#151416', // Cor de fundo do Option mais escura ao passar o mouse
      },

    '&:focus': {
        color: '#d3d6d8',
        backgroundColor: '#151416', // Cor de fundo do Option mais escura ao passar o mouse
      },
 
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#151416', // Cor da borda mais escura
    },
    '& .Mui-focused': {
      borderColor: '#151416', // Cor da borda quando focado
    },
    '& .MuiChip-root': {
      backgroundColor: '#16f847', // Cor de fundo do chip mais escura
      color: '#0e0c0c', // Texto branco
    },
    '& .MuiChip-root:hover': {
      backgroundColor: '#19f35a', // Cor de fundo do chip mais escura ao passar o mouse
    },
    [`& .${selectClasses.indicator}`]: {
      transition: '0.2s',
      [`&.${selectClasses.expanded}`]: {
        transform: 'rotate(-180deg)',
      },
    },
    '& .MuiListItem-root.Mui-selected, & .MuiListItem-root.Mui-selected:hover': {
      backgroundColor: '#19191d', // Cor de fundo do Option mais escura
      color: '#fff', // Texto branco
    },
  }}
  slotProps={{
    listbox: {
      sx: {
        width: '12%',
        zIndex: '28363',
        backgroundColor: '#19191d',
      },
    },
  }}
>
  {typeOptions.map(option => (
    <Option
      sx={{
        backgroundColor: '#19191d', // Cor de fundo do Option mais escura
        color: '#cacdd1', // Texto branco

        '&:first-child': {
            color: '#e3e8ee', 
            borderRadius: '21px',
            backgroundColor: '#131314', // Cor de fundo do Option mais escura ao passar o mouse
          },

        '&:nth-child(n)': {
            color: '#e3e8ee', 
            borderRadius: '2px',
            backgroundColor: '#1f1f24', // Cor de fundo do Option mais escura ao passar o mouse
          },

        '&:hover': {
          color: '#121314',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 33, 33, 0.603)', // Cor de fundo do Option mais escura ao passar o mouse
        },
 
      }}
      value={option}
      key={option} 
    >
      {option}
    </Option> 
  ))} 
</Select>  */}
               

                  <SearchLabel>
                <i className="fi fi-sr-pencil" />
                <SearchUsers
                 name="text"
                 type="text" 
                 value={admin} 
                 onChange={(e) => setadmin(e.target.value)}
                 placeholder="Nome do administrador"
                />
               </SearchLabel>
               
               </Margindls> 
          
<TextField 
                  name="reason" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason"
                  />
              
<Button type="submit" style={buttonStyle} disabled={isFormSubmitted}>
                      {isFormSubmitted ? <i className="fi fi-rr-loading" /> : 'Salvar'}
                    </Button>

                    <Button onClick={handleclosemenu}>
                      Cancelar
                    </Button>
              </FormMargin> 


              {isFormSubmittedNotification && (
 <NotificationUI message={notificationMessage || responseMessage} />
    )}
    
                </Content>
              </CardContainer>
            </Wrraper>
          </>
        )}
      </>
    );
  }

//// 
 
 
const ButtonCLick = styled.button`
background-color: rgba(90, 90, 95, 0.13);
border: none;
transition: 0.5s all;
border-radius: 22px;
margin: 0.4em;
padding: 0.5em 1em 0.5em;
font-size: 20px;
display: flex;
align-items: center;
color: #86868f;

h1{
    margin-left: 10px;
   font-size: 16px;
   font-family: 'Roboto', sans-serif;
   font-weight: 400;
   margin-top: -0.1em;
}

i{
    font-size: 22px;
    color: rgba(202, 202, 211, 0.116);;
}


&:hover{
    background-color: rgba(173, 173, 179, 0.151);

    i{
        color: #cacace;
    }
}


`;
const FormMargin = styled.form`
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(14, 14, 15, 0.884);
    padding: 1em;
    width: 100%;
    height: 80%;
    border-radius: 14px;
    
`;


const Margindls = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  z-index: 19993;
  flex-wrap: wrap;  
  justify-content: space-between;
`;
const Button = styled.button`
 
  background-color: rgba(53, 53, 58, 0.103);
  padding: 1em 2em 1em;
  border-radius: 64px;
  color: #88888f;
  margin: 0.8em;
 
  width: 100%;
  font-family: 'Poppins', sans-serif;
  font-size: 13px;
  transition: 0.8s all;
   
  :hover{
    position: relative;
    top: -2px;
    transition: 0.8s all;
 
  }
`;

 

const TextField = styled.textarea`
 background-color: rgba(51, 51, 54, 0.089);
  max-width: 100%;
  min-width: 100%;
  min-height: 14em;
  margin: 0.7em;
  max-height: 14em;
  padding: 8px;
  font-size: 13px;
  border: 2px solid rgba(31, 31, 34, 0.274);
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


 

///

const Content = styled.div`
 
   h1{
    text-align: center;
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    color: #e4e4ece4;
    }

    hr{
        margin-top: 1em; 
        margin-bottom: 1em;
        width: 100%;
        border-top: 1px solid #555555;
    }
`;

/// 
const ButtonCLickClose = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: rgba(203, 203, 214, 0.199);
    border: 2px solid #555555;
    height: 35px;
    width: 35px;
    border-radius: 50%;
    border: none;
    color: #08080a;
    font-family: 'Inter', monospace;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: 0.3s;
    &:hover{
        color: #626865;
    }
`;


/// 

const Wrraper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(4, 4, 8, 0.425);
    backdrop-filter: blur(13px);
    border-radius: 22px;
 z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
`;

 

const CardContainer = styled.div`
   
   
   border-radius: 12px;
   padding: 1em 2em 1em;
   display: flex;
   display: flex;
   justify-content: center;
   align-items: center;
   flex-direction: column;
`;


//// 

const SearchLabel = styled.label`
 
 background-color: rgba(51, 51, 54, 0.089);
  width: 100%;
  height: 3em;
  font-size: 16px;
  margin: 0.7em;
  border-radius: 34px;
  color: #d1d1d6;
  padding: 1.5em 1em 1.3em;
  font-family: 'Poppins', Courier, monospace;

    display: flex;
    align-items: center;
    flex-direction: row;


    i{
        color: rgba(202, 202, 211, 0.116);
        font-size: 22px;
    }
`;

const SearchUsers = styled.input`
  background-color: transparent;
  width: 18em;
  height: 3em;
  padding: 8px;
  font-size: 14px;
  border: none;
  border-radius: 14px;
  color: #d3d3dd;
  margin-top: -0.4em;
  font-family: 'Roboto', sans-serif;
 
  :focus{
    outline: none;
  }

  
  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Roboto', sans-serif;
     color: #d3d3df;
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
  -webkit-text-fill-color: #dadae6 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: pointer;
}

`;