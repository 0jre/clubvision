'use client';

import { createUrl } from '@/lib/oauth/tebex/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import ROUTENVX from '@/routes/routes';


export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isopensearch, setopensearch] = useState(false);
  const handleopen = () => setopensearch(true);
  const handleclose = () => setopensearch(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    
    // Perform null check on searchParams
    if (searchParams) {
      const newParams = new URLSearchParams(searchParams.toString());
      
      if (search.value) {
        newParams.set('q', search.value);
      } else {
        newParams.delete('q');
      }
      
      router.push(createUrl(ROUTENVX.storealllist, newParams));
    }
  }
  return (
    <>
    <button className="link Mobile" onClick={handleopen}>
    <MagnifyingGlassIcon className={'h-5 transition-all ease-in-out hover:scale-110 icon '} /> 
    </button>

    {isopensearch && (
        <ModalSearch>
          <li>
 <form onSubmit={onSubmit} className={isopensearch ? 'OpenMenu' : 'navbar-closed' }>
      <SearchLabel>
      <MagnifyingGlassIcon className={'h-7 transition-all ease-in-out hover:scale-110 icon '} /> 
      <SearchUsers
        key={searchParams?.get('q')}
        type="text"
        name="search"
        placeholder="Search"
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
    
      />
      </SearchLabel>
    </form>
    <button className="link" onClick={handleclose}>
    <XCircleIcon className={'h-5 transition-all ease-in-out hover:scale-110 icon '} /> 
    </button>
  </li>
 
        </ModalSearch>
    )}
    </>
  );
}


////


const ModalSearch = styled.div`
  position: fixed;
 
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0.4em 1em 0.4em; 
  z-index: 1999;
  right: 9px; 
  top: 1px;
  border-radius: 0 0 34px 34px;
  background: radial-gradient(circle, #010201eb 0%, rgba(5, 7, 6, 0.945) 100%);
    
  li{
    display: flex;
 flex-direction: row;
 align-items: center;
  }

  .navbar-closed {
    animation: collapse 0.5s forwards;
  }
  
   @media screen and (max-width: 430px) {
    right: 24px; 
   }
 

  @keyframes collapse {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.7);
    }
  }
 
 .OpenMenu{
  animation: expand 0.5s forwards;
 }


 @keyframes expand {
    0% {
      opacity: 0;
      transform: scaleX(0);
    }
    100% {
      opacity: 1;
      transform: scaleX(1);
    }
  }


   span{
    font-size: 11px;
    margin: 0.1em;
    color: rgb(40, 41, 43);
   }
  .infog{
    background-color: rgba(219, 218, 226, 0.034);
    padding: 0.4em 0.4em 0.4em;
    border-radius: 8px;
    display: flex;
    margin: 0.3em;
    flex-direction: row;
    
   a{
    font-size: 11px;
    margin: 0.1em;
    color: rgb(40, 41, 43);
    padding: 0.3em 0.4em 0.3em;
    font-family: 'Inter', sans-serif;
    cursor: pointer;

    &:hover{
        background-color: rgba(54, 55, 59, 0.288);
        border-radius: 22px;
        padding: 0.3em 0.9em 0.3em;
        color: #ced1df;
    }
   }
  }





`;
const SearchLabel = styled.label`
  
  width: 15em;
  height: 1em;
  font-size: 16px;
  border-radius: 84px;
  border: 2px solid rgba(131, 132, 151, 0.075);
  color: #d1d1d6;
  padding: 1.3em 1em 1.3em;
 
    display: flex;
    align-items: center;
    flex-direction: row;

    .olc{
      opacity: 0.9;
    }
`;

const SearchUsers = styled.input`
  background-color: transparent;
  width: 100%;
  height: 3em;
  padding: 8px;
  font-size: 14px;
  border: none;
  border-radius: 14px;
  color: #d3d3dd;
  font-family: 'Inter', sans-serif;

 
  &:focus{
    outline: none;
  }

  
  &::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Inter', sans-serif;
     color: #3e3e42;
  }
  
  &:focus {
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


