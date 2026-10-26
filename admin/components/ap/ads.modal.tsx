"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styled, { keyframes, css } from "styled-components"
import axios from "axios"
import { Plus, Settings, Calendar, Trash2, ImageIcon, ExternalLink } from "lucide-react"

interface AdsAnnounce {
  _id: string
  descriptions: string
  title: string
  about: string
  redirect: string
  thumbnailUrl: string
}

export default function SophisticatedModalAds() {
  const [title, setTitle] = useState("")
  const [About, setAbout] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [DateLanc, setDateLanc] = useState("")
  const [isAdsAnnounce, setAdsAnnounce] = useState<AdsAnnounce[]>([])
  const [descriptions, setDescriptions] = useState("")
  const [Redirect, setRedirect] = useState("")
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState<"create" | "manage">("create")

  const isFormValid = title && thumbnailUrl && About && Redirect && descriptions

  useEffect(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const formattedDate = `${day}/${month}/${year}`
    setDateLanc(formattedDate)
  }, [])

  const fetchVideos = async () => {
    const response = await fetch("/api/ads/advertising")
    const data = await response.json() as AdsAnnounce
    setAdsAnnounce(data as any)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/ads/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, thumbnailUrl, descriptions, DateLanc, About, Redirect }),
      })

      if (response.status === 201) {
        fetchVideos()
        setIsFormSubmitted(true)
        setTimeout(() => setIsFormSubmitted(false), 2000)
      } else {
        console.error("Erro ao adicionar Ads")
      }
    } catch (error) {
      console.error("Erro ao adicionar Ads:", error)
    }

    // Reset form
    setTitle("")
    setThumbnailUrl("")
    setDescriptions("")
    setDateLanc("")
    setAbout("")
    setRedirect("")
    fetchVideos()
  }

  const AdsManagement = () => {
    const [Ads, setAds] = useState<AdsAnnounce[]>([])

    const fetchAds = async () => {
      try {
        const response = await fetch("/api/ads/advertising")
        const data = await response.json() as AdsAnnounce
        setAds(data as any)
      } catch (error) {
        console.error("Error fetching ads:", error)
        setAds([])
      }
    }

    useEffect(() => {
      fetchAds()
    }, [])

    const handleDeleteAds = async (_id: string) => {
      try {
        const deleteResponse = await axios.delete(`/api/ads/delete?AdsI=${_id}`)
        console.log(deleteResponse.data.message)
        fetchAds()
      } catch (error) {
        console.error("Error deleting Ads:", error)
      }
    }

    return (
      <ManagementContainer>
        <SectionTitle>Gerenciar Anúncios</SectionTitle>
        <AdsList>
          {Ads.length === 0 ? (
            <EmptyState>
              <ImageIcon size={48} color="#9ca3af" />
              <EmptyTitle>Nenhum anúncio encontrado</EmptyTitle>
              <EmptySubtitle>Crie seu primeiro anúncio na aba "Criar Anúncio"</EmptySubtitle>
            </EmptyState>
          ) : (
            Ads.map((ad) => (
              <AdCard key={ad._id}>
                <AdThumbnail>
                  <img src={ad.thumbnailUrl || "/placeholder.svg?height=80&width=120"} alt={ad.title} />
                </AdThumbnail>
                <AdContent>
                  <AdTitle>{ad.title}</AdTitle>
                  <AdDescription>{ad.descriptions}</AdDescription>
                  <AdMeta>
                    <CategoryBadge>{ad.about}</CategoryBadge>
                    <RedirectLink href={ad.redirect} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={12} />
                      Ver anúncio
                    </RedirectLink>
                  </AdMeta>
                </AdContent>
                <AdActions>
                  <DeleteButton onClick={() => handleDeleteAds(ad._id)}>
                    <Trash2 size={16} />
                    Remover
                  </DeleteButton>
                </AdActions>
              </AdCard>
            ))
          )}
        </AdsList>
      </ManagementContainer>
    )
  }

  return (
    <>
      <ModalContainer>
        <ModalHeader>
          <HeaderContent>
            <HeaderTitle>Painel de Anúncios</HeaderTitle>
            <HeaderSubtitle>Crie e gerencie anúncios da plataforma</HeaderSubtitle>
          </HeaderContent>
          <TabNavigation>
            <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>
              <Plus size={20} />
              Criar Anúncio
            </TabButton>
            <TabButton active={activeTab === "manage"} onClick={() => setActiveTab("manage")}>
              <Settings size={20} />
              Gerenciar
            </TabButton>
          </TabNavigation>
        </ModalHeader>

        <ModalContent>
          {activeTab === "create" && (
            <CreateSection>
              <SectionTitle>Criar Novo Anúncio</SectionTitle>
              <FormContainer onSubmit={handleSubmit}>
                <FormGrid>
                  <ThumbnailSection>
                    <InputLabel>Imagem do Anúncio</InputLabel>
                    <ThumbnailPreview thumbnail={thumbnailUrl}>
                      {thumbnailUrl ? (
                        <PreviewImage src={thumbnailUrl} alt="Preview" />
                      ) : (
                        <ThumbnailPlaceholder>
                          <ImageIcon size={48} color="#9ca3af" />
                          <span>Adicionar Imagem</span>
                        </ThumbnailPlaceholder>
                      )}
                      <ThumbnailInput
                        type="text"
                        placeholder="URL da imagem"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                      />
                    </ThumbnailPreview>
                  </ThumbnailSection>

                  <FormFields>
                    <InputGroup>
                      <InputLabel>Título do Anúncio</InputLabel>
                      <StyledInput
                        type="text"
                        placeholder="Digite o título"
                        maxLength={30}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                      <CharCount>{title.length}/30</CharCount>
                    </InputGroup>

                    <InputGroup>
                      <InputLabel>Categoria</InputLabel>
                      <StyledInput
                        type="text"
                        placeholder="Categoria do anúncio"
                        maxLength={20}
                        value={About}
                        onChange={(e) => setAbout(e.target.value)}
                        required
                      />
                      <CharCount>{About.length}/20</CharCount>
                    </InputGroup>

                    <InputGroup>
                      <InputLabel>Descrição</InputLabel>
                      <StyledTextarea
                        placeholder="Descreva seu anúncio..."
                        value={descriptions}
                        maxLength={200}
                        onChange={(e) => setDescriptions(e.target.value)}
                        required
                      />
                      <CharCount>{descriptions.length}/200</CharCount>
                    </InputGroup>

                    <InputGroup>
                      <InputLabel>Link de Redirecionamento</InputLabel>
                      <StyledInput
                        type="url"
                        placeholder="https://exemplo.com"
                        maxLength={40}
                        value={Redirect}
                        onChange={(e) => setRedirect(e.target.value)}
                        required
                      />
                      <CharCount>{Redirect.length}/40</CharCount>
                    </InputGroup>

                    <DateInfo>
                      <Calendar size={16} />
                      <span>Data de criação: {DateLanc}</span>
                    </DateInfo>
                  </FormFields>
                </FormGrid>

                <SubmitSection>
                  <SubmitButton type="submit" disabled={!isFormValid || isFormSubmitted} submitted={isFormSubmitted}>
                    {isFormSubmitted ? (
                      <>
                        <Plus size={20} />
                        Anúncio Criado!
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Criar Anúncio
                      </>
                    )}
                  </SubmitButton>
                </SubmitSection>
              </FormContainer>
            </CreateSection>
          )}

          {activeTab === "manage" && <AdsManagement />}
        </ModalContent>
      </ModalContainer>
    </>
  )
}

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`

 

const ModalContainer = styled.div`
   
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
 
`

const HeaderContent = styled.div`
  margin-bottom: 24px;
`

const HeaderTitle = styled.h1`
  color: #1f2937;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`

const HeaderSubtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 16px;
`

const TabNavigation = styled.div`
  display: flex;
  gap: 8px;
`

const TabButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 28px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ active }) =>
    active
      ? css`
        background-color: #3bf699;
        color: #ffffff;
        border-color: #3bf699;
        box-shadow: 0 1px 3px rgba(59, 130, 246, 0.3);
      `
      : css`
        background-color: #ffffff;
        color: #6b7280;
        
        &:hover {
          background-color: #f9fafb;
          color: #374151;
          border-color: #d1d5db;
        }
      `}
`

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background-color: #f9fafb;
`

const CreateSection = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`

const SectionTitle = styled.h2`
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 24px 0;
  font-family: 'Inter', sans-serif;
`

const FormContainer = styled.form`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const ThumbnailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ThumbnailPreview = styled.div<{ thumbnail: string }>`
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f3f4f6;
  border: 2px dashed ${({ thumbnail }) => (thumbnail ? "#e5e7eb" : "#d1d5db")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3bf6be;
  }
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const ThumbnailInput = styled.input`
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  color: #1f2937;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const ThumbnailPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #9ca3af;
  
  span {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
  }
`

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const InputLabel = styled.label`
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`

const StyledInput = styled.input`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 16px;
  color: #1f2937;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }
`

const StyledTextarea = styled.textarea`
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px 16px;
  color: #1f2937;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:hover {
    border-color: #9ca3af;
  }
`

const CharCount = styled.span`
  font-size: 12px;
  color: #9ca3af;
  text-align: right;
  font-family: 'Inter', sans-serif;
`

const DateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

const SubmitSection = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 8px;
`

const SubmitButton = styled.button<{ submitted: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  justify-content: center;
  
  ${({ submitted }) =>
    submitted
      ? css`
        background-color: #10b981;
        color: #ffffff;
        animation: ${pulse} 0.6s ease-in-out;
      `
      : css`
        background-color: #3b82f6;
        color: #ffffff;
        
        &:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        &:disabled {
          background-color: #9ca3af;
          color: #ffffff;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
      `}
`

const ManagementContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`

const AdsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const AdCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  transition: all 0.2s ease;
  animation: ${slideIn} 0.5s ease-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const AdThumbnail = styled.div`
  img {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
`

const AdContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const AdTitle = styled.h3`
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  font-family: 'Inter', sans-serif;
`

const AdDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  font-family: 'Inter', sans-serif;
  line-height: 1.5;
`

const AdMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const CategoryBadge = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
`

const RedirectLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`

const AdActions = styled.div`
  display: flex;
  gap: 8px;
`

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #fca5a5;
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fee2e2;
    border-color: #f87171;
    transform: scale(1.02);
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`

const EmptyTitle = styled.h3`
  color: #374151;
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  font-family: 'Inter', sans-serif;
`

const EmptySubtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0;
  font-family: 'Inter', sans-serif;
`
