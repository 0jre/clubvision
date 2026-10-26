import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';

const GlobalStyle = styled.div`
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 20px;
  box-sizing: border-box;
`;

const ScratchCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
  width: 100%;
  max-width: 600px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const StyledButton = styled.button`
  padding: 12px 25px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const ScratchItemWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 10px;
  overflow: hidden;
  background-color: #e0e0e0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ContentLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;
  word-break: break-word;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

interface CanvasOverlayProps {
  $scratched: boolean;
}

const CanvasOverlay = styled.canvas<CanvasOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  display: ${props => (props.$scratched ? 'none' : 'block')};
`;

interface ScratchCardProps {
  content: string;
  imageUrl: string;
  onScratchComplete: () => void;
  isResetting: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ content, imageUrl, onScratchComplete, isResetting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [localIsScratched, setLocalIsScratched] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log(`Canvas ref is null for card with content: "${content}"`);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get 2D context for canvas.");
      return;
    }

    const parent = canvas.parentElement;
    if (!parent) {
      console.error("Canvas parent element not found.");
      return;
    }
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    console.log(`Initializing canvas for URL: ${imageUrl} with dimensions: ${canvas.width}x${canvas.height}`);

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Necessário para evitar problemas de CORS ao desenhar a imagem no canvas
    img.src = imageUrl;

    img.onload = () => {
      console.log("Image loaded successfully:", imageUrl);
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas antes de desenhar a imagem
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Desenha a imagem como fundo

      ctx.globalCompositeOperation = 'source-over'; // Para desenhar a camada de raspadinha por cima
      ctx.fillStyle = '#808080'; // Cor da camada de raspadinha (TOTALMENTE OPACA)
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Desenha a camada de raspadinha

      ctx.globalCompositeOperation = 'destination-out'; // Modo de composição para apagar
      ctx.lineWidth = 30; // Espessura do "apagador"
      ctx.lineCap = 'round'; // Pontas arredondadas
      ctx.lineJoin = 'round'; // Junções arredondadas

      setLocalIsScratched(false);
      setImageLoaded(true);
    };

    img.onerror = (e) => {
      console.error("Failed to load image:", imageUrl, "Error event:", e);
      // Fallback: desenha apenas a camada de raspadinha se a imagem não carregar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      setLocalIsScratched(false);
      setImageLoaded(true); // Ainda marca como carregado para permitir a raspagem
    };
  }, [imageUrl, isResetting, content]);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  const getRelativePos = useCallback((canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (localIsScratched || !imageLoaded) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let pos;
    if (e.nativeEvent.type.startsWith('mouse')) {
      const mouseEvent = e as React.MouseEvent;
      pos = getRelativePos(canvas, mouseEvent.nativeEvent.clientX, mouseEvent.nativeEvent.clientY);
    } else {
      const touchEvent = e as React.TouchEvent;
      pos = getRelativePos(canvas, touchEvent.nativeEvent.touches[0].clientX, touchEvent.nativeEvent.touches[0].clientY);
    }
    setLastPos(pos);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }, [localIsScratched, imageLoaded, getRelativePos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || localIsScratched || !imageLoaded) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let pos;
    if (e.nativeEvent.type.startsWith('mouse')) {
      const mouseEvent = e as React.MouseEvent;
      pos = getRelativePos(canvas, mouseEvent.nativeEvent.clientX, mouseEvent.nativeEvent.clientY);
    } else {
      const touchEvent = e as React.TouchEvent;
      pos = getRelativePos(canvas, touchEvent.nativeEvent.touches[0].clientX, touchEvent.nativeEvent.touches[0].clientY);
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setLastPos(pos);
  }, [isDrawing, localIsScratched, imageLoaded, getRelativePos]);

  const endDrawing = useCallback(() => {
    if (!isDrawing || localIsScratched || !imageLoaded) return;
    setIsDrawing(false);
    checkScratchPercentage();
  }, [isDrawing, localIsScratched, imageLoaded]);

  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }
    const totalPixels = canvas.width * canvas.height;
    const percentage = (transparentPixels / totalPixels) * 100;

    if (percentage > 50) {
      setLocalIsScratched(true);
      if (onScratchComplete) {
        onScratchComplete();
      }
      // Limpa o canvas completamente para revelar a imagem de fundo e o texto
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [onScratchComplete]);

  return (
    <ScratchItemWrapper>
      <ContentLayer>
        {/* A imagem de fundo é desenhada no canvas, mas o texto da curiosidade fica aqui */}
        {content}
      </ContentLayer>
      <CanvasOverlay
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
        $scratched={localIsScratched}
      />
    </ScratchItemWrapper>
  );
};

const App = () => {
  const [scratchedItems, setScratchedItems] = useState<boolean[]>(Array(4).fill(false));
  const [generatedContents, setGeneratedContents] = useState<string[]>(Array(4).fill(''));
  const [imageUrls, setImageUrls] = useState<string[]>(Array(4).fill(''));
  const [loadingStates, setLoadingStates] = useState<boolean[]>(Array(4).fill(false));
  const [resetKey, setResetKey] = useState(0);

  const generateContentForCard = async (index: number) => {
    setLoadingStates(prev => {
      const newLoadingStates = [...prev];
      newLoadingStates[index] = true;
      return newLoadingStates;
    });
    setGeneratedContents(prev => {
      const newContents = [...prev];
      newContents[index] = 'Carregando...';
      return newContents;
    });

    // Gera uma URL de imagem de placeholder dinâmica
     
    const newImageUrl = `/nvrp/20230331_230855.png`;
    setImageUrls(prev => {
      const newUrls = [...prev];
      newUrls[index] = newImageUrl;
      return newUrls;
    });

    let retries = 0;
    const maxRetries = 3;
    const baseDelay = 1000;

    while (retries < maxRetries) {
      try {
        const prompt = "Gere uma curiosidade muito curta e interessante sobre um tópico aleatório. A resposta deve ser apenas a curiosidade, sem introduções.";
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          setGeneratedContents(prev => {
            const newContents = [...prev];
            newContents[index] = text;
            return newContents;
          });
          break;
        } else {
          console.error("Estrutura de resposta da API inesperada:", result);
          throw new Error("Resposta da API inválida");
        }
      } catch (error) {
        console.error(`Erro ao gerar conteúdo para o cartão ${index}:`, error);
        retries++;
        if (retries < maxRetries) {
          const delay = baseDelay * Math.pow(2, retries - 1);
          await new Promise(res => setTimeout(res, delay));
        } else {
          setGeneratedContents(prev => {
            const newContents = [...prev];
            newContents[index] = 'Erro ao carregar.';
            return newContents;
          });
        }
      } finally {
        setLoadingStates(prev => {
          const newLoadingStates = [...prev];
          newLoadingStates[index] = false;
          return newLoadingStates;
        });
      }
    }
  };

  const generateAllCardContents = async () => {
    setScratchedItems(Array(4).fill(false));
    setGeneratedContents(Array(4).fill(''));
    setImageUrls(Array(4).fill('')); // Limpa as URLs das imagens também
    setLoadingStates(Array(4).fill(true));
    setResetKey(prev => prev + 1);

    const promises = [];
    for (let i = 0; i < 4; i++) {
      promises.push(generateContentForCard(i));
    }
    await Promise.all(promises);
  };

  useEffect(() => {
    generateAllCardContents();
  }, []);

  const handleScratchComplete = useCallback((index: number) => {
    setScratchedItems(prev => {
      const newScratchedItems = [...prev];
      newScratchedItems[index] = true;
      return newScratchedItems;
    });
  }, []);

  const handleRestart = () => {
    generateAllCardContents();
  };

  return (
    <GlobalStyle>
      <ScratchCardContainer>
        {Array.from({ length: 4 }).map((_, index) => (
          <ScratchCard
            key={`${index}-${resetKey}`}
            content={loadingStates[index] ? 'Carregando...' : generatedContents[index]}
            imageUrl={imageUrls[index]}
            onScratchComplete={() => handleScratchComplete(index)}
            isResetting={resetKey}
          />
        ))}
      </ScratchCardContainer>
      <ButtonContainer>
        <StyledButton onClick={handleRestart}>Reiniciar</StyledButton>
        <StyledButton onClick={generateAllCardContents} disabled={loadingStates.some(state => state)}>
          Gerar Novas Raspadinhas ✨
        </StyledButton>
      </ButtonContainer>
    </GlobalStyle>
  );
};

export default App;
