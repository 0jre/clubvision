"use client"
import ROUTENVX from "@/routes/routes"
import styled, { keyframes } from "styled-components"
import router from 'next/router';

interface SkinCardProps {
  title: string
  name: string
  price: string
  odds: string
  imageUrl: string
  href: any;
  skin: string;
  color: string;
}

export default function SkinCard({
  title,
  name,
  price,
  odds,
  skin,
  color,
  imageUrl,
  href,
}: SkinCardProps) {
  const navigateToProduct = (item: any) => {
        // Create a URL-friendly name from the item
        const productName = encodeURIComponent(item.nameitem.toLowerCase().replace(/\s+/g, "-"))
        router.push(`${ROUTENVX.viewitem}/${productName}?id=${item.id}`)
      }
  return (
    <CardContainer data-testid="case-content-card">
      <CardInner>
        <GlowEffect />
        <CardLink onClick={() => navigateToProduct(href)}  />

        <CardHeader>
          <InfoButton data-testid="case-info-btn">
            <InfoIcon><img src="/nvrp/20230331_230855.png" alt="novision" width={90} height={90} /></InfoIcon>
          </InfoButton>

          <OddsContainer>
            <OddsColumn>
              <OddsLabel>Chance</OddsLabel>
              <OddsValue data-testid="case-content-cards-grid-item-odds-percentage">{odds}</OddsValue>
            </OddsColumn>
          </OddsContainer>
        </CardHeader>

        <ImageContainer>
          <HexagonSVG width="136" height="136" viewBox="0 0 136 136" fill="none">
            <g filter="url(#filter0_d_3528_6694)">
              <HexagonPath d="M64 5.3094C66.4752 3.88034 69.5248 3.88034 72 5.3094L120.292 33.1906C122.767 34.6197 124.292 37.2607 124.292 40.1188V95.8812C124.292 98.7393 122.767 101.38 120.292 102.809L72 130.691C69.5248 132.12 66.4752 132.12 64 130.691L15.7083 102.809C13.2331 101.38 11.7083 98.7393 11.7083 95.8812V40.1188C11.7083 37.2607 13.2331 34.6197 15.7083 33.1906L64 5.3094Z" />
            </g>
            <g data-hex-emblem-stroke="true" filter="url(#filter1_d_3528_6694)">
              <HexagonStroke d="M71.75 5.74241L120.042 33.6236C122.362 34.9634 123.792 37.4393 123.792 40.1188V95.8812C123.792 98.5607 122.362 101.037 120.042 102.376L71.75 130.258C69.4295 131.597 66.5705 131.597 64.25 130.258L15.9583 102.376C13.6378 101.037 12.2083 98.5607 12.2083 95.8812V40.1188C12.2083 37.4393 13.6378 34.9634 15.9583 33.6236L64.25 5.74241C66.5705 4.40267 69.4295 4.40267 71.75 5.74241Z" />
            </g>
            <HexagonInner
              data-hex-emblem-inner="true"
              d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
              fillOpacity="0.18"
            />
            <HexagonInner
              data-hex-emblem-inner="true"
              d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
              fillOpacity="0.18"
            />
            <HexagonInner
              data-hex-emblem-inner="true"
              d="M64.0001 27.2948C66.4753 25.8657 69.5249 25.8657 72.0001 27.2948L101.252 44.1833C103.727 45.6124 105.252 48.2534 105.252 51.1115V84.8886C105.252 87.7467 103.727 90.3878 101.252 91.8168L72.0001 108.705C69.5249 110.134 66.4753 110.134 64.0001 108.705L34.7482 91.8168C32.273 90.3878 30.7482 87.7467 30.7482 84.8886V51.1115C30.7482 48.2534 32.273 45.6124 34.7482 44.1833L64.0001 27.2948Z"
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

          <SkinImage
            loading="lazy"
            alt={`${title} | ${name}`}
            src={imageUrl}
            
          />
        </ImageContainer>

        <CardFooter>
          <SkinCategory data-testid="case-content-cards-grid-item-category">{title} &shy;</SkinCategory>
          <SkinName data-testid="case-content-cards-grid-item-name"> {name}&shy;</SkinName>
          <PriceTag data-testid="case-content-cards-grid-item-price">{price}</PriceTag>
        </CardFooter>

        <BottomBorder />
      </CardInner>
    </CardContainer>
  )
}

// Styled Components
const CardContainer = styled.li`
  will-change: transform;
  width: 240px;
`

const CardInner = styled.div`
  position: relative;
  
  display: flex;
  aspect-ratio: 177/200;
  min-height: 0;
 

  flex-direction: column;
  border-radius: 0.5rem;
  border: 2px solid #1e1f1e;
  background: radial-gradient(
    118.46% 167.08% at 38% 110%,
    var(--color-blue-16, #232d27) 0%,
    var(--color-grey-10, #17171c) 80%
  );
  transition: colors 400ms cubic-bezier(0.87, 0, 0.13, 1);
  will-change: transform;
  
  &:hover {
    border: 2px solid #1e211e;
  }
`
 

const GlowEffect = styled.div`
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 400ms cubic-bezier(0.87, 0, 0.13, 1);
  will-change: transform;
  background: radial-gradient(circle at center, rgba(53, 201, 115, 0.274) 0%, rgba(255, 203, 119, 0) 70%);
  
  ${CardInner}:hover & {
    opacity: 1;
  }
`

const CardLink = styled.button`
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

const InfoButton = styled.button`
  z-index: 30;
  align-self: start;
  justify-self: start;
  font-size: 10px;
`

const InfoIcon = styled.div`
  width: 2em;
  height: 2em;
  transition: colors 200ms;
`

const OddsContainer = styled.div`
  z-index: 10;
  margin-left: auto;
  text-align: right;
  font-size: 10px;
  text-transform: uppercase;
  line-height: 1.25;
  color: #9aa1b1; 
`

const OddsColumn = styled.div`
  display: flex;
  flex-direction: column;
`

const OddsLabel = styled.span`
  font-weight: 500;
`

const OddsValue = styled.span`
  font-weight: 600;
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

const HexagonPath = styled.path`
  fill: #1f2220;
  transition: fill 200ms;
  
  ${CardInner}:hover & {
    fill: rgba(56, 77, 65, 0.08);
  }
`

const HexagonStroke = styled.path`
  stroke: #2c5c3f;
`

const HexagonInner = styled.path`
  fill: #181d1a;
  transition: fill 200ms;
  
  ${CardInner}:hover & {
    fill: #292e2a;
  }
`


const SkinImage = styled.img`
  pointer-events: none;
  position: absolute;
  width: 83.333333%;
  object-fit: contain;
  transition: 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
  
  ${CardInner}:hover & {
    transform: scale(0.9);
  }
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

const SkinCategory = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.75rem;
  color: #9aa1b1; /* navy-200 */
`

const SkinName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  color: white;
`

const PriceTag = styled.div`
  margin-top: 0.5rem;
  border-radius: 0.25rem;
  background-color: #173d28; /* gold-800 */
  padding: 0.4375rem 0;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  color: #d4ddd8; /* gold-400 */
`

const BottomBorder = styled.div`
  position: absolute;
  inset-x: 1.75rem;
  bottom: -1px;
  height: 1px;
  background-color: rgb(53, 201, 115);
`

