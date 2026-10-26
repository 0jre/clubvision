'use client';

import { createUrl } from '@/lib/oauth/tebex/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ROUTENVX from '@/routes/routes';

export default function SearchCenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isopensearch, setopensearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync searchValue with searchParams on mount and when searchParams changes
  useEffect(() => {
    if (mounted) {
      setSearchValue(searchParams?.get('q') || '');
    }
  }, [searchParams, mounted]);


  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchParams) {
      const newParams = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        newParams.set('q', searchValue);
      } else {
        newParams.delete('q');
      }
      router.push(createUrl(ROUTENVX.storealllist, newParams));
    }
  }
  if (!mounted) return null;
  return (
    <>
    <form onSubmit={onSubmit} className={isopensearch ? 'OpenMenu' : 'navbar-closed' }>
      <SearchLabel>
      <MagnifyingGlassIcon className={'h-6 transition-all ease-in-out hover:scale-110 icon '} /> 
      <SearchUsers
        type="text"
        name="search"
        placeholder="Procurar por"
        autoComplete="off"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      </SearchLabel>
    </form>
    </>
  );
}

////
 
const SearchLabel = styled.label`
  
  width: 21em;
  height: 1em;
  font-size: 16px;
  border-radius:29px;
  border: 2px solid rgba(131, 132, 151, 0.075);
  color: #d1d1d6;
  padding: 1.3em 1em 1.3em;
 
    display: flex;
    align-items: center;
    flex-direction: row;

    .olc{
      opacity: 0.9;
    }

    @media screen and (max-width: 490px) {
      display: none;
    }
`;

const SearchUsers = styled.input`
  background-color: transparent;
  width: 100%;
  height: 100%;
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


