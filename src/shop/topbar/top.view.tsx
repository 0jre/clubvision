
import Search from "shopping/layout/navbar/search";
import Cart from "shopping/cart";
import { ContainerTOPS } from "@/styles/styled.view";
import Categories from "../layout/search/categories";
import Login from "shopping/login";

import Link from "next/link";
import SearchCenter from "../layout/navbar/search.center";
import React, { useRef, useState } from "react";
import LogoVision from "@club/components/vision/logo";

export default function Topbarstore() {
    return(
        <> 

      
         <ContainerTOPS>
          <Link href="/store"> 
         <li className="li">
      <LogoVision />
      </li>
      </Link>
    
        <SearchCenter />
    
          <li>
          <Search />
          <Cart />
          <Login />
          </li>
         </ContainerTOPS>
   
          <Categories /> 
      
        </>
    )
}



