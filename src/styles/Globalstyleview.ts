import { createGlobalStyle } from "styled-components";

 
export const GlobalNvX = createGlobalStyle`
  
  html,body, #root {
      color: white;
    overflow-y: auto;
    overflow-x: hidden;
    cursor: var(--f-cursor-default);
  } 

  .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
 /* Estilizando a barra de rolagem para navegadores baseados em WebKit */
&::-webkit-scrollbar {
    width: 6px;
    display: block;
    height: 12px; /* Também define a altura para barras de rolagem horizontais */
}

/* Estilizando a trilha da barra de rolagem */
&::-webkit-scrollbar-track {
    background: transparent;
   
   
}

 

/* Estilizando o "polegar" da barra de rolagem (a parte que se move) */
&::-webkit-scrollbar-thumb {
    background: rgba(160, 162, 163, 0.16290266106442575);
    border-radius: 12px;

}

/* Estilizando a seleção de texto */
&::selection {
    background: rgba(160, 162, 163, 0.16290266106442575);
}


`;
 
   


export const Globalvision = createGlobalStyle`
  
  html,body, #root {
  
    color: white;
    overflow-y: auto;
    overflow-x: hidden;
    cursor: var(--f-cursor-default);
  } 

  .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
 /* Estilizando a barra de rolagem para navegadores baseados em WebKit */
&::-webkit-scrollbar {
    width: 4px;
    display: block;
    height: 6px; /* Também define a altura para barras de rolagem horizontais */
}

/* Estilizando a trilha da barra de rolagem */
&::-webkit-scrollbar-track {
    background: transparent;
   
}

/* Estilizando o "polegar" da barra de rolagem (a parte que se move) */
&::-webkit-scrollbar-thumb {
    background: rgba(160, 162, 163, 0.16290266106442575);
    border-radius: 1px;

}

/* Estilizando a seleção de texto */
&::selection {
    background: rgb(55, 56, 59);
}


`;



export const GlobalError = createGlobalStyle`
  
body,html, #root {
     background: rgba(0,0,0,1);
overflow-x: hidden;
cursor: var(--f-cursor-default);
} 

.hover:hover{
     background: rgba(160,162,163,0.16290266106442575);
     border-radius: 12px;
      
} 
    
&::-webkit-scrollbar {
display: none;

}

&::selection{
display: none;
}


`;
 

export const GlobalWiki = createGlobalStyle`

body,html, #root {
  background-image: url('/web/bgwikivision.webp');
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: var(--f-cursor-default);
  overflow-y: auto;
  overflow-x: hidden;
  } 

  .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
/* Estilizando a barra de rolagem para navegadores baseados em WebKit */
&::-webkit-scrollbar {
    width: 6px;
    display: block;
    height: 12px; /* Também define a altura para barras de rolagem horizontais */
}

/* Estilizando a trilha da barra de rolagem */
&::-webkit-scrollbar-track {
    background: rgba(160, 162, 163, 0.16290266106442575);
 
}

/* Estilizando o "polegar" da barra de rolagem (a parte que se move) */
&::-webkit-scrollbar-thumb {
    background: rgba(160, 162, 163, 0.16290266106442575);
    border-radius: 12px;
}

/* Estilizando a seleção de texto */
&::selection {
    background: rgba(160, 162, 163, 0.16290266106442575);
}
`;



export const Accountcenter = createGlobalStyle`
    
  body,html, #root {
    cursor: var(--f-cursor-default);
  overflow-x: hidden;
  } 

  .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
 /* Estilizando a barra de rolagem para navegadores baseados em WebKit */
 &::-webkit-scrollbar {
    width: 6px;
    display: block;
    height: 12px; /* Também define a altura para barras de rolagem horizontais */
}

/* Estilizando a trilha da barra de rolagem */
&::-webkit-scrollbar-track {
    background: rgba(0,0,0,1);
 
}

/* Estilizando o "polegar" da barra de rolagem (a parte que se move) */
&::-webkit-scrollbar-thumb {
    background: rgba(160, 162, 163, 0.16290266106442575);
    border-radius: 12px;
}

/* Estilizando a seleção de texto */
&::selection {
    background: rgba(160, 162, 163, 0.16290266106442575);
}

`;

 

export const DashboardStyle = createGlobalStyle`
    
  body,html, #root {
    background: linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
    cursor: var(--f-cursor-default);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    margin: 0 auto;
  } 
 

   a,button{
    cursor: var(--f-cursor-pointer);
   }
  .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
 &::-webkit-scrollbar {
     display: none;
  }

 &::selection{
  display: none;
 }

`;

 
export const TrivoStyle = createGlobalStyle`
    
body,html, #root {
    background-color: rgb(15, 15, 15);
  cursor: var(--f-cursor-default);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  margin: 0 auto;
} 


 a,button{
  cursor: var(--f-cursor-pointer);
 }
 .hover:hover{
       background: rgba(160,162,163,0.16290266106442575);
       border-radius: 12px;
  } 
      
 

 

`;
 