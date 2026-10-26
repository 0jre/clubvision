"use client"
import styled from "styled-components"
import { ArrowLeft, CheckCircle, Shield, Users, AlertTriangle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Prop {
  userInfo: any
  infox: any
  user: any
}
 
export default function Verification({ userInfo, infox, user }: Prop) {
  const router = useRouter()
  const isVerified = userInfo?.selo
  const isPrime = userInfo?.prime
  const isBloomUser = isPrime && userInfo.typeprime === "Bloom"

  const handleBack = () => {
    router.back()
  }

  const handleRetryVerification = () => {
    // Navigate to subscription page
    router.push("/central-subscription")
  }

  return (
    <Container>
   

      <ProfileSection>
        <ProfileImageContainer>
          <ProfileImage verified={isVerified}>
            <ProfileAvatar><Image src={user.avatar} alt={user.username} height={90} width={90}/></ProfileAvatar>
          </ProfileImage>
          <PrimeBadge verified={isVerified}>{isVerified ? <CheckCircle size={16} /> : <X size={16} />}</PrimeBadge>
        </ProfileImageContainer>

        <Username>
           <h4>Prime</h4>
          <VerifiedBadge verified={isVerified}>
         <svg viewBox="0 0 24 24" fill="none" className="verified" xmlns="http://www.w3.org/2000/svg" height="60" width="60" ><path fill-rule="evenodd" clip-rule="evenodd" d="M5 5h4l3-3 3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H5v-4l-3-3 3-3V5zm6.098 11.737l-5.414-5.684 5.414 1.894 7.218-5.684-7.218 9.474z" fill="currentColor"></path></svg>
          </VerifiedBadge>
        </Username>

        <StatusText verified={isVerified}>{isVerified ? "Conta verificada" : "Conta não verificada"}</StatusText>
      </ProfileSection>

      {isBloomUser && (
        <AlertBox type="warning">
          <AlertIcon type="warning">
            <AlertTriangle size={20} />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Falha na verificação</AlertTitle>
            <AlertText>A verificação Prime não está disponível para usuários do plano Bloom.</AlertText>
          </AlertContent>
        </AlertBox>
      )}

      {!isVerified && !isBloomUser && (
        <AlertBox type="error">
          <AlertIcon type="error">
            <AlertTriangle size={20} />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Falha na verificação</AlertTitle>
            <AlertText>Ocorreu um erro ao realizar esta operação</AlertText>
          </AlertContent>
        </AlertBox>
      )}

      <BenefitsList>
        <BenefitItem>
          <IconContainer>
            <CheckCircle size={20} />
          </IconContainer>
          <BenefitContent>
            <BenefitTitle>Assinatura Premium +</BenefitTitle>
            <BenefitDescription>
              Ao ativar sua assinatura premium + e ser elegível à verificação de ID, o selo de verificação é adicionado
              automaticamente em sua conta.
            </BenefitDescription>
          </BenefitContent>
        </BenefitItem>

        <BenefitItem>
          <IconContainer>
            <Users size={20} />
          </IconContainer>
          <BenefitContent>
            <BenefitTitle>Parceiros & Streamers</BenefitTitle>
            <BenefitDescription>
              A Novision valoriza os jogadores que contribuem como parceiros ou streamers da comunidade. Como forma de
              reconhecimento, esses membros recebem o selo de verificado.
            </BenefitDescription>
          </BenefitContent>
        </BenefitItem>

        <BenefitItem>
          <IconContainer>
            <Shield size={20} />
          </IconContainer>
          <BenefitContent>
            <BenefitTitle>Recursos Exclusivos</BenefitTitle>
            <BenefitDescription>
              Uma conta verificada é uma conta com acesso a recursos exclusivos no clubvision. <Link>Saiba mais</Link>
            </BenefitDescription>
          </BenefitContent>
        </BenefitItem>
      </BenefitsList>

      {isVerified ? (
        <UserInfoBox>
          <InfoRow>
            <InfoLabel>Assinatura de conta</InfoLabel>
            <InfoValue>{userInfo?.unic}</InfoValue>
          </InfoRow>

          {isPrime && (
            <InfoRow>
              <InfoLabel>Status Prime</InfoLabel>
              <InfoValue>
                {infox?.name}
                {infox?.subdominio} você está com o prime {userInfo.typeprime} ativado em sua conta.
              </InfoValue>
            </InfoRow>
          )}
        </UserInfoBox>
      ) : null}
    </Container>
  )
}




const Container = styled.div`
 
   position: relative;
  margin: 0 auto;
 
  min-height: 90vh;
 
  overflow: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #ffffff;
  animation: Opacity 1s linear;
  font-family: 'InterSemiBold', sans-serif;

  

   @media screen and (max-width: 680px) {
    max-width: 680px;
    width: 100%;
    border-radius: 0;
    max-height: 100vh;
    height: 100vh;
  }

`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
 
  color: #dee0e4;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
`

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #dee0e4;
  
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
`

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`

const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 16px;
`

const ProfileImage = styled.div<{ verified: boolean }>`
  width: 110px;
  height: 110px;
  border-radius: 50%;
 
    background: ${(props) =>
    props.verified
      ? "linear-gradient(135deg, #518f6b 0%, #202020 100%)"
      : "linear-gradient(135deg, #515251 0%, #202220 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #272928;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;

  img{
    border-radius: 50%;
  }
`

const PrimeBadge = styled.div<{ verified: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: ${(props) =>
    props.verified
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #2d2e2d 0%, #202220 100%)"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #1e1f1e;
  color: white;
`

const Username = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 24px;
  font-weight: 600;
  color: #dee0e4;
  margin-bottom: 8px;
`

const VerifiedBadge = styled.div<{ verified: boolean }>`
  color: ${(props) => (props.verified ? "#10b981" : "#6b7280")};
  display: flex;
  align-items: center;

  svg{
    height: 25px;
    width: 25px;
  }
`

const StatusText = styled.p<{ verified: boolean }>`
  color: ${(props) => (props.verified ? "#10b981" : "#b32f35")};
  font-size: 15px;
  font-weight: 500;
`

const AlertBox = styled.div<{ type: "warning" | "error" }>`
  background: ${(props) =>
    props.type === "warning"
      ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
      : "linear-gradient(135deg, rgba(192, 57, 57, 0.075) 0%, rgba(97, 37, 37, 0.089) 100%)"};
   font-family: 'Inter', sans-serif;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const AlertIcon = styled.div<{ type: "warning" | "error" }>`
  color: ${(props) => (props.type === "warning" ? "#f59e0b" : "#ef4444")};
  flex-shrink: 0;
  margin-top: 2px;
`

const AlertContent = styled.div`
  flex: 1;
`

const AlertTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #dee0e4;
  font-family: 'Inter', monospace;
  margin: 0 0 4px 0;
`

const AlertText = styled.p`
  font-size: 13px;
  color: #555855;
  margin: 0;
  line-height: 1.4;
`

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
`

const BenefitItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #518f6b3b 0%, #202020 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #10b981;
`

const BenefitContent = styled.div`
  flex: 1;
`

const BenefitTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #dee0e4;
  margin: 0 0 6px 0;
`

const BenefitDescription = styled.p`
  font-size: 14px;
  color: #6e7075;
  margin: 0;
  line-height: 1.5;
`

const UserInfoBox = styled.div`
  background: linear-gradient(135deg, #383a382b 0%, #1a1b1b 100%);
  border: 1px solid #373a39;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`

const InfoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const InfoLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`

const InfoValue = styled.span`
  font-size: 14px;
  color: #dee0e4;
  font-weight: 600;
`

const ActionButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const Link = styled.span`
  color: #10b981;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`
