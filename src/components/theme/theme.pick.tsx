"use client"

import { useEffect, useState } from "react"
import { HexColorPicker } from "react-colorful"
import styled from "styled-components"
import { Droplet, Layers } from "lucide-react"

interface Prop {
  currentbg: string
  close: () => void
  send: (value: string) => void
}

 

export default function GradientColorPicker({ currentbg, close, send }: Prop) {
  const extractColorsFromGradient = (gradient: string) => {
    const regex = /#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?/g
    const matches = Array.from(gradient.matchAll(regex))
    const left = matches[0]?.[1] ? `#${matches[0][1]}` : defaultLeftColor
    const right = matches[2]?.[1] ? `#${matches[2][1]}` : defaultRightColor
    return { left, right }
  }

  // Cores padrão (com opacidade 40%)
  const defaultLeftColor = "#11f784"
  const defaultRightColor = "#11f784"
  const defaultFallbackColor = "#121312"

  // Estados para as cores
  const [leftColor, setLeftColor] = useState(defaultLeftColor)
  const [rightColor, setRightColor] = useState(defaultRightColor)

  const [leftOpacity, setLeftOpacity] = useState(40)
  const [rightOpacity, setRightOpacity] = useState(40)
  const [activeTab, setActiveTab] = useState("left")
  const [copied, setCopied] = useState(false)
  
  const [useCustomLeft, setUseCustomLeft] = useState(true)
  const [useCustomRight, setUseCustomRight] = useState(true)
  const [applytema, setappytema] = useState("")
 const [currentGradientx, setCurrentGradientx] = useState("")
 const [currentGradiente, setCurrentGradiente] = useState("")


  const handletema = () => {
    setappytema(currentGradient)
  }

  // Cores pré-definidas
  const presetColors = [
    { name: "Verde", color: "#11f784" },
    { name: "Roxo", color: "#9945ff" },
    { name: "Azul", color: "#00a2ff" },
    { name: "Rosa", color: "#ff006e" },
    { name: "Laranja", color: "#ff8a00" },
    { name: "Amarelo", color: "#ffcc00" },
    { name: "Turquesa", color: "#00ffff" },
    { name: "Vermelho", color: "#ff2d2d" },
  ]

  // Cores terrosas
  const earthColors = [
    { name: "Terracota", color: "#8d6e63" },
    { name: "Marrom", color: "#a47848" },
    { name: "Verde Oliva", color: "#606934" },
    { name: "Verde Musgo", color: "#3a5a40" },
    { name: "Mostarda", color: "#e9c46a" },
    { name: "Âmbar", color: "#d4a012" },
    { name: "Vinho", color: "#8e244d" },
    { name: "Bordô", color: "#721228" },
  ]

  // Gerar o gradiente completo
  const generateGradient = () => {
    const leftColorWithOpacity = useCustomLeft
      ? `${leftColor}${leftOpacity.toString(16).padStart(2, "0")}`
      : `${defaultFallbackColor}40`

    const rightColorWithOpacity = useCustomRight
      ? `${rightColor}${rightOpacity.toString(16).padStart(2, "0")}`
      : `${defaultFallbackColor}40`

    return `linear-gradient(204deg, ${leftColorWithOpacity} -7%, #b85cff00 33%), linear-gradient(162deg, ${rightColorWithOpacity} -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11)`
  }

  // Gradiente atual
  const currentGradient = generateGradient()

  // Resetar para as cores padrão
  const resetColors = () => {
    setLeftColor(defaultLeftColor)
    setRightColor(defaultRightColor)
    setLeftOpacity(40)
    setRightOpacity(40)
    setUseCustomLeft(true)
    setUseCustomRight(true)
  }

  // Aplicar cor predefinida
  const applyPresetColor = (color: string) => {
    if (activeTab === "left") {
      setLeftColor(color)
      setUseCustomLeft(true)
    } else {
      setRightColor(color)
      setUseCustomRight(true)
    }
  }

  // Desativar cor personalizada
  const toggleCustomColor = (side: "left" | "right") => {
    if (side === "left") {
      setUseCustomLeft(!useCustomLeft)
    } else {
      setUseCustomRight(!useCustomRight)
    }
  }

  useEffect(() => {
    if (currentbg) {
     
      const { left, right } = extractColorsFromGradient(currentbg)
      setLeftColor(left)
      setRightColor(right)
    }
  }, [currentbg,])

   useEffect(() => {
   
    const { left, right } = extractColorsFromGradient(currentbg)
    setCurrentGradientx(left)
    setCurrentGradiente(right)
  }, [])

  useEffect(() => {
    send(applytema)
  }, [applytema,send])

  return (
    <Container>
      <Wrapper>
        <Header>
          <Title>Personalizar</Title>
          <CloseButton onClick={close}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </CloseButton>
        </Header>

        <Grid>
          {/* Presets e Visualização */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Predefinidos</CardTitle>
              </CardHeader>
              <CardContent>
                <PresetGrid>
                  <PresetButton
                    bgImage={`linear-gradient(204deg, #11f78440 -7%, #b85cff00 33%), linear-gradient(162deg, #11f78440 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11)`}
                    onClick={resetColors}
                  >
                    <PresetLabel>Padrão</PresetLabel>
                  </PresetButton>
                  <PresetButton
                    bgImage={`linear-gradient(204deg, #12131240 -7%, #b85cff00 33%), linear-gradient(162deg, #12131240 -10%, #2c88dd00 25%), linear-gradient(0deg, #0e0e11, #0e0e11)`}
                    onClick={() => {
                      setUseCustomLeft(false)
                      setUseCustomRight(false)
                    }}
                  >
                    <PresetLabel>Neutro</PresetLabel>
                  </PresetButton>
                </PresetGrid>
              </CardContent>
            </Card>

            <Card style={{ marginTop: "1.5rem" }}>
              <CardHeader>
                <CardTitle>Visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <Preview gradient={currentGradient}>
                  <PreviewContent>
                    <PreviewText>Tema Personalizado</PreviewText>
                  </PreviewContent>
                </Preview>

  {currentGradiente !== rightColor && activeTab === "right" && useCustomRight && (
                    <OpacityControl>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd"><path d="M3 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"></path><path d="M11 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".45"></path><path d="M19 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".15"></path><path d="M7 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".7"></path><path d="M15 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".3"></path></g></svg>
                      <SliderContainer>
                        <Slider
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={rightOpacity}
                          onChange={(e) => setRightOpacity(Number.parseInt(e.target.value))}
                        />
                      </SliderContainer>
                      <OpacityValue>{rightOpacity}%</OpacityValue>
                    </OpacityControl>
                  )}

 {currentGradientx !== leftColor  && activeTab === "left" && useCustomLeft && (
                    <OpacityControl>
                       <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd"><path d="M3 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z"></path><path d="M11 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".45"></path><path d="M19 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".15"></path><path d="M7 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".7"></path><path d="M15 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" opacity=".3"></path></g></svg> 
                      <SliderContainer>
                        <Slider
                          type="range"
                          min={0}
                          max={100}
                          step={1}
                          value={leftOpacity}
                          onChange={(e) => setLeftOpacity(Number.parseInt(e.target.value))}
                        />
                      </SliderContainer>
                      <OpacityValue>{leftOpacity}%</OpacityValue>
                    </OpacityControl>
                  )}

                <ApplyButton onClick={handletema}>{applytema === currentGradient ? "Aplicado" : " Aplicar tema"}</ApplyButton>
              </CardContent>
            </Card>
          </div>

          {/* Seletor de Cores */}
          <Card>
            <CardHeader>
              <CardTitle>Seletor de Cores</CardTitle>
            </CardHeader>
            <CardContent>
              <TabsContainer>
                <TabsList>
              
                  <TabTrigger isActive={activeTab === "right"} onClick={() => setActiveTab("right")}>
                    
                    <ul>
                      <Droplet size={14} />
                    <span>Lado esquerdo</span>
                    </ul>
                    <ColorDot color={useCustomRight ? rightColor : defaultFallbackColor} />
                  </TabTrigger>
                <TabTrigger isActive={activeTab === "left"} onClick={() => setActiveTab("left")}>
                   
                   <ul>
                       <Droplet size={14} /> 
                    <span>Lado direito</span>
                   </ul>
                    <ColorDot color={useCustomLeft ? leftColor : defaultFallbackColor} />
                  </TabTrigger>

                  {activeTab === "left" ? (
                    <ToggleButton isActive={useCustomLeft} onClick={() => toggleCustomColor("left")}>
                      {useCustomLeft ? "Remover" : "Personalizar"}
                    </ToggleButton>
                  ) : (
                    <ToggleButton isActive={useCustomRight} onClick={() => toggleCustomColor("right")}>
                      {useCustomRight ?  "Remover" : "Personalizar"}
                    </ToggleButton>
                  )}
                </TabsList>

                <TabContent isActive={activeTab === "left"}>
                  

                  {useCustomLeft && (
                    <ColorPickerContainer >
                      <HexColorPicker color={leftColor} onChange={setLeftColor}    style={{ width: '100%' }} />
                    </ColorPickerContainer>
                  )}

                  <ColorsSection>
                    <SectionTitle>Cores Vibrantes</SectionTitle>
                    <ColorsGrid>
                      {presetColors.map((preset) => (
                        <ColorButton
                          key={preset.color}
                          bgColor={preset.color}
                          onClick={() => applyPresetColor(preset.color)}
                          title={preset.name}
                        />
                      ))}
                    </ColorsGrid>

                    <SectionTitle>Cores Terrosas</SectionTitle>
                    <ColorsGrid>
                      {earthColors.map((preset) => (
                        <ColorButton
                          key={preset.color}
                          bgColor={preset.color}
                          onClick={() => applyPresetColor(preset.color)}
                          title={preset.name}
                        />
                      ))}
                    </ColorsGrid>
                  </ColorsSection>
                </TabContent>

                <TabContent isActive={activeTab === "right"}>
                 
                  {useCustomRight && (
                    <ColorPickerContainer>
                      <HexColorPicker color={rightColor} onChange={setRightColor}   style={{ width: '100%' }}/>
                    </ColorPickerContainer>
                  )}

                  <ColorsSection>
                    <SectionTitle>Cores Vibrantes</SectionTitle>
                    <ColorsGrid>
                      {presetColors.map((preset) => (
                        <ColorButton
                          key={preset.color}
                          bgColor={preset.color}
                          onClick={() => applyPresetColor(preset.color)}
                          title={preset.name}
                        />
                      ))}
                    </ColorsGrid>

                    <SectionTitle>Cores Terrosas</SectionTitle>
                    <ColorsGrid>
                      {earthColors.map((preset) => (
                        <ColorButton
                          key={preset.color}
                          bgColor={preset.color}
                          onClick={() => applyPresetColor(preset.color)}
                          title={preset.name}
                        />
                      ))}
                    </ColorsGrid>
                  </ColorsSection>
                </TabContent>
              </TabsContainer>
            </CardContent>
          </Card>
        </Grid>
      </Wrapper>
    </Container>
  )
}


// Styled Components
const Container = styled.div`
  min-height: 100vh;
  padding: 1.5rem;
  color: white;
 
`

const Wrapper = styled.div`
  max-width: 72rem;
  height: 90vh;
  margin: 0 auto;
  
 
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.5rem;
  padding: 0.4em;
  border-bottom: 1px solid rgba(46, 49, 48, 0.747); 
`

const Title = styled.h1`
  font-size: 18px;
  font-family: 'InterSemiBold', monospace;
  font-weight: bold;
   
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
`

const Grid = styled.div`
  display: grid;
 
  grid-template-columns: 1fr;
  gap: 1.5rem;
 
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`

const Card = styled.div`
   
  border: 1px solid #272a29;  
 background-color: #2224227f;
  border-radius: 1rem;
  overflow: hidden;
`

const CardHeader = styled.div`
  padding: 1.25rem 1.25rem 0rem;
`

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  font-family: 'Akac', sans-serif;
  font-weight: 300;
  text-transform: uppercase;
  color: #b0b4b8;
`

const CardContent = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction:column;

   
   @media screen and (max-width: 768px) {
  padding: 0.75rem;
   }

 
`

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`

const PresetButton = styled.button<{ bgImage: string }>`
  height: 5rem;
  background: ${(props) => props.bgImage};
  border: 1px solid #27272a; /* zinc-800 */
  border-radius: 0.375rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &:hover {
    border-color: #33754f;
  }
`

const PresetLabel = styled.span`
  position: absolute;
  bottom: 0.25rem;
  left: 0.25rem;
  font-size: 0.75rem;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0 0.25rem;
  border-radius: 0.25rem;
    font-family: 'Inter', monospace;
`

const Preview = styled.div<{ gradient: string }>`
  width: 100%;
  height: 10rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.gradient};
`

const PreviewContent = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  padding: 0.75rem;
  border-radius: 0.5rem;
`

const PreviewText = styled.p`
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
`

const ApplyButton = styled.button`
  background-color: white;
  color: black;
  font-size: 0.75rem;
  font-family: 'Inter', sans-serif;
  padding: 0.5em 1em 0.5em;
  border-radius: 9999px;
  border: none;
  transition: 0.4s all;
  &:hover{
     background-color: #33e076;
  }
   
`

const TabsContainer = styled.div`
  width: 100%;
  
`

const TabsList = styled.div`
  display: flex;
  background-color: #202220; /* zinc-800 */
  border-radius: 75rem;
 
  margin-bottom: 1rem;
  overflow: hidden;
 
`

const TabTrigger = styled.button<{ isActive?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
  padding: 0.5rem 0.5rem;
  font-size: 0.875rem;
  transition: 0.9s all;
  font-family: 'ProximaNova-Italic', monospace;
  background-color: ${(props) => (props.isActive ? "#1f2421" : "transparent")};
  color: ${(props) => (props.isActive ? "#c3ceca" : "rgba(255, 255, 255, 0.7)")};
  border: none;
  
   @media screen and (max-width: 768px) {
  font-size: 0.575rem;
   }

  ul{
    display: flex;
  align-items: center;
  gap: 3px;
  }
  
  &:hover {
    background-color: ${(props) => (props.isActive ? "#383d3b" : "rgba(31, 29, 29, 0.1)")};
  
  }
`

const ColorDot = styled.div<{ color: string }>`
  width: 14%;
  height: 0.75rem;
  border-radius: 9999px;
  margin-left: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: ${(props) => props.color};
`

const ToggleButton = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? "#30da7c" : "#dfe7e3")};
  color: black;
  font-family: 'Inter', monospace;
  border: ${(props) => (props.isActive ? "none" : "1px solid #3f3f46")};
  border-radius: 24px;
  padding: 0.2rem 1em 0.2rem;
  font-size: 0.75rem;
  margin: 0.3em;
 margin-left: 0.4em;
  
  &:hover {
    background-color: ${(props) => (props.isActive ? "#dfe7e3" : "rgba(255, 255, 255, 0.1)")};
  }
`

const TabContent = styled.div<{ isActive?: boolean }>`
  display: ${(props) => (props.isActive ? "block" : "none")};
  margin-top: 0;
  gap: 1rem;
  
   
 
`

const OpacityControl = styled.div`
  display: flex;
  align-items: top;
  gap: 0.5rem;
  background-color: rgba(44, 46, 45, 0.473);
  padding: 0.3em 0.3em 0.2em;
  border-radius: 9px;
  margin-bottom: 1rem;
`

 
const SliderContainer = styled.div`
  width: 8rem;
  position: relative;
`

const Slider = styled.input`
  width: 100%;
  height: 17px;
  background: #272729;
  padding: 0.3em;
  border-radius: 9999px;
  appearance: none;
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 9px;
    height: 9px;
    background: #a4c2ba;
    border-radius: 50%;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 9px;
    height: 9px;
    background: #a4c2ba;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
`

const OpacityValue = styled.span`
  font-size: 0.875rem;
  width: 2rem;
  font-family: 'ldvision', sans-serif;
`

const ColorPickerContainer = styled.div`
  margin-bottom: 1rem;
 
`

const ColorsSection = styled.div`
 
`

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
 
  font-family: 'Akac', sans-serif;
  font-weight: 300;
  text-transform: uppercase;
  color: #b0b4b8;
  margin-bottom: 0.5rem;
`

const ColorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;

 @media screen  and (max-width: 768px) {
  grid-template-columns: repeat(6, 1fr);
  
 }

`

const ColorButton = styled.button<{ bgColor: string }>`
  width: 35px;
  height: 35px;
  aspect-ratio: 1/1;
  background-color: ${(props) => props.bgColor};
  border: 1px solid #3f3f46; /* zinc-700 */
  border-radius:50%;
  transition: all 0.2s;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
    border-color: white;
  }
`