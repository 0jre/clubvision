import styled from "styled-components";

export const ContainerView = styled.main`
    
   margin: 0 auto;
   max-width: 1344px;
   
   li{
    float: right;
   }

 button{
    margin-right: 5em;
    padding: 0.7em 0.4em 0em;
    border-radius: 19px;
    font-size: 17px;
    font-family: 'Yantramanav', sans-serif;
    color: rgba(166,166,177,1);
    display: inline-block;
    border: 2px solid rgba(158,160,168,0.5718662464985995);
    border-radius: 50%;
    font-size: 16px;
    font-weight: bold;
    background-color: transparent;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    background: linear-gradient(141deg, rgba(0,0,1,1) 0%, rgba(11,18,48,1) 68%, rgba(1,2,8,1) 100%);

   } 

   i{
     font-size: 25px;
   }
    
    button:hover{
       box-shadow: 2px 8px 19px black ;
       border: 2px solid rgba(1,2,6,0.7231267507002801);
       transition: all 0.3s ease-in-out;
       background: rgba(5,10,28,0.4822303921568627);
   } 


    
`;

 


export const ContentView = styled.div`
    
     display: flex;
     flex-direction: column;
     margin: 5.3em;
 
    .logomain{
       max-width: 120px;
       max-height: 100px; 
     
     } 
    
    li{
      display: flex;
      flex-direction: column;
    }

 
    p{
      word-wrap: break-word;
      max-width: 389px;
      align-items: center;
      font-family: 'Raleway', sans-serif;
      font-size: 15px;
      color: rgba(193,193,193,1);
    }



`;


export const CardViewDetails = styled.div`

   background: linear-gradient(7deg, rgba(4,4,13,0.5662640056022409) 44%, rgba(206,207,209,0.4290091036414566) 100%);
   padding: 2em 2em 2em;
   float: right;
   border-radius: 9px;
   margin: 0.8em;

   hr{
     margin-top: 2em;
     border-color: rgba(86,90,105,0.3113620448179272);
     margin-bottom: 0.9em;
     width: 100%;
   }

   animation-name: CardViewDetails;
   animation-duration: 2s;
   animation-iteration-count: all ;

   @keyframes CardViewDetails {
    from { 
      margin-right: -30em; 
  }

}

.button{
    background: linear-gradient(7deg, rgba(4,4,13,0.8183648459383753) 44%, rgba(11,16,28,1) 100%);
     padding: 0.2em 0.5em 0.1em;
     border-radius: 20%;
     margin: 0.9em;
     float: right;
    
     i{
      font-size: 14px;
      color: rgba(255,15,40,1);

     }

     :hover{
       position: relative;
       top: -2px;
 
     }
  }
`;

export const ContentCardDetails = styled.div`
   
   border: 2px dashed rgba(86,90,105,0.5578606442577031);
   padding: 1em 1em 1em;
   border-radius: 8px;
   text-align: center;

   ul{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex-flow: row;
    justify-content: center;
  
   }

   p{
     font-size: 19px;
     margin: 0.8em;
   }
 
  .useravatar{
    border-radius: 50%;
    max-width: 60px;
    max-height: 60px;
  }
`;

export const DisplayDescri = styled.ul`

    display: flex;
   flex-direction: column;

  a{
     padding: 0.6em 2em 0.2em;
     border-radius: 7px;
     font-family: 'Poppins';
     font-size: 16px;
     color: #868c99;
     transition: all 2s;
     margin: 0.2em;
     text-align: center;
     border: 2px dotted rgba(86,87,89,0.908000700280112);
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;

     :hover{
      background: rgba(51,50,60,0.2777485994397759);
     transform: rotate(2deg);
     }
  }
  
  
  p{
    font-size: 12px;
    color: #6b6f749b;
    max-width: 240px;
    word-wrap: break-word;
    text-align: center;
  }

  .nvxrel{
     max-width: 233px;
     max-height: 100px;
  }
  
  
`;


export const ContentViewFooter = styled.ul`
    margin: 0.9em;
    position: fixed;
    bottom: 0;

    p{
      font-size: 17px;
      font-family: 'Yantramanav', sans-serif;
      color: rgba(159,159,162,1); 
    }
  
  
    i{
      color:  rgba(219,219,242,1);
    }

    .ms{
       font-size: 12px;
    }
  
   a{
    margin: 0.4em;
  }

  a:hover{
     position: relative;
     top: -1px;
  }


  span{
     background-color: rgba(159,161,164,0.2945553221288515);
     padding: 0.1em 0.6em 0.2em;
     border-radius: 5px;
  }

`;


export const ContentImage = styled.div`

   float: right;
   margin-left: 26em;

  a:hover{
    position: relative;
     top: 0px;
     padding: 1.2em 1em 0.1em;
  }

`;