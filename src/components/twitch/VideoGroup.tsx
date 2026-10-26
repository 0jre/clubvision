import styled from 'styled-components';
import VideoSingle from './VideoSingle';
import { useCallback, useMemo, useRef, useState } from 'react';

export interface VideoGroupProps {
  data?: DataProps[];
  children?: React.ReactNode;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export interface DataProps {
  _id: number;
  viewers: number;
  tags: string[];
  channel: {
    status: string;
    logo: string;
    display_name: string;
    url: string;
  };
  preview: {
    medium: string;
    large: string;
  };
}

function shuffleArray(arr: DataProps[]) {
  return arr.sort(() => Math.random() - 0.5);
}

const VideoGroup: React.FC<VideoGroupProps> = ({ 
  data, 
  children, 
  onLoadMore, 
  hasMore = false,
  isLoadingMore = false 
}) => {
  const [visibleCount, setVisibleCount] = useState(20);
  const [currentCategory, setCurrentCategory] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Garantir que os dados sejam embaralhados apenas uma vez
  const shuffledData = useMemo(() => shuffleArray([...(data ?? [])]), [data]);

  const filterData = useCallback((category: string) => {
    switch (category) {
      case "recommended":
        return shuffledData.filter(stream => stream.viewers >= 100 && stream.viewers <= 5000);
      case "engaged":
        return shuffledData.filter(stream => stream.viewers > 5000);
      case "new":
        return shuffledData.filter(stream => stream.viewers < 100);
      case "top":
        return shuffledData.filter(stream => stream.viewers > 10000);
      default:
        return shuffledData;
    }
  }, [shuffledData]);

  const searchData = useCallback((data: DataProps[]) => {
    if (!searchQuery) return data;
    return data.filter(stream => {
      const channelName = stream.channel?.display_name.toLowerCase() || "";
      const tags = stream.tags.join(" ").toLowerCase();
      return channelName.includes(searchQuery.toLowerCase()) || tags.includes(searchQuery.toLowerCase());
    });
  }, [searchQuery]);

  const filteredData = useMemo(() => searchData(filterData(currentCategory)), [currentCategory, searchQuery, filterData, searchData]);

  // Função para carregar mais dados localmente
  const loadMoreLocal = () => {
    if (isLoading) return;
    setIsLoading(true);
    setVisibleCount(prevCount => prevCount + 20);

    setTimeout(() => {
      if (containerRef.current) {
        const lastItem = containerRef.current.lastElementChild as HTMLElement;
        lastItem?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
      setIsLoading(false);
    }, 300);
  };

  // Função para carregar mais dados
  const handleLoadMore = () => {
    // Se temos mais dados locais para mostrar, apenas mostramos mais
    if (displayedData.length < filteredData.length) {
      loadMoreLocal();
    } 
    // Se não temos mais dados locais, mas a API tem mais, buscamos da API
    else if (hasMore && onLoadMore) {
      onLoadMore();
    }
  };

  const displayedData = filteredData.slice(0, visibleCount);

  // Determinar se deve mostrar o botão "Mostrar Mais"
  const shouldShowLoadMore = 
    // Temos mais dados locais para mostrar
    (filteredData.length > 0 && displayedData.length < filteredData.length) || 
    // OU temos mais dados no servidor
    (hasMore === true);

  return (
    <Container ref={containerRef}>
      {/* Categorias */}
      <CategorySelector>
        <Margins>
          <ul>
            <ButtonContainer>
              <Button onClick={() => setCurrentCategory("recommended")} className={currentCategory === 'recommended' ? 'active' : ''}>
                Canais Recomendados
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button onClick={() => setCurrentCategory("engaged")} className={currentCategory === 'engaged' ? 'active' : ''}>
                Canais Engajados
              </Button>
            </ButtonContainer>
          </ul>
          <SearchLabel>
            <i className="fi fi-br-search" />
            <SearchUsers
              name="text"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar"
            />
          </SearchLabel>
          <ul>
            <ButtonContainer>
              <Button onClick={() => setCurrentCategory("new")} className={currentCategory === 'new' ? 'active' : ''}>
                Canais Iniciantes
              </Button>
            </ButtonContainer>
            <ButtonContainer>
              <Button onClick={() => setCurrentCategory("top")} className={currentCategory === 'top' ? 'active' : ''}>
                Os Melhores
              </Button>
            </ButtonContainer>
          </ul>
        </Margins>
      </CategorySelector>

      <Margins>
        {currentCategory === "recommended" && "Canais Recomendados"}
        {currentCategory === "engaged" && "Canais Engajados"}
        {currentCategory === "new" && "Canais Iniciantes"}
        {currentCategory === "top" && "Os Melhores"}
      </Margins>

      {/* Lista de vídeos */}
      <div className="videos">
        {displayedData.map((stream) =>
          stream.channel && stream.channel.status ? (
            <VideoSingle
              children={children}
              key={stream._id}
              title={stream.channel.status}
              channel={stream.channel.display_name}
              tags={stream.tags.slice(0, 3)}
              avatar={stream.channel.logo}
              preview={stream.preview.medium}
              viewers={stream.viewers}
            />
          ) : null
        )}
      </div>

      {filteredData.length === 0 ? (
        <Containersf>
          <CenteredContent>
            <ErrorMessage>
              <img src="/nvrp/20240721_145926.webp" alt="face" height={180} width={180} />
              <Title>Ops, Algo deu errado</Title>
              <Subtitle>
                Parece que não encontramos nenhum canal com os critérios da sua busca. Tente outro termo ou volte mais tarde.
              </Subtitle>
            </ErrorMessage>
          </CenteredContent>
        </Containersf>
      ) : null}

      {/* Botão "Mostrar Mais" - Agora considera tanto dados locais quanto do servidor */}
      {shouldShowLoadMore && (
        <ContainerDF>
          <DividerDF />
          <ButtonWrapperDF>
            <ButtonDF onClick={handleLoadMore} disabled={isLoading || isLoadingMore}>
              {isLoading || isLoadingMore ? 'Carregando...' : 'Mostrar Mais'}
            </ButtonDF>
          </ButtonWrapperDF>
          <DividerDF />
        </ContainerDF>
      )}
    </Container>
  );
};

export default VideoGroup;

const Margins = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  ul{
    gap: 5px;
    display: inline-flex;
  }
  .active{
    background-color: rgba(18, 117, 71, 0.89);
  }

   @media screen and (max-width: 680px) {
    
     display: flex;
     flex-direction: column;
 
  } 
`;
const SearchLabel = styled.label`
 
 background-color: rgba(24, 26, 25, 0.89);
 border: 2px solid #1d201e;
 backdrop-filter: blur(23px);
  width: 40%;
  height: 3em;
  padding: 8px;
  font-size: 16px;
  border-radius: 34px;
  color: #9293a0;
  padding: 1.5em 1em 1.3em;
  margin-bottom: 0.2em;
  font-family: 'Poppins', Courier, monospace;
  margin-bottom: 0.3em;
  margin-top: 1em;

    display: flex;
    align-items: center;
    flex-direction: row;


    i{
        color: #3b3b3d;
        font-size: 16px;
    }

      @media screen and (max-width: 680px) {
   
     width: 100%;
     margin-bottom: 0.6em;
  } 
`;

const SearchUsers = styled.input`
  background-color: transparent;
  width: 18em;
  height: 3em;
  padding: 8px;
  font-size: 14px;
  border: none;
  border-radius: 24px;
  color: #ffffff96;
  padding: 1.5em 1em 1.5em;
  margin-bottom: 0.7em;
  font-family: 'Poppins', Courier, monospace;
  margin: 0.9em;
  
  :focus{
    outline: none;
  }

  
  ::placeholder {
     font-size: 14px;
     font-weight: 400;
     font-family: 'Poppins', sans-serif;
     color: #ffffff96;
  }
  
  :focus {
  border: none;
  box-shadow: none; 
  outline: none;
}
  :-webkit-autofill,
  :-webkit-autofill:hover, 
  :-webkit-autofill:focus,
  :-webkit-autofill,
  :-webkit-autofill:hover
  :-webkit-autofill:focus,
  :-webkit-autofill,
   :-webkit-autofill:hover,
   :-webkit-autofill:focus {
  -webkit-text-fill-color: #ffffff96 !important;
  -webkit-box-shadow: 0 0 0px 1000px none inset;
  transition: background-color 5000s ease-in-out 0s;
} 
/* Remove o ícone "x" que é exibido no input type="search" no Safari */
 ::-webkit-search-cancel-button {
  cursor: var(--f-cursor-pointer);
}

`;

const Containersf = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CenteredContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.125rem; /* gap-0.5 */
`;


const ContainerDF = styled.div`
  display: none;
  align-items: center;

  @media (min-width: 1024px) {
    /* lg:flex */
    display: flex;
  }
`;

const DividerDF = styled.div`
  display: none;
  height: 0.1rem; /* h-0.5 */
  border-radius: 22px;
  flex-grow: 1; /* grow */
  background-color: rgb(37, 38, 39);

  @media (min-width: 1024px) {
    display: flex; /* lg:flex */
  }
`;

const ButtonWrapperDF = styled.div`
  padding: 0 0.75rem; /* px-3 */
`;

const ButtonDF = styled.button`
  display: inline-flex;
  gap: 0.375rem; /* gap-1.5 */
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem; /* rounded */
  font-weight: 600; /* font-semibold */
  position: relative;
  font-family: 'InterSemiBold', monospace;
  transition: all 0.3s ease;
  border: 2px solid transparent; /* outline outline-2 */
  outline-offset: 2px; /* outline-offset-2 */
  background-color: transparent; /* bg-transparent */
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem; /* px-2 py-1 */
  font-size: 0.75rem; /* text-xs */
  text-align: center;
  text-decoration: none;
  white-space: nowrap; /* whitespace-nowrap */
  cursor: pointer;

  &:hover {
    color: white; /* hover:text-white */
  }

  &:focus-visible {
    text-decoration: underline; /* focus-visible:underline */
    text-underline-offset: 2px; /* underline-offset-2 */
  }

  &:active {
    transform: scale(0.98); /* active:scale-[0.98] */
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.3; /* disabled:opacity-30 */
  }

  & > svg {
    width: 1em; /* [&_svg]:size-[1em] */
    height: 1em;
    fill: currentColor; /* [&_svg]:fill-current */
  }

  &[data-state="active"] {
    color: white; /* data-[state=active]:text-white */
  }
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.875rem; /* text-3xl */
  font-weight: 600; /* font-semibold */
`;

const Subtitle = styled.p`
  text-align: center;
  max-width: 740px;
  text-align: center;
  color: #a3a3a3; /* text-grey-300 */
`;

const ButtonContainer = styled.div`
 
  display: flex;
  max-width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
`;

const Button = styled.a`
  display: inline-flex;
  gap: 0.375rem; 
  align-items: center;
  justify-content: center;
  border-radius: 22rem; 
  font-weight: 600; 
  position: relative;
  font-family: 'InterSemiBold', monospace;
  transition: all 0.3s ease;
  outline: transparent;
  outline-width: 2px; 
  outline-offset: 2px; 
  background-color: #22c55e; 
  color: #0c0c0c;
  padding: 0.5rem 0.75rem; 
  font-size: 14px;
  text-decoration: none;

  &:hover {
    background-color: #16a34a; 
  }

  &:focus-visible {
    outline-color: #86efac; 
    background-color: #22c55e; 
  }

  &:disabled {
    pointer-events: none;
    background-color: #064e3b; 
  }

  &:active {
    transform: scale(0.98);
  }

  & > svg {
    width: 1em; 
    height: 1em;
    fill: currentColor;
  }

      @media screen and (max-width: 680px) {
     padding: 0.3rem 0.65rem; 
  font-size: 12px;
  } 
`;
const Container = styled.section`
  display: flex;
  flex-direction: column;

  margin-top: 1rem;
  width: 100%;

  strong{
    text-align: center;
  }

  .videos {
    margin-top: 1rem;
    gap: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    place-items: center;
    width: 100%;
   

    div {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .videos {
      grid-template-columns: 1fr 1fr;

      div:nth-child(3),
      div:nth-child(4) {
        display: none;
      }
    }
  }

  @media (min-width: 1076px) {
    .videos {
      grid-template-columns: 1fr 1fr 1fr;

      div:nth-child(3) {
        display: flex;
      }
    }
  }
`;

const CategorySelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  button {
    padding: 0.5rem 1rem;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0056b3;
    }

    &:focus {
      outline: none;
    }
  }
`;