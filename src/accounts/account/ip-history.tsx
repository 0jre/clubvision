import styled from "styled-components"
import { MapPin, Clock, Globe, Flag } from "lucide-react"

const IPHistoryContainer = styled.div`
background-color: #38383b11;
  border-radius: 16px;
  padding: 0.6rem;
  margin-bottom: 2rem;
  font-family: 'ProximaNova-Italic', monospace;
`
 

const IPList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const IPItem = styled.div`
  background-color: #38383b11;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const IPIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: rgba(65, 180, 94, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #41b45e;
  }
`

const IPContent = styled.div`
  flex: 1;
`

const IPAddress = styled.h3`
  color: #f9fafb;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  font-family: 'Monaco', 'Menlo', monospace;
`

const IPDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
`

const IPDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #505350;
  font-size: 0.875rem;
  
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  .value {
    color: #d1d5db;
    font-weight: 500;
  }
`

const IPStats = styled.div`
  display: flex;
  gap: 1rem;
`

const StatBadge = styled.div`
  background: rgba(65, 180, 94, 0.1);
  color: #41b45e;
  padding: 0.25rem 0.75rem;
  border-radius: 26px;
  font-size: 0.75rem;
  font-weight: 500;
`


const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.2rem;
  padding-bottom: 0.75rem;
  font-family: 'InterSemiBold', monospace;
 
`

const SectionIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  background: linear-gradient(145deg, #262926 0%, rgba(67, 85, 71, 0.068) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
    color: #525853;
  }
`

const SectionTitle = styled.h2`
  color: #f9fafb;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
`

const LogCount = styled.span`
   background: linear-gradient(145deg, #262926 0%, rgba(67, 85, 71, 0.068) 100%);
  color: #505351;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`


interface IPHistoryCardProps {
  ipHistory: Array<{
    ip: string
    country: string
    city: string
    country_code: string
    firstSeen: Date
    lastSeen: Date
    loginCount: number
  }>
}

export default function IPHistoryCard({ ipHistory }: IPHistoryCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const getCountryFlag = (countryCode: string) => {
    // Usando emoji flags baseado no country code
    const flags: Record<string, string> = {
      BR: "🇧🇷",
      US: "🇺🇸",
      PT: "🇵🇹",
      ES: "🇪🇸",
      FR: "🇫🇷",
      DE: "🇩🇪",
      IT: "🇮🇹",
      UK: "🇬🇧",
      CA: "🇨🇦",
      AU: "🇦🇺",
    }
    return flags[countryCode] || "🌍"
  }

  return (
    <>
    <SectionHeader>
        <SectionIcon>  <Globe /> </SectionIcon>
        <SectionTitle>Histórico de IPs</SectionTitle>
        <LogCount>{ipHistory.length}</LogCount>
      </SectionHeader>
     
    <IPHistoryContainer>
     

      <IPList>
        {ipHistory.map((ip, index) => (
          <IPItem key={`${ip.ip}-${index}`}>
            <IPIcon>
              <MapPin />
            </IPIcon>

            <IPContent>
              <IPAddress>{ip.ip}</IPAddress>

              <IPDetails>
                <IPDetail>
                  <Flag />
                  <span>{getCountryFlag(ip.country_code)}</span>
                  <span className="value">{ip.country}</span>
                </IPDetail>

                <IPDetail>
                  <MapPin />
                  <span className="value">{ip.city}</span>
                </IPDetail>

                <IPDetail>
                  <Clock />
                  <span>Primeiro acesso:</span>
                  <span className="value">{formatDate(ip.firstSeen)}</span>
                </IPDetail>

                <IPDetail>
                  <Clock />
                  <span>Último acesso:</span>
                  <span className="value">{formatDate(ip.lastSeen)}</span>
                </IPDetail>
              </IPDetails>

              <IPStats>
                <StatBadge>
                  {ip.loginCount} login{ip.loginCount !== 1 ? "s" : ""}
                </StatBadge>
              </IPStats>
            </IPContent>
          </IPItem>
        ))}
      </IPList>
    </IPHistoryContainer>
    </>
  )
}
