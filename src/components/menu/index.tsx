import styled from "styled-components"
import NVXROUTE from '@/routes/routes';

export default function NavBarNvx () {
  const buttonnvx = () => {
    window.location.href = (NVXROUTE.Dashboard);
  };
    return(
        <>
         <NavBar>
            <ContentNav>
            <CardButton>
        <button onClick={buttonnvx}>       
          <li>
          <i className="fi fi-br-link-alt" />
          </li>  
        </button> 
        </CardButton>    
            </ContentNav>
         </NavBar>
        </>
    )
}


// STYLED 
const CardButton = styled.div`
 
 button{
  background: rgba(163,166,177,0.2777485994397759);
  padding: 0.9em 1em 0.6em;
  border: 2px solid rgba(86, 84, 104, 0.568);
  border-radius: 34px;
  transition: all 1s;
 }

 button:hover{
  border: 2px solid rgb(255, 23, 100);
  transition: all 1s;

 }

 i{
  color: rgba(229, 249, 252, 0.473);
 }

 li{
  display: flex;
 } 


 span{
    font-size: 14px;
    color: white;
    font-family: 'Poppins', sans-serif;
 }

`;
const NavBar = styled.nav`
   
  min-height: 78px;
  padding: 0.6em 3em 0em;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  margin-bottom: 0.9em;
  z-index: 5;
  
`;

const ContentNav = styled.ul`

  .logoman{
      max-width: 120px;
      max-height: 70px;
  }
  
`;