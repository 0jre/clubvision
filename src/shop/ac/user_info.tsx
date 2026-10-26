'use client'
import { UserData } from "@/types/user/types";
import Image from "next/image";
import { useEffect, useState } from 'react';
import NotLogged from "./modal.notlogged";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import ROUTENVX from "@/routes/routes";

async function fetchUserInfo(): Promise<UserData> {
  const response = await fetch('/api/autentic/searchuser');
  if (!response.ok) {
    throw new Error('Falha ao buscar informações do usuário.');
  }
  const data = await response.json();
  return data;
}

interface Props  {
  loggedin: React.ReactNode;
}
export default function InfoUserlogged ({loggedin} : Props) {
  const router = useRouter()
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
 

    return(
        <>

        {loading ? (
          <>
        <ArrowPathRoundedSquareIcon className={'h-5 m-0.2 text-black-500 colorblack'} />          
        </>
        ) : userInfo ? (
          <button onClick={() => router.push(ROUTENVX.centraldash)}>
          <li>
          <ul>
          <h1>{userInfo.user.username ? userInfo.user.username : <> ---- </>}</h1>
          {loggedin}
          </ul>
          
          <Image
             className="logo"
                src={userInfo.user.avatar || 'https://i.imgur.com/mXit4fI.jpg'}
                alt="User Avatar" 
                height={32}
                width={32} 
              />
          </li>
          </button>
        ) : (
          <>
      <NotLogged />
          </>
        )}
       
        </>
    )
}

