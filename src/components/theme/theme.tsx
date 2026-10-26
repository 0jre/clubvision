import { useEffect, useState } from "react"
import styled from "styled-components"
import { X } from "lucide-react"
import {colorfulThemes, IconeNvX, standardThemes} from '@/data/themes/Icone';
import Tooltip from "../uls/hover.idex";
import GradientColorPicker from "./theme.pick";

 
const ThemeSelector = ({id,mutatex} : {id: string, mutatex: () => void}) => {
  const [selectedIcon, setSelectedIcon] = useState(0)
  const [showThemePreview, setShowThemePreview] = useState(false)
  const [showIconPreview, setShowIconPreview] = useState(false)
  const [selectedBgColor, setSelectedBgColor] = useState<string>('null');
  const [picker, setpicker] = useState(false)

 async function fetchSettings() {
    try {
      // Ícone
      const iconRes = await fetch(`/api/nvxre/themes/iconconfig?userId=${id}&type=icone`);
      if (iconRes.ok) {
        const iconData = await iconRes.json();
        const selectedIconObj = IconeNvX.find(i => i.icone === iconData.value);
        if (selectedIconObj) setSelectedIcon(parseInt(selectedIconObj.number));
      }

      // Background
      const bgRes = await fetch(`/api/nvxre/themes/iconconfig?userId=${id}&type=bg`);
      if (bgRes.ok) {
        const bgData = await bgRes.json();
        setSelectedBgColor(bgData.value);

      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    }
  }
 useEffect(() => {
  
  fetchSettings();
}, [id,selectedIcon,selectedBgColor]);


  // Salva a escolha na API
  const saveThemeToApi = async (value: string, type: 'icone' | 'bg') => {
    try {
      const response = await fetch('/api/nvxre/themes/iconconfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, type, value }),
      });
      mutatex()
      if (!response.ok) throw new Error('Erro ao salvar tema');
    } catch (error) {
      console.error(error);
    }
  };
    

  const handlepickerclose = () => { 
    setpicker(false);
    fetchSettings()
  }
 
  return (
    <ThemeContainer>
  
      <SectionTitle>Temas Padrão</SectionTitle>
      <SectionDescription>Ajuste a cor da interface para melhor visibilidade.</SectionDescription>
      <StandardThemeGrid>
        {standardThemes.map((theme) => (
            <Tooltip title={theme.name}>
       <ThemeCircle
        key={theme.id}
        bgColor={theme.color}
        isSelected={selectedBgColor === theme.color}
        onClick={() => {
        setSelectedBgColor(theme.color);
        saveThemeToApi(theme.color, 'bg');
      }}
          />
            </Tooltip>
        ))}
      </StandardThemeGrid>

 <Divider />
 
      <FlexContainer>
        <SectionTitle>
          Temas coloridos <NitroTag />
        </SectionTitle>
      
      </FlexContainer>
      <SectionDescription>Deixe o clubvision do seu jeito. Só com Prime.</SectionDescription>
      <ThemeGrid>
         <ThemeCircle
            bgColor={'linear-gradient(90deg, #48e082, #c665f3, #f33939)'}
            onClick={() => setpicker(true)}
          ></ThemeCircle>
        {colorfulThemes.slice(0, 22).map((theme) => (
          <ThemeCircle
            key={theme.id}
            bgColor={theme.color}
            isSelected={selectedBgColor === theme.color}
             onClick={() => {
        setSelectedBgColor(theme.color);
        saveThemeToApi(theme.color, 'bg');
      }}
          >
            {selectedBgColor === theme.color && <CheckIcon>✓</CheckIcon>}
          </ThemeCircle>
        ))}
           <Button onClick={() => setShowThemePreview(true)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></Button>
      </ThemeGrid>

      <Divider />

      <FlexContainer>
        <SectionTitle>
          Ícone no clubvision <NitroTag />
        </SectionTitle>
 
      </FlexContainer>
      <SectionDescription>Altere o ícone no app do clubvision, somente com Prime.</SectionDescription>
      <IconGrid>
       {IconeNvX.slice(0, 10).map((icon) => (
  <ThemeCircle
    key={icon.number}
    bgColor={`${icon.icone}`}
    isSelected={selectedIcon === parseInt(icon.number)}
   onClick={() => {
    setSelectedIcon(parseInt(icon.icone));
    saveThemeToApi(icon.icone, 'icone');
  }}
  />
))}
        <Button onClick={() => setShowIconPreview(true)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></Button>
      </IconGrid>

    

      {/* Theme Preview Modal */}
       
      {picker && (
        <PreviewOverlay>
          <PreviewModal>
         <GradientColorPicker 
         currentbg={selectedBgColor} close={handlepickerclose} 
         send={(value: string) => saveThemeToApi(value, 'bg')} />
          </PreviewModal>
  
        </PreviewOverlay>
        
      )}

      {showThemePreview && (
        <PreviewOverlay>
          <PreviewModal>
            <PreviewHeader>
              <PreviewTitle>Pré-visualizar temas</PreviewTitle>
              <CloseButton onClick={() => setShowThemePreview(false)}>
                <X size={24} />
              </CloseButton>
            </PreviewHeader>
            <PreviewContent>
              <PreviewThemeGrid>
                {colorfulThemes.map((theme) => (
                  <PreviewThemeCard
                    key={theme.id}
                    bgColor={theme.color}
                    isSelected={selectedBgColor === theme.color}
                     onClick={() => {
        setSelectedBgColor(theme.color);
        saveThemeToApi(theme.color, 'bg');
      }}
                  >
                    <PreviewThemeHeader bgColor={theme.color}>
                      {selectedBgColor === theme.color && <CheckIcon>✓</CheckIcon>}
                    </PreviewThemeHeader>
                    <PreviewThemeBody>
                      <PreviewThemeName>{theme.name}</PreviewThemeName>
                    </PreviewThemeBody>
                  </PreviewThemeCard>
                ))}
              </PreviewThemeGrid>
  
            </PreviewContent>
          </PreviewModal>
        </PreviewOverlay>
      )}

      {/* Icon Preview Modal */}
      {showIconPreview && (
        <PreviewOverlay>
          <PreviewModal>
            <PreviewHeader>
              <PreviewTitle>Prévia do ícone clubvision</PreviewTitle>
              <CloseButton onClick={() => setShowIconPreview(false)}>
                <X size={24} />
              </CloseButton>
            </PreviewHeader>
            <PreviewContent>
            
  
  {IconeNvX.filter(icon => icon.collection === 'club').length > 0 && (
    <>
      <h3>clubvision</h3>
        <PreviewIconGrid> 
      {IconeNvX.filter(icon => icon.collection === 'club').map(icon => (
        <PreviewIconCard
          key={icon.number}
          onClick={() => {
            setSelectedIcon(parseInt(icon.icone));
            saveThemeToApi(icon.icone, 'icone');
          }}
        >
          <PreviewIconCircle
            bgImage={icon.icone}
            isSelected={selectedIcon === parseInt(icon.number)}
          >
            {selectedIcon === parseInt(icon.number) && <CheckIcon>✓</CheckIcon>}
          </PreviewIconCircle>
        </PreviewIconCard>
        
      ))}
      </PreviewIconGrid>
    </>
  )}

  {IconeNvX.filter(icon => icon.collection !== 'club').length > 0 && (
    <>
      <h3>novision</h3>
      <PreviewIconGrid>
      {IconeNvX.filter(icon => icon.collection !== 'club').map(icon => (
        <PreviewIconCard
          key={icon.number}
          onClick={() => {
            setSelectedIcon(parseInt(icon.icone));
            saveThemeToApi(icon.icone, 'icone');
          }}
        >
          <PreviewIconCircle
            bgImage={icon.icone}
            isSelected={selectedIcon === parseInt(icon.number)}
          >
            {selectedIcon === parseInt(icon.number) && <CheckIcon>✓</CheckIcon>}
          </PreviewIconCircle>
        </PreviewIconCard>
      ))}
    </PreviewIconGrid> 
    </>
  )}
 


         
            </PreviewContent>
          </PreviewModal>
        </PreviewOverlay>
      )}
    </ThemeContainer>
  )
}

export default ThemeSelector

 
// Container principal
const ThemeContainer = styled.div`
 
  color: white;
 
   font-family: 'Inter', monospace;
  position: relative;
`

 
const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
    font-family: 'Inter', monospace;
`

const SectionDescription = styled.p`
  font-size: 12px;
  color: #b9bbbe;
  margin-bottom: 15px;
  font-family: 'Inter', monospace;
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StandardThemeGrid = styled(ThemeGrid)`
  grid-template-columns: repeat(5, 1fr);
  max-width: 300px;
  
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const ThemeCircle = styled.button<{ bgColor: string; isSelected?: boolean }>`
  
    background: ${(props) => props.bgColor.includes('https') ? `url(${props.bgColor}) center/cover` : props.bgColor};
  border: ${(props) => (props.isSelected ? "3px solid #36cf64" : "1px solid #302e2e")};
    box-shadow: ${(props) => (props.isSelected ? "0 0 22px #36cf64" : "0 0 22px #191a1999")};
  display: flex;
   width: 70px;
  height: 70px;
  border-radius: 12%;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`

const IconGrid = styled(ThemeGrid)`
  grid-template-columns: repeat(8, 1fr);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #202221;
  margin: 20px 0;
  width: 100%;
`

const Button = styled.button`
  background-color: #1d1f1f;
   display: flex;
    width: 70px;
    border: 1px solid #292727;
  height: 70px;
   border-radius: 12%;
  align-items: center;
  justify-content: center; 
  
  &:hover {
    background-color: #292b29;
  }
`

const CheckIcon = styled.div`
  color: white;
  font-size: 20px;
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const NitroTag = styled.span`
  display: inline-flex;
  align-items: center;
  
  &::after {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('/icons/crown_badge.png');
    background-size: contain;
    margin-left: 5px;
  }
`

// Preview Modal Components
const PreviewOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(26, 27, 27, 0.527);
  display: flex;
  backdrop-filter: blur(1px);
  justify-content: end;
  align-items: center;
  padding: 1em;
 height: 100vh;
 width: 100vw;
  z-index: 9000;

   @media screen and (max-width: 768px) {
    padding: 0;
  }
`

const PreviewModal = styled.div`
  background: linear-gradient(204deg, #1b1d1c40 -7%, #b85cff00 33%), linear-gradient(162deg, #1a1b1b40 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11);
  width: 50vw;
  height: 100%;
  overflow-y: hidden;
  position: relative;
  border-radius: 14px;
  border: 2px solid #282b29;
  animation: Animant 0.9s ease-in-out; ;
 

  @keyframes Animant {
    0% { 
      opacity: 0;
      transform: translateX(100%);
    
    }
    100% {
      opacity: 1;
        transform: translateX(0%);
    
    }
  }
 
 @media screen and (max-width: 768px) {
    height: 100vh;
    width: 100vw;
    border: none;
    border-radius: 0;
      padding-bottom: 2em;
     overflow-y: auto;
  }
  
`

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #2f3136;
`

const PreviewTitle = styled.h3`
  font-size: 18px;
  font-family: 'Inter', monospace;
  font-weight: 600;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #b9bbbe;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
  }
`

const PreviewContent = styled.div`
  padding: 20px;
  height: 100%;
    padding-bottom: 12%;
  overflow-y: auto;

  h3{
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
    margin: 12px;
    color: #3a3c3d;
    font-family: 'Europa Grotesk', monospace;
  }
`

const PreviewThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const PreviewThemeCard = styled.div<{ bgColor: string; isSelected?: boolean }>`
  border-radius: 8px;
  overflow: hidden;
 
   box-shadow: ${(props) => (props.isSelected ? "0 0 22px #36cf64" : "0 0 22px trasparent")};
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.03);
  }
`

const PreviewThemeHeader = styled.div<{ bgColor: string }>`
  background: ${(props) => props.bgColor};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PreviewThemeBody = styled.div`
  background-color: #202221;
  padding: 12px;
  text-align: center;
`

const PreviewThemeName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #bbc0c4;
  font-family: 'InterSemiBold', monospace;
`

const PreviewIconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const PreviewIconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
 
  &:hover {
    transform: scale(1.03);
  }
`

const PreviewIconCircle = styled.div<{ bgImage: string, isSelected?: boolean}>`
 width: 70px;
  height: 70px;
  border-radius:12px; 
  box-shadow: ${(props) => (props.isSelected ? "0 0 22px #36cf64" : "0 0 22px #191a1999")};
  background: url(${(props) => props.bgImage}) center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PreviewIconName = styled.div`
  font-size: 12px;
  color: #b9bbbe;
`

 