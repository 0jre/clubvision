"use client"
import ROUTENVX from "@/routes/routes"
import styled from "styled-components"

interface BattlePassItemCardProps {
  title: string
  name: string
  tier: number
  xpRequired: number
  imageUrl: string
  href: string
  rarity: string
  color: string
  isUnlocked: boolean
  isClaimed: boolean
  isPremium?: boolean
  onClaim?: () => void
}

export default function BattlePassItemCard({
  title,
  name,
  tier,
  xpRequired,
  rarity,
  color,
  imageUrl,
  href,
  isUnlocked,
  isClaimed,
  isPremium = false,
  onClaim,
}: BattlePassItemCardProps) {
  return (
    <CardContainer data-testid="battlepass-item-card">
      <CardInner isUnlocked={isUnlocked} isClaimed={isClaimed} isPremium={isPremium}>
        <GlowEffect isPremium={isPremium} />
       

        <CardHeader>
          <TierBadge isPremium={isPremium}>
            <TierIcon>{isPremium ? "💎" : "👑"}</TierIcon>
            <TierText>NÍVEL {tier}</TierText>
          </TierBadge>

          <StatusContainer>
            <StatusColumn>
              <StatusLabel>Status</StatusLabel>
              <StatusValue isClaimed={isClaimed} isUnlocked={isUnlocked}>
                {isClaimed ? "RESGATADO" : isUnlocked ? "DISPONÍVEL" : "BLOQUEADO"}
              </StatusValue>
            </StatusColumn>
          </StatusContainer>
        </CardHeader>

        <ImageContainer>
          <HexagonSVG width="136" height="136" viewBox="0 0 136 136" fill="none">
            <g filter="url(#filter0_d_3528_6694)">
              <HexagonPath
                d="M64 5.3094C66.4752 3.88034 69.5248 3.88034 72 5.3094L120.292 33.1906C122.767 34.6197 124.292 37.2607 124.292 40.1188V95.8812C124.292 98.7393 122.767 101.38 120.292 102.809L72 130.691C69.5248 132.12 66.4752 132.12 64 130.691L15.7083 102.809C13.2331 101.38 11.7083 98.7393 11.7083 95.8812V40.1188C11.7083 37.2607 13.2331 34.6197 15.7083 33.1906L64 5.3094Z"
                isPremium={isPremium}
                isUnlocked={isUnlocked}
              />
            </g>
            <g data-hex-emblem-stroke="true" filter="url(#filter1_d_3528_6694)">
              <HexagonStroke
                d="M71.75 5.74241L120.042 33.6236C122.362 34.9634 123.792 37.4393 123.792 40.1188V95.8812C123.792 98.5607 122.362 101.037 120.042 102.376L71.75 130.258C69.4295 131.597 66.5705 131.597 64.25 130.258L15.9583 102.376C13.6378 101.037 12.2083 98.5607 12.2083 95.8812V40.1188C12.2083 37.4393 13.6378 34.9634 15.9583 33.6236L64.25 5.74241C66.5705 4.40267 69.4295 4.40267 71.75 5.74241Z"
                isPremium={isPremium}
                isUnlocked={isUnlocked}
              />
            </g>
            <HexagonInner
              data-hex-emblem-inner="true"
              d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
              fillOpacity="0.18"
              isPremium={isPremium}
              isUnlocked={isUnlocked}
            />

            <defs>
              <filter
                id="filter0_d_3528_6694"
                x="11.7085"
                y="4.2373"
                width="112.583"
                height="131.525"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dy="4"></feOffset>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3528_6694"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3528_6694" result="shape"></feBlend>
              </filter>
              <filter
                id="filter1_d_3528_6694"
                x="11.7085"
                y="4.2373"
                width="112.583"
                height="131.525"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                ></feColorMatrix>
                <feOffset dy="4"></feOffset>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3528_6694"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3528_6694" result="shape"></feBlend>
              </filter>
            </defs>
          </HexagonSVG>
{/* 
          <ItemImage loading="lazy" alt={`${title} | ${name}`} src={imageUrl} isUnlocked={isUnlocked} /> */}

          {/* Overlay para itens bloqueados */}
          {!isUnlocked && (
            <LockedOverlay>
              <LockIcon>🔒</LockIcon>
              <LockText>NÍVEL {tier}</LockText>
            </LockedOverlay>
          )}

          {/* Overlay para itens resgatados */}
          {isClaimed && (
            <ClaimedOverlay>
              <CheckIcon>✓</CheckIcon>
            </ClaimedOverlay>
          )}
        </ImageContainer>

        <CardFooter>
          <ItemCategory data-testid="battlepass-item-category">{title}</ItemCategory>
          <ItemName data-testid="battlepass-item-name">{name}</ItemName>
          <RarityTag rarity={rarity} data-testid="battlepass-item-rarity">
            {rarity}
          </RarityTag>

          {isUnlocked && !isClaimed && onClaim && (
            <ClaimButton onClick={onClaim} isPremium={isPremium}>
              <ClaimIcon>🎁</ClaimIcon>
              RESGATAR
            </ClaimButton>
          )}

          {!isUnlocked && (
            <XPRequirement>
              <XPIcon>⚡</XPIcon>
              {xpRequired} XP
            </XPRequirement>
          )}
        </CardFooter>

        <BottomBorder isPremium={isPremium} />
      </CardInner>
    </CardContainer>
  )
}

// Styled Components
const CardContainer = styled.li`
  will-change: transform;
  width: 240px;
`

const CardInner = styled.div<{ isUnlocked: boolean; isClaimed: boolean; isPremium: boolean }>`
  position: relative;
  display: flex;
  aspect-ratio: 177/200;
  min-height: 0;
  flex-direction: column;
  border-radius: 0.5rem;
  border: 2px solid ${(props) => {
    if (props.isClaimed) return "#4caf50"
    if (props.isUnlocked) {
      return props.isPremium ? "#00bcd4" : "#8bc34a"
    }
    return "#1e1f1e"
  }};
  background: radial-gradient(
    118.46% 167.08% at 38% 110%,
    ${(props) => {
      if (props.isPremium) return "var(--color-blue-16, #1a2e2e)"
      return "var(--color-green-16, #232d27)"
    }} 0%,
    var(--color-grey-10, #17171c) 80%
  );
  transition: all 400ms cubic-bezier(0.87, 0, 0.13, 1);
  will-change: transform;
  opacity: ${(props) => (props.isUnlocked ? 1 : 0.7)};
  
  &:hover {
    border: 2px solid ${(props) => {
      if (props.isClaimed) return "#4caf50"
      if (props.isUnlocked) {
        return props.isPremium ? "#00bcd4" : "#8bc34a"
      }
      return "#2a2b2a"
    }};
    transform: ${(props) => (props.isUnlocked ? "translateY(-4px)" : "none")};
  }
`

const GlowEffect = styled.div<{ isPremium: boolean }>`
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 400ms cubic-bezier(0.87, 0, 0.13, 1);
  will-change: transform;
  background: ${(props) =>
    props.isPremium
      ? "radial-gradient(circle at center, rgba(0, 188, 212, 0.3) 0%, rgba(0, 188, 212, 0) 70%)"
      : "radial-gradient(circle at center, rgba(139, 195, 74, 0.3) 0%, rgba(139, 195, 74, 0) 70%)"};
  
  ${CardInner}:hover & {
    opacity: 1;
  }
`

const CardLink = styled.a`
  position: absolute;
  inset: 0;
  z-index: 20;
`

const CardHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 0.75rem;
  padding-bottom: 0;
`

const TierBadge = styled.div<{ isPremium: boolean }>`
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${(props) =>
    props.isPremium
      ? "linear-gradient(135deg, #3d413f 0%, #343636 100%)"
      : "linear-gradient(135deg, #8bc34a 0%, #689f38 100%)"};
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 2px 8px ${(props) => (props.isPremium ? "rgba(50, 52, 53, 0.3)" : "rgba(139, 195, 74, 0.3)")};
`

const TierIcon = styled.div`
  font-size: 9px;
`

const TierText = styled.span`
  font-size: 9px;
  letter-spacing: 0.5px;
`

const StatusContainer = styled.div`
  z-index: 10;
  margin-left: auto;
  text-align: right;
  font-size: 10px;
  text-transform: uppercase;
  line-height: 1.25;
`

const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const StatusLabel = styled.span`
  font-weight: 500;
  color: #9aa1b1;
`

const StatusValue = styled.span<{ isClaimed: boolean; isUnlocked: boolean }>`
  font-weight: 600;
  color: ${(props) => {
    if (props.isClaimed) return "#4caf50"
    if (props.isUnlocked) return "#8bc34a"
    return "#ff6b6b"
  }};
`

const ImageContainer = styled.div`
  position: relative;
  margin: auto;
  display: grid;
  min-height: 0;
  width: 83.333333%;
  flex: 1;
  place-items: center;
`

const HexagonSVG = styled.svg`
  height: 100%;
  width: 66.666667%;
`

const HexagonPath = styled.path<{ isPremium: boolean; isUnlocked: boolean }>`
  fill: ${(props) => {
    if (!props.isUnlocked) return "#1a1a1a"
    return props.isPremium ? "#1a2e2e" : "#1f2220"
  }};
  transition: fill 200ms;
  
  ${CardInner}:hover & {
    fill: ${(props) => {
      if (!props.isUnlocked) return "#1a1a1a"
      return props.isPremium ? "rgba(0, 188, 212, 0.1)" : "rgba(139, 195, 74, 0.1)"
    }};
  }
`

const HexagonStroke = styled.path<{ isPremium: boolean; isUnlocked: boolean }>`
  stroke: ${(props) => {
    if (!props.isUnlocked) return "#333"
    return props.isPremium ? "#00bcd4" : "#8bc34a"
  }};
  stroke-width: 1.5;
`

const HexagonInner = styled.path<{ isPremium: boolean; isUnlocked: boolean }>`
  fill: ${(props) => {
    if (!props.isUnlocked) return "#151515"
    return props.isPremium ? "#0d1a1a" : "#181d1a"
  }};
  transition: fill 200ms;
  
  ${CardInner}:hover & {
    fill: ${(props) => {
      if (!props.isUnlocked) return "#151515"
      return props.isPremium ? "#1a2e2e" : "#292e2a"
    }};
  }
`

const ItemImage = styled.img<{ isUnlocked: boolean }>`
  pointer-events: none;
  position: absolute;
  width: 83.333333%;
  object-fit: contain;
  transition: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
  filter: ${(props) => (props.isUnlocked ? "none" : "grayscale(100%) brightness(0.5)")};
  
  ${CardInner}:hover & {
    transform: ${(props) => (props.isUnlocked ? "scale(0.9)" : "none")};
  }
`

const LockedOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(800px);
  border-radius: 8px;
  height: 100px;
  z-index: 15;
`

const LockIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

const LockText = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #ff6b6b;
  text-transform: uppercase;
`

const ClaimedOverlay = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 15;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
`

const CheckIcon = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: white;
`

const CardFooter = styled.div`
  z-index: 10;
  width: 100%;
  align-self: flex-end;
  padding: 0.75rem;
  padding-top: 0;
  font-weight: 600;
  line-height: 1.25;
`

const ItemCategory = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  color: #9aa1b1;
`

const ItemName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  color: white;
  margin-bottom: 8px;
`

const RarityTag = styled.div<{ rarity: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.rarity.toLowerCase()) {
      case "comum":
        return "#6b7280"
      case "raro":
        return "#3b82f6"
      case "épico":
        return "#8b5cf6"
      case "lendário":
        return "#f59e0b"
      case "mítico":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }};
  color: white;
  margin-bottom: 8px;
`

const ClaimButton = styled.button<{ isPremium: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: ${(props) =>
    props.isPremium
      ? "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)"
      : "linear-gradient(135deg, #8bc34a 0%, #689f38 100%)"};
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 25;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${(props) => (props.isPremium ? "rgba(0, 188, 212, 0.4)" : "rgba(139, 195, 74, 0.4)")};
  }
`

const ClaimIcon = styled.div`
  font-size: 12px;
`

const XPRequirement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid #ff6b6b;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ff6b6b;
  text-transform: uppercase;
`

const XPIcon = styled.div`
  font-size: 12px;
`

const BottomBorder = styled.div<{ isPremium: boolean }>`
  position: absolute;
  inset-x: 1.75rem;
  bottom: -1px;
  height: 2px;
  background: ${(props) =>
    props.isPremium
      ? "linear-gradient(90deg, #00bcd4 0%, #0097a7 100%)"
      : "linear-gradient(90deg, #8bc34a 0%, #689f38 100%)"};
  border-radius: 1px;
`
