import ROUTENVX from "@/routes/routes";
import { RepeateMusic } from "iconsax-react";


export const navItems = [
  {
    title: "Marketplace",
    icon: (
      <>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16.42 7.951a6.253 6.253 0 0 1 0 8.84 6.253 6.253 0 0 1-8.84 0 6.253 6.253 0 0 1 0-8.84 6.253 6.253 0 0 1 8.84 0Z" fill="#555555"></path><path opacity=".4" d="M8.25 22.389c-.09 0-.19-.02-.28-.05-2.25-.9-4.07-2.49-5.29-4.59a10.6 10.6 0 0 1-1.341-6.73c.05-.41.44-.7.84-.65.41.05.7.43.65.84-.26 2.02.14 4.02 1.15 5.78a9.104 9.104 0 0 0 4.54 3.94c.38.16.57.59.42.98-.11.3-.4.48-.69.48ZM5.85 5.23c-.22 0-.44-.1-.59-.29-.26-.33-.2-.8.13-1.05C7.3 2.4 9.58 1.61 12 1.61c2.36 0 4.61.76 6.5 2.2A.749.749 0 1 1 17.59 5 9.111 9.111 0 0 0 12 3.11c-2.08 0-4.05.68-5.69 1.96-.14.11-.3.16-.46.16ZM15.75 22.39c-.3 0-.58-.18-.7-.47a.76.76 0 0 1 .42-.98c1.93-.78 3.5-2.14 4.54-3.94a9.044 9.044 0 0 0 1.15-5.78c-.05-.41.24-.79.65-.84.4-.05.79.24.84.65.3 2.35-.16 4.68-1.34 6.73-1.21 2.1-3.04 3.68-5.29 4.59-.08.02-.17.04-.27.04Z" fill="#555555"></path></svg>
      </>
    ),
    url: ROUTENVX.market,
    active: false,
  },

   {
    title: "Upgrader",
    icon: (
      <>
  <RepeateMusic size="20" color="#616761" variant="Bold"/>
      </>
    ),
    url: ROUTENVX.upgrader,
    active: false,
  },
 
  {
    title: "Abrir Caixa",
    icon: (
      <>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_63_4247)"><path className="white" d="M10.01 0.880005H10C9.71281 0.880005 9.48 1.11282 9.48 1.4V18.61C9.48 18.8972 9.71281 19.13 10 19.13H10.01C10.2972 19.13 10.53 18.8972 10.53 18.61V1.4C10.53 1.11282 10.2972 0.880005 10.01 0.880005Z" fill="white"></path><path className="green-paint0-li63-4247" d="M20 14H18.35C17.81 14 17.37 13.56 17.37 13.02V8.01C17.37 7.47 17.81 7.03 18.35 7.03H20V14Z" fill="url(#paint0_linear_63_4247)"></path><path className="green-paint1-li63-4247" d="M0 7.02H1.65C2.19 7.02 2.63 7.46 2.63 8V13.01C2.63 13.55 2.19 13.99 1.65 13.99H0V7.02Z" fill="url(#paint1_linear_63_4247)"></path><path className="green-paint2-li63-4247" d="M12.54 3.77H7.45C5.41759 3.77 3.77 5.4176 3.77 7.45V12.54C3.77 14.5724 5.41759 16.22 7.45 16.22H12.54C14.5724 16.22 16.22 14.5724 16.22 12.54V7.45C16.22 5.4176 14.5724 3.77 12.54 3.77Z" fill="url(#paint2_linear_63_4247)"></path></g><defs><linearGradient id="paint0_linear_63_4247" x1="20.98" y1="10.51" x2="17.05" y2="10.51" gradientUnits="userSpaceOnUse"><stop stop-color="#616761"></stop><stop offset="1" stop-color="#616761" stop-opacity="0"></stop></linearGradient><linearGradient id="paint1_linear_63_4247" x1="-0.98" y1="10.51" x2="2.95" y2="10.51" gradientUnits="userSpaceOnUse"><stop stop-color="#616761"></stop><stop offset="1" stop-color="#616761" stop-opacity="0"></stop></linearGradient><linearGradient id="paint2_linear_63_4247" x1="3.08" y1="6.73" x2="21.33" y2="15.35" gradientUnits="userSpaceOnUse"><stop stop-color="#616761"></stop><stop offset="1" stop-color="#616761" stop-opacity="0"></stop></linearGradient><clipPath id="clip0_63_4247"><rect className="white" width="20" height="20" fill="white"></rect></clipPath></defs></svg>
      </>
    ),
    url: ROUTENVX.opencase,
    active: false,
  },
    {
      title: "Inventario",
      icon: (
        <>
     <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none"><path opacity=".4" d="M21.25 5.15v2.7c0 1.84-.56 2.4-2.4 2.4h-2.7c-1.84 0-2.4-.56-2.4-2.4v-2.7c0-1.84.56-2.4 2.4-2.4h2.7c1.84 0 2.4.56 2.4 2.4ZM10.25 16.15v2.7c0 1.84-.56 2.4-2.4 2.4h-2.7c-1.84 0-2.4-.56-2.4-2.4v-2.7c0-1.84.56-2.4 2.4-2.4h2.7c1.84 0 2.4.56 2.4 2.4Z" fill="#616761"></path><path d="M16.63 11.751v1.87c0 2.28-.73 3.01-3.01 3.01h-1.87v-.48c0-2.66-1.24-3.9-3.9-3.9h-.48v-1.87c0-2.28.73-3.01 3.01-3.01h1.87v.48c0 2.66 1.24 3.9 3.9 3.9h.48Z" fill="#616761"></path></svg>
        </>
      ),
      url: ROUTENVX.myinventory,
      active: false,
    },
    {
      title: "Trocar tokens",
      icon: (
        <>
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 15.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" fill="#616761"></path><path opacity=".4" d="M22 8.5a6.5 6.5 0 0 1-7.02 6.48 6.509 6.509 0 0 0-5.96-5.96A6.5 6.5 0 1 1 22 8.5Z" fill="#616761"></path><path d="M5.59 2H3c-.55 0-1 .45-1 1v2.59c0 .89 1.08 1.34 1.71.71L6.3 3.71C6.92 3.08 6.48 2 5.59 2ZM18.41 22H21c.55 0 1-.45 1-1v-2.59c0-.89-1.08-1.34-1.71-.71l-2.59 2.59c-.62.63-.18 1.71.71 1.71Z" fill="#616761"></path></svg>
        </>
      ),
      url: ROUTENVX.trader,
      active: false,
    },
   
    {
      title: "Recarga Bits",
      icon: (
        <>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path opacity=".4" d="M12 15.7v.61H2v-.61c0-1.76.44-2.2 2.22-2.2h5.56c1.78 0 2.22.44 2.22 2.2Z" fill="#616761"></path><path d="M2 16.309v3.49c0 1.76.44 2.2 2.22 2.2h5.56c1.78 0 2.22-.44 2.22-2.2v-3.49H2Z" fill="#616761"></path><g opacity=".4" fill-rule="evenodd" clip-rule="evenodd" fill="#616761"><path d="M22 14.25a.75.75 0 0 1 .75.75A7.745 7.745 0 0 1 15 22.75a.75.75 0 0 1-.643-1.136l1.05-1.75a.75.75 0 1 1 1.286.772l-.271.452A6.246 6.246 0 0 0 21.25 15a.75.75 0 0 1 .75-.75ZM7.578 2.912A6.246 6.246 0 0 0 2.75 9a.75.75 0 0 1-1.5 0A7.745 7.745 0 0 1 9 1.25a.75.75 0 0 1 .643 1.136l-1.05 1.75a.75.75 0 0 1-1.286-.772l.271-.452Z"></path></g><path opacity=".4" d="M23 6.5h-9c0 2.48 2.02 4.5 4.5 4.5A4.5 4.5 0 0 0 23 6.5Z" fill="#616761"></path><path d="M23 6.5a4.5 4.5 0 0 0-9 0h9Z" fill="#616761"></path></svg>
        </>
      ),
      url: ROUTENVX.payaddfund,
      active: false,
      badge: { text: "31", color: "keydropcommacaroni-and-cheese" },
    },
    
  ];

  // Skin cards data
 export const skinCards = [
    
    {
      type: "CHAMPION",
      gradient:
        "linear-gradient(to bottom, #453b23, #8b7530)",
    },

 
    {
      type: "AMIX",
      gradient:
        "linear-gradient(to bottom, rgba(128,69,204,1), rgba(89,45,128,1) 48%)",
    },
    {
      type: "XPLAY",
      gradient:
        "linear-gradient(to bottom, rgba(204,69,99,1), rgba(128,45,58,1) 48%)",
    },
  ];