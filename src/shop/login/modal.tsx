/* eslint-disable @next/next/no-img-element */
'use client'
import { Basket } from '@/types/user/types.tebex';
import {  InfoLogged } from '@/styles/styled.view';
import { ArrowRightEndOnRectangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import InfoUserlogged from '../ac/user_info';
import { useRouter } from 'next/navigation'; 
import Infonotlogin from '../ac/modal.not';
import NotLogged from '../ac/modal.notlogged';
import styled from 'styled-components'; 
import { useEffect, useState } from 'react';
import { useValidationState } from '@/lib/oauth/tebex/validation-logged';
 
export default function LoginModal({
  authLink,
  basket,
}: {
  authLink?: string
  basket?: Basket | null
}) {
 const router = useRouter()
  const [loadingLink, setLoadingLink] = useState(false)

  // Usa o hook de validação robusto
 // Usa o hook de validação ajustado
  const status = useValidationState(basket, authLink, {
    onStateChange: (prev, next) => {
      if (next === "logged-in") {
        console.log("Usuário logado com sucesso")
      }
    },
    debug: process.env.NODE_ENV === "development",
  })

 // Early return para loading - mantendo sua lógica original
  if (status === "loading") {
    return (
      <MarginImags>
        <img src="/icons/market/20250325_192605.webp" alt="novision" width={35} height={35} className="b1" />
        <img src="/icons/market/20250325_192624.webp" alt="novision" width={35} height={35} className="b2" />
      </MarginImags>
    )
  }

  // Early return para no-basket
  if (status === "no-basket") {
    return <NotLogged />
  }

  // Early return para no-user - mantendo sua lógica original
  if (status === "no-user") {
    return (
      <Infonotlogin
        buttoncliv={
          <button
            onClick={() => {
              setLoadingLink(true)
              router.push(`${authLink}`)
            }}
            aria-label="Login"
            className="buttonclik ease-in-out hover:scale-110"
            disabled={loadingLink}
          >
            <h4>{loadingLink ? "Carregando..." : "VINCULAR CONTA"}</h4>
            <ArrowRightEndOnRectangleIcon className="h-7 transition-all ease-in-out hover:scale-110" />
          </button>
        }
      />
    )
  }

  // Early return para erro (novo estado)
  if (status === "error") {
    return (
      <div className="p-4 text-red-600 border border-red-300 rounded-lg">
        <p>Erro ao validar sessão. Tente novamente.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Recarregar
        </button>
      </div>
    )
  }

  // status === 'logged-in' - mantendo sua lógica original
  return (
    <InfoLogged>
      <span>
        <InfoUserlogged
          loggedin={
            <>
              <h6>{basket!.username}</h6>
            </>
          }
        />
      </span>
    </InfoLogged>
  )
}



const MarginImags = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 place-items: center;
 
 
  .b1{
    position: absolute;
    animation: Rotate 0.9s infinite;
  }
 
 @keyframes Rotate {
   0%{ transform: rotate(360deg) }
   100%{ transform: rotate(0deg) }
 }


 @media screen and (max-width: 580px) {
  display: none;

  
 }

`;