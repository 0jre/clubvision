import { useCallback, useEffect, useState } from "react";

// Sound Manager para sua aplicação
export const useSoundEffects = () => {
  const [sounds, setSounds] = useState<Record<string, HTMLAudioElement>>({});
  const [loaded, setLoaded] = useState(false);
  
  // Pré-carregar todos os sons
  useEffect(() => {
    const soundFiles = {
      click: '/sounds/click-button.mp3',
      hover: '/sounds/hover-effect.mp3',
      swap: '/sounds/swap-slide.mp3',
      select: '/sounds/selection.mp3',
      type: '/sounds/key-press.mp3',
      open: '/sounds/panel-open.mp3',
      close: '/sounds/panel-close.mp3',
      drag: '/sounds/drag-effect.mp3',
      drop: '/sounds/drop-effect.mp3'
    };
    
    const audioElements: Record<string, HTMLAudioElement> = {};
    
    Object.entries(soundFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.2; // Volume baixo por padrão
      audioElements[key] = audio;
    });
    
    setSounds(audioElements);
    setLoaded(true);
  }, []);
  
  // Função para tocar um som
  const playSoundz = useCallback((soundName: string, volume = 0.2) => {
    if (!loaded || !sounds[soundName]) return;
    
    // Clone o áudio para permitir sobreposição de sons
    const sound = sounds[soundName].cloneNode() as HTMLAudioElement;
    sound.volume = volume;
    sound.play().catch(e => console.log('Audio play failed:', e));
  }, [sounds, loaded]);
  
  return { playSoundz, loaded };
};