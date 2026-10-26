import styled, { keyframes } from "styled-components"

import {
  Shield,
  Crown,
  Sparkles,
  
} from "lucide-react"
import Image from "next/image"
  
export default function ComponentTopInc({manager, admin} : {admin: boolean, manager: boolean}) {
  
  return (
    <>
      <AdminHeader>
        
        <BackgroundPattern>
          <PatternDots />
        </BackgroundPattern>
 
        <FloatingElement className="sparkles">
          <Sparkles size={34} />
        </FloatingElement>
        <FloatingElement className="crown">
          <Crown size={18} />
        </FloatingElement>

        <HeaderContent>
        
            <AdminStatus>
            
                <ShieldContainer>
                  <Shield size={28} />
                   
                </ShieldContainer>
               <AdminDetails>
  <AdminTitle>
    <AdminHeading>
      {manager ? "Bem-vindo, Chefe" : "Bem-vindo, Administrador"}
    </AdminHeading>
    <AdminBadge>
      <Crown size={12} />
      {manager && "GESTÃO"} {admin && "ADMIN"}
    </AdminBadge>
  </AdminTitle>
  <AdminDescription>
    {manager
      ? "Você tem controle total sobre o sistema. Decisões estratégicas estão nas suas mãos."
      : "Você tem privilégios administrativos. Mantenha a operação segura e eficiente."}
  </AdminDescription>
</AdminDetails>

             
              <Image className="rounded-full" src={'/nvrp/20221102_165951.jpg'} alt="novision" height={30}  width={30} />
            </AdminStatus>

        
        </HeaderContent>
      </AdminHeader>

     
 
    </>
  )
}



// Animations
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
`
 

const AdminHeader = styled.div`
  position: relative;
  background:  #2a4b34;
  color: white;
  overflow: hidden;
`

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
`

const PatternDots = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
  background-size: 20px 20px;
`

const FloatingElement = styled.div`
  position: absolute;
  opacity: 0.2;
  
  &.sparkles {
    top: 1rem;
    right: 5rem;
    animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  &.crown {
    bottom: 0.9rem;
    left: 5rem;
    animation: ${bounce} 1s infinite;
  }
`

const HeaderContent = styled.div`
    -webkit-box-align: center;
    align-items: center;
    color: rgb(255, 255, 255);
    display: flex;
    fill: rgb(255, 255, 255);
    height: 44px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin: 0px auto;
    padding-left: 20px;
    padding-right: 20px;
    transition: padding-right 0.2s;
    max-width: 100%;
    box-sizing: border-box;

    
@media screen and (max-width: 680px) {
  padding: 0.4em;
  gap: 8px;
  height: 70px;

}
`
 

const AdminStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
`

 
const ShieldContainer = styled.div`
  position: relative;
`

 

const AdminDetails = styled.div`
display: flex;
   flex-direction: column;
  align-items: center;
text-align: center;
`

const AdminTitle = styled.div`
  display: flex;
   
  align-items: center;
  gap: 0.5rem;
`

const AdminHeading = styled.h1`
  font-size: 12px;
  font-weight: bold;
`

const AdminBadge = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.10rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.55rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`

const AdminDescription = styled.p`
  color: #20201f;
   font-size: 10px;
  font-weight: 500;
  margin-top: 0.25rem;
`

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const GlassButton = styled.button`
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const GhostButton = styled.button`
  color: white;
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

const MainLayout = styled.div`
  display: flex;
`

const Sidebar = styled.div`
  width: 16rem;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  min-height: 100vh;
`

const SidebarContent = styled.div`
  padding: 1rem;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #2563eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`

const LogoText = styled.span`
  font-weight: 600;
  color: #111827;
`

const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &.active {
    color: #2563eb;
    background-color: #eff6ff;
  }
`

const ShortcutsSection = styled.div`
  margin-top: 2rem;
`

const ShortcutsTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
`

const MainContent = styled.div`
  flex: 1;
`

const TopBar = styled.div`
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
`

const TopBarContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const SearchWrapper = styled.div`
  position: relative;
`

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
`

const SearchInput = styled.input`
  padding-left: 2.5rem;
  width: 20rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const IconButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f3f4f6;
  }
`

const PrimaryButton = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #1d4ed8;
  }
`

const PageContent = styled.div`
  padding: 1.5rem;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const PageTitle = styled.div``

const PageHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
`

const Recommendation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
`

const LinkButton = styled.button`
  color: #2563eb;
  background: transparent;
  border: none;
  padding: 0;
  font-size: inherit;
  cursor: pointer;
  text-decoration: underline;
`

const CloseButton = styled.button`
  background: transparent;
  border: none;
  padding: 0.25rem;
  color: #6b7280;
  cursor: pointer;
  
  &:hover {
    color: #374151;
  }
`

const Filters = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const FilterButton = styled.button`
  background-color: white;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f9fafb;
  }
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 500;
  color: #374151;
  background-color: #f9fafb;
  
  &.actions {
    width: 3rem;
  }
`

const TableDataRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:hover {
    background-color: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`

const TableDataCell = styled.td`
  padding: 0.75rem 1rem;
  color: #111827;
  
  &.font-medium {
    font-weight: 500;
  }
`
