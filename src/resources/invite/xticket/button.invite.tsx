import React, { useState, useEffect } from "react";
import router from "next/router";
import styled from "styled-components";
import { UserData } from "@/types/user/types";
import { UserInfo } from "@/types/discord/usersearch" 
import Image from "next/image";
import Friends from "@/public/icons/invitation.png";

import { decrypt } from "@/core/security/encryption";
import axios from "axios";
import LoadingPageView from "../../loading/market.loading";

interface Prop {
  UserId: string
}

export default function InviteButton({ UserId }: Prop) {
  const [description, setDescription] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [Info, setInfo] = useState<UserData | null>(null);
  const [Cuser, setCuser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const responseInfo = await fetch('/api/autentic/searchuser');
        const dataInfo = await responseInfo.json();
        setInfo(dataInfo);

        const response = await axios.get(`/api/autentic/xyloQuerierAPI?userId=${dataInfo?.user.id}`);
        const dataw = decrypt(response.data.log);
        const parsedDataw = JSON.parse(dataw);
        setCuser(parsedDataw);

        if (parsedDataw) {
          const inviteCheckResponse = await axios.get(`/api/redirect/guest/addinvite?userId=${UserId}`);
          const dataw = decrypt(inviteCheckResponse.data.nvxc);
          const parsedDataw = JSON.parse(dataw);

          if (parsedDataw && parsedDataw.length > 0) {
            // Consolidar mensagens dos convites pendentes
            const invites = parsedDataw.map((invite: any) => {
              return `Convidado por ${invite.ownerinvite} com a descrição "${invite.description}".`;
            });

            setPendingInvites(parsedDataw);
            setModalMessage(invites.join('\n'));
            setModalVisible(true);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, [UserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      UserId: UserId,
      Invite: Cuser?.inviteCode,
      ownerinvite: Info?.user.username,
      description,
      ownerAvatar: Info?.user.avatar,
      nickname: Info?.user.username,
    };

    try {
      const response = await fetch('/api/redirect/guest/addinvite', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsFormSubmitted(true);
      } else {
        console.error("Erro ao salvar o formulário:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao salvar o formulário:", error);
    }
  };

  if (loading) {
    return <LoadingPageView />;
  }

  return (
    <>
      {modalVisible && (
        <>
 <MarginIncit>
  <section>
    <h1>Convite Já Enviado</h1>
    <h3>
    O usuário já possui convites pendentes. Para enviar um novo convite, é necessário que ele(a) recuse os convites atuais enviados por:{" "}
      {pendingInvites.map((invite, index) => (
        <>
          {invite.ownerinvite} ({invite.nickname})
          {index < pendingInvites.length - 1 && ", "}
        </>
      ))}
      . Considere convidar outros amigos.
    </h3>
  </section>
</MarginIncit>
        </>
      )}

{modalVisible == false && Cuser !== null && (
        <>
          {Cuser.type ? (
            <Container>
              <Image src={Friends} alt="thenovision" className="imagecenter" />
              <form onSubmit={handleSubmit}>
                <InputTextLi
                  placeholder="Inclua uma mensagem para o destinatário (opcional)"
                  value={description}
                  maxLength={200}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <CardInfor>
                  {Cuser.inviteCode ? (
                    <Invite>
                      <li>
                        <i className="fi fi-sr-ticket-airline" />
                        <h5>{Cuser.inviteCode}</h5>
                      </li>
                    </Invite>
                  ) : (
                    <Invite>
                      <li>
                        <i className="fi fi-sr-lock" />
                        <h5>Você precisa gerar um código</h5>
                      </li>
                    </Invite>
                  )}
                  {Cuser.inviteCode ? (
                    <ButtonCon type="submit" disabled={isFormSubmitted}>
                      {isFormSubmitted ? 'Convidado' : 'Convidar'}
                    </ButtonCon>
                  ) : (
                    <ButtonConS>
                      <i className="fi fi-sr-lock" />
                    </ButtonConS>
                  )}
                </CardInfor>
              </form>
            </Container>
          ) : (
            <CardIndo>
              <i className="fi fi-sr-lock" />
              <h4>Você não tem permissão</h4>
            </CardIndo>
          )}
        </>
      )}
    </>
  );
}

const MarginIncit = styled.div`
  background-color: rgba(112, 28, 28, 0.13);
  border-radius: 12px;
  padding: 20px;
  color: #333;
  font-family: 'InterSemiBold', monospace;
  width: 100%;
  margin: 20px auto;

  h1 {
    font-size: 16px;
    margin-bottom: 10px;
    color: #cec3c3;
  }

  h3 {
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 15px;
    color: #8a8282;
    text-align: justify;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
 
  section {
    display: flex;
    flex-direction: column;
    text-align: start;
  }
`;

const Container = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
position: relative;
align-items: center;
text-align: center;
width: 100%;
padding: 0.8em 1em 0.8em;

`;

const CardIndo = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100%;

   margin-bottom: 10%;

    i{
      font-size: 3em;
      color: #8e9297;
    }

   h4{
      color: #15ca67;
      font-size: 1.5em;
      font-family: 'Poppins', sans-serif;
   }

`;

const Invite = styled.div`

backdrop-filter: blur(100px);
  background-color: rgba(252, 252, 255, 0.034);
  height: 3em;
  
  font-size: 14px;
  border: none;
  border-radius: 81px;
  margin: 1em;
  color: #6e6f75;
  padding: 1.5em 1em 1.5em;
  font-weight: 500;
  font-family: 'Poppins', Courier, monospace;
  display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
 

    i{
        color: rgb(68, 62, 62);
        margin-top: 0.2em;
    }

    h5{
      padding-left: 0.4em;
    }

    li{
      display: flex;
    align-items: center;
    flex-direction: row;
 
    }

    span{
      cursor: pointer;
    }
`;

const CardInfor = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 370px;

`;

const InputTextLi = styled.textarea`

  background-color: rgba(53, 53, 61, 0.144);
  border-radius: 13px;
  width: 100%;
  min-height: 8em;
  padding: 8px;
  font-size: 16px;
  border: 1px solid transparent;
  color: #e1e1e694;
  font-family: 'Roboto', monospace;
  font-weight: 500;
  resize: none;
  margin-top: 5%;
  :focus{
    outline: none;
  }

  ::placeholder {
     font-weight: 400;
     font-size: 12px;
     font-family: 'Roboto', sans-serif;
     color: #66676b67;
  }
`;


const ButtonConS = styled.div`
background-color: rgba(210, 209, 221, 0.123);
 padding: 0.6em 2em 0.4em;
 border-radius: 100%;
 color: #4b4e52;
 float: right;
 font-family: 'Poppins', sans-serif;
 margin: 3%;
 border: 1px solid transparent;
 transition: 1s all;
 position: fixed;
 top: 1em;
 right: 2em;

 :hover{
     border: 1px solid rgba(22, 20, 20, 0.192);
     color: #c92828;
   }

`;
const ButtonCon = styled.button`
   background-color: rgba(251, 251, 253, 0.986);
    padding: 0.6em 1em 0.4em;
    border-radius: 42px;
    color: #0e0e0f;
    float: right;
    
    display: flex;
    justify-content: center;
    
    font-family: 'Poppins', sans-serif;
    margin: 3%;
    border: 1px solid transparent;
    transition: 1s all;
  

    :hover{
        background-color: transparent;
        border: 1px solid rgba(22, 20, 20, 0.192);
        color: #f8e4e4;
      }
 
   `;
