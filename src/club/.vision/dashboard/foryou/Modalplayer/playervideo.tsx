import { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import Logo from '@/public/nvrp/20230331_230855.png'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import React from 'react';
import { useTheme } from '@mui/material';
import router from 'next/router';
 
interface VideoPlayerProps {
  videoPath: string;
  videotitle: string;
  onClose: () => void; 
}

const Homepl: React.FC<VideoPlayerProps> = ({ videoPath, videotitle, onClose }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const videoContainer: any = useRef()
  const video: any = useRef()
  // const volumeSlider: any = useRef()
  const volumeSlider: React.MutableRefObject<HTMLInputElement | null> = useRef(null);

  const totalTime: any = useRef()
  const currentTime: any = useRef()
  const timelineContainer: any = useRef()
  const speedBtn: any = useRef()
  const previewImg: any = useRef()
  const volume: any = useRef(100);
  let hideControlsTimeout: NodeJS.Timeout;
  //functions
  //1. Play/pause
  const handlePlay = () => {
    videoContainer.current.classList.remove("paused")
  }
  const handlePause = () => {
    videoContainer.current.classList.add("paused")
  }
  const handlePlayPause = () => {
    video.current.paused ? video.current.play() : video.current.pause()
  }

  //2. Volume
 

  const handleMute = () => {
    video.current.muted = !video.current.muted;
    if (video.current.muted) {
      volume.current = video.current.volume; // Armazene o volume atual antes de desmutar
      video.current.volume = 0;
    } else {
      video.current.volume = volume.current; // Restaure o volume quando desmutar
    }
  };

  // const handleVolumeChange = () => {
  
  //   volumeSlider.current.value = video.current.volume
  //   let volumeLevel
  //   if (video.current.muted || video.current.volume === 0) {
  //     volumeSlider.current.value = 0
  //     volumeLevel = "muted"
  //   } else if (video.current.volume >= 0.5) {
  //     volumeLevel = "high"
  //   } else {
  //     volumeLevel = "low"
  //   }
  //   videoContainer.current.dataset.volumeLevel = volumeLevel
  // }

  //3. Duration
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  })
  const handleVideoDuration = () => {
    totalTime.current.textContent = formatDuration(video.current.duration)
  }
  const formatDuration = (time: any) => {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`
    }
  }
  const handleTimeUpdate = () => {
    currentTime.current.textContent = formatDuration(video.current.currentTime)
    const percent = video.current.currentTime / video.current.duration
    timelineContainer.current.style.setProperty("--progress-position", percent)
  }

  
  /// volume 
  // const increaseVolume = () => {
  //   if (video.current) {
  //     let newVolume = Math.min(video.current.volume + 0.1, 1);
  //     video.current.volume = newVolume;
  //     updateVolumeUI(newVolume);
  //   }
  // };
  
  // const decreaseVolume = () => {
  //   if (video.current) {
  //     let newVolume = Math.max(video.current.volume - 0.1, 0);
  //     video.current.volume = newVolume;
  //     updateVolumeUI(newVolume);
  //   }
  // };
  
  // const updateVolumeUI = (volume: number) => {
  //   if (volumeSlider.current) {
  //     volumeSlider.current.value = volume;
  //     handleVolumeChange();
  //   }
  // };

  const [currentVolume, setCurrentVolume] = useState(100);

// Modifique a função handleVolumeChange para atualizar o estado do volume
const handleVolumeChange = () => {
  if (volumeSlider.current) {
    const newVolume = parseFloat(volumeSlider.current.value);
    
    if (!isNaN(newVolume)) {
      setCurrentVolume(newVolume * 100);
      video.current.volume = newVolume;

      let volumeLevel;
      if (video.current.muted || newVolume === 0) {
        volumeSlider.current.value = '0';
        volumeLevel = 'muted';
      } else if (newVolume >= 50) {
        volumeLevel = 'high';
      } else {
        volumeLevel = 'low';
      }

      videoContainer.current.dataset.volumeLevel = volumeLevel;
    } else {
      console.error('Novo volume não é um número válido.');
    }
  } else {
    console.error('volumeSlider.current não está definido.');
  }
};


  //6. Timeline

  const handleTimelineUpdate = (e: any) => {
    const rect = timelineContainer.current.getBoundingClientRect()
    const percent: any = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    timelineContainer.current.style.setProperty("--preview-position", percent)

    if (isScrubbing) {
      e.preventDefault()
      timelineContainer.current.style.setProperty("--progress-position", percent)
    }

  }
  let isScrubbing = false
  let wasPaused: any


  const toggleScrubbing = (e: any) => {
    const rect = timelineContainer.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1
    if (videoContainer !== null) {
      videoContainer.current.classList.toggle("scrubbing", isScrubbing)
      if (video !== null) {
        if (isScrubbing) {
          wasPaused = video.current.paused
          video.current.pause()
        } else {
          video.current.currentTime = percent * video.current.duration
          if (!wasPaused) video.current.play()
        }
      }
    }

    handleTimelineUpdate(e)
  }
  const skip = (duration: any) => {
    video.current.currentTime += duration
  }

  

  useEffect(() => {
    setIsLoading(true)
    if (!isLoading) {

      const handleVideoLoadedData = () => {
        setIsLoading(false); // Set isLoading to false when video is loaded
      };
      
      video.current.addEventListener("loadeddata", handleVideoLoadedData);
      document.addEventListener("keydown", e => {
        if (document.activeElement !== null) {
          const tagName: any = document.activeElement.tagName.toLowerCase()
          if (tagName === "input") return

          switch (e.key.toLowerCase()) {
            case " ":
              if (tagName === "button") return
            case "k":
              handlePlayPause()
              break
            case "m":
              handleMute()
              break
            case "arrowleft":
            case "j":
              skip(-4)
              break
            case "arrowright":
            case "l":
              skip(4)
              break
          }
        }
      })
    }
  }, [isLoading])

  useEffect(() => {
    setIsLoading(true)
    video.current.addEventListener("enterpictureinpicture", () => {
      videoContainer.current.classList.add("mini-player")
    })
    video.current.addEventListener("leavepictureinpicture", () => {
      videoContainer.current.classList.remove("mini-player")
    })
     
    const handleVideoDuration = () => {
      totalTime.current.textContent = formatDuration(video.current.duration)
    }
    handleVideoDuration()

    timelineContainer.current.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer.current.addEventListener("mousedown", toggleScrubbing)
    document.addEventListener("mouseup", e => {
      if (isScrubbing) toggleScrubbing(e)
    })
    document.addEventListener("mousemove", e => {
      if (isScrubbing) handleTimelineUpdate(e)
    })

  }, [])


 
 // Captura da URL completa
 const currentUrl = router.asPath;

 useEffect(() => {
   const handleEnterPiP = () => {
     if (videoContainer.current) {
       videoContainer.current.classList.add('mini-player');
     }
   };

   const handleLeavePiP = () => {
     if (videoContainer.current) {
       videoContainer.current.classList.remove('mini-player');
       router.push(currentUrl); // Volta para a URL do vídeo
     }
   };

   // Adiciona os eventos
   video.current?.addEventListener('enterpictureinpicture', handleEnterPiP);
   video.current?.addEventListener('leavepictureinpicture', handleLeavePiP);

   // Remove os eventos na desmontagem
   return () => {
     video.current?.removeEventListener('enterpictureinpicture', handleEnterPiP);
     video.current?.removeEventListener('leavepictureinpicture', handleLeavePiP);
   };
 }, [currentUrl, router]);

  const [isFullScreen, setIsFullScreen] = useState(false);
 

  const handleFullScreenToggle = () => {
    if (!isFullScreen) {
      videoContainer.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };




  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('msfullscreenchange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('msfullscreenchange', fullscreenChangeHandler);
    };
  }, []);

   
  const theme = useTheme();
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setCurrentVolume(newValue as number);
    updateVolume(newValue as number / 100);
  };

  
  const updateVolume = (newVolume: number) => {
      console.log('Atualizando volume:', newVolume);
      if (typeof newVolume === 'number' && video.current) {
        video.current.volume = newVolume;
      }
  };
 
  // Ocultar controles após 2 segundos de inatividade
  const resetHideControlsTimeout = () => {
    clearTimeout(hideControlsTimeout);
    setControlsVisible(true);
    hideControlsTimeout = setTimeout(() => setControlsVisible(false), 2000);
  };

  useEffect(() => {
    resetHideControlsTimeout();
    videoContainer.current?.addEventListener('mousemove', resetHideControlsTimeout);
    videoContainer.current?.addEventListener('mouseleave', () => setControlsVisible(false));

    return () => {
      videoContainer.current?.removeEventListener('mousemove', resetHideControlsTimeout);
      videoContainer.current?.removeEventListener('mouseleave', () => setControlsVisible(false));
    };
  }, []);

  const toggleMiniPlayer = async () => {
    try {
      if (!document.pictureInPictureElement) {
        await video.current.requestPictureInPicture();
        setIsMiniPlayer(true);
      } else {
        await document.exitPictureInPicture();
        setIsMiniPlayer(false);
      }
    } catch (error) {
      console.error('Erro ao alternar Picture-in-Picture:', error);
    }
  };


  const getVolumeIcon = () => {
    if (video.current?.muted || currentVolume === 0) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-off">
          <path d="M16 9a5 5 0 0 1 .95 2.293"/>
          <path d="M19.364 5.636a9 9 0 0 1 1.889 9.96"/>
          <path d="m2 2 20 20"/>
          <path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11"/>
          <path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686"/>
        </svg>
      );
    } else if (currentVolume >= 50) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
          <path d="M16 9a5 5 0 0 1 0 6"/>
          <path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-1">
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
          <path d="M16 9a5 5 0 0 1 0 6"/>
        </svg>
      );
    }
  };

  
  return (
    <PlayerPl >
        <Container className={`video-container  ${isLoading ? 'loading' : 'paused'} ${isFullScreen ? 'fullscreen theater' : ''}`} data-volume-level="high" ref={videoContainer}>  
       
        {controlsVisible ? null : (
          <>
              <Image className='logoopacity' src={Logo} alt='novision' height={30} />
             
          </>
        ) } 
          <div className={`video-controls-container ${controlsVisible ? '' : 'hide'} `}>
          
            <div className="controls">
          
            <div className="timeline-container"
              ref={timelineContainer}
             onMouseMove={handleTimelineUpdate}
            onMouseDown={toggleScrubbing}
            >
        
        <div className="timeline">
                <div className="thumb-indicator"></div>
              </div>

            </div>
           
             
        

           <div className='dispay'>

            <ul>
            <button className="play-pause-btn" onClick={handlePlayPause}>
                <svg className="play-icon" viewBox="0 0 24 24">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-play"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </svg>
                <svg className="pause-icon" viewBox="0 0 24 24">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
                </svg>
         </button>


         <Box 
         className='volume-container'   
         onMouseEnter={() => setControlsVisible(true)}
         onMouseLeave={() => setControlsVisible(false)}>
      <Grid container spacing={0.8} alignItems="center">
        <Grid item>
        {getVolumeIcon()}
        </Grid>
        <Grid item xs className={`volume-slider ${controlsVisible ? 'visible volummer ' : 'hidden'}`}>
        <Slider
  sx={{
    color: theme.palette.mode === 'dark' ? '#060607cc' : 'rgba(199, 199, 201, 0.411)',
    '& .MuiSlider-track': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',  // Adiciona um leve fundo à trilha
      border: 'none',
    },
    '& .MuiSlider-rail': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',  // Trilho vazio fica mais claro
    },
    '& .MuiSlider-thumb': {
      width: 13,
      height: 13,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Garante que o thumb tenha cor consistente
      '&:before': {
        boxShadow: '0 4px 8px rgba(255, 255, 255, 0.15)', // Ajuste no efeito do thumb
      },
      '&:hover, &.Mui-focusVisible, &.Mui-active': {
        boxShadow: 'none',
      },
    },
  }}
  value={currentVolume}
  onChange={handleSliderChange}
  aria-labelledby="input-slider"
/>

        </Grid>
      </Grid>
    </Box>
             
    <div className="duration-container">
                <div 
              className="current-time" 
              ref={currentTime}>0:00</div>
                /
               <div className="total-time" ref={totalTime}></div>
              </div>
            </ul>
          

          <ul>
          <button onClick={toggleMiniPlayer}>
            {isMiniPlayer ? (
              <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-laptop-minimal"><rect width="18" height="12" x="3" y="4" rx="2" ry="2"/><line x1="2" x2="22" y1="20" y2="20"/></svg>
              </>
            ) : (
              <>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-picture-in-picture"><path d="M8 4.5v5H3m-1-6 6 6m13 0v-3c0-1.16-.84-2-2-2h-7m-9 9v2c0 1.05.95 2 2 2h3"/><rect width="10" height="7" x="12" y="13.5" ry="2"/></svg>
              </>
             )}
          </button>
          <button onClick={handleFullScreenToggle} >
               {isFullScreen ? (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shrink"><path d="m15 15 6 6m-6-6v4.8m0-4.8h4.8"/><path d="M9 19.8V15m0 0H4.2M9 15l-6 6"/><path d="M15 4.2V9m0 0h4.8M15 9l6-6"/><path d="M9 4.2V9m0 0H4.2M9 9 3 3"/></svg>
                </>
               ): (
                <>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
                </>
               )}
             </button>
            
          </ul>
              
              
           
             
            </div>
            
           </div>
         
          </div>
     

          <Video    
            ref={video}
            muted={false}
            autoPlay={true}
            onPlay={handlePlay}
            onPause={handlePause}
            onClick={handlePlayPause}
            onVolumeChange={handleVolumeChange}
            onLoadedData={handleVideoDuration}
            onTimeUpdate={handleTimeUpdate}
            
          >
         <source src={videoPath} type="video/mp4" height={100} width={100}></source>
          </Video>
        </Container>
    </PlayerPl>
  )
}

export default Homepl


const Container = styled.div`
   display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  display: flex;
  justify-content: flex-end;
  max-width: 100%;
  max-height: 92%;
  border-radius: 22px;

  box-shadow: 2px 9px 59px rgba(245, 218, 221, 0.233);
 
  @media screen and (min-height: 759px) {
    border-radius: 1px;
   }
  
   .logoopacity{
    filter: opacity(0.2);
    position: absolute;
    right: 9px;
    z-index: 12;
    bottom: 12px;
   }
   .volume-control {
  display: flex;
  align-items: center;
}

.volummer{
  width: 110px;
  position: relative;
}



.volume-slider {
 display: none;
}

.volume-slider.visible {
display: block
 
}
 
.dispay{
  display: flex;
  width: 90%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  ul{
    display: flex;
    align-items: center;
  }
}
 .hide {
    opacity: 0;
    display: none;
    transition: opacity 0.3s;
    cursor: none;
  }

.mute-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-right: 8px;
}


`;

const Video = styled.video`
  width: 100%;
  max-width: 1250px;
  height: 100%;
 border-radius: 22px;
    
`;

const CardI = styled.div`
  background-color: rgba(56, 55, 63, 0.123);
  padding: 8px;
  margin: 0.5em;
  border-radius: 7px;
`;

const PlayerPl = styled.section`
  .video-container.theater,
.video-container.fullscreen {
  border: none;
  transition: 1s ease-in;
  display: flex;
  justify-content: center;
  place-items: center;
  width: 100%;
  height: 100%;
} 

 .play-pause-btn{
   background-color: rgba(93, 93, 99, 0.123);
   padding: 4px 7px 4px;
   border-radius: 22px;
   display: flex;
   margin: 0.4em;
   flex-direction: row;
   align-items: center;
 }
.big-btn:hover {
  transition: .5s ease-in;
  display: block;
}

.video-container:hover .big-btn {
  display: block;
}

.video-controls-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #c5bebe;
  z-index: 100;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
}

.video-controls-container::before {
  
  position: absolute;
  bottom: 0;
  width: 100%;
  margin: auto;
  border-radius: 40px;
  padding: .5em;
  aspect-ratio: 6 / 1;
  z-index: -1;
  pointer-events: none;
}

.video-container:hover .video-controls-container,
.video-container:focus-within .video-controls-container,
.video-container.paused .video-controls-container {
  opacity: 1;
}

.controls{
  display: flex;
  flex-direction: column;

}

.video-controls-container .controls {
  display: flex;
  gap: .5rem;
  padding: 0.4em 1em 0.4em;
  align-items: center;
  margin: auto;
  position: absolute;
  bottom: 2px;
  top: 1;
  left: 0;
  right: 0;
}
  
.video-controls-container .controls button {
  background: none;
  border: none;
  color: inherit;
  padding: 0;
  height: 30px;
  width: 30px;
  font-size: 1.1rem;
  cursor: pointer;
  opacity: .85;
  transition: opacity 150ms ease-in-out;
}

.video-controls-container .controls button:hover {
  opacity: 1;
}

.video-container.paused .pause-icon {
  display: none;
}

.video-container:not(.paused) .play-icon {
  display: none;
}

.video-container.theater .tall {
  display: none;
}

.video-container:not(.theater) .wide {
  display: none;
}

.video-container.full-screen .open {
  display: none;
}

.video-container.full-screen .big-btn {
  display: none;
}

.video-container:not(.full-screen) .close {
  display: none;
}

.volume-high-icon,
.volume-low-icon,
.volume-muted-icon {
  display: none;
}

.video-container[data-volume-level="high"] .volume-high-icon {
  display: block;
}

.video-container[data-volume-level="low"] .volume-low-icon {
  display: block;
}

.video-container[data-volume-level="muted"] .volume-muted-icon {
  display: block;
}

.volume-container {
  display: flex;
  margin-top: 0.4em;
  align-items: center;
}

.volume-slider {
  width: 0;
  transform-origin: left;
  transform: scaleX(0);
  transition: width 150ms ease-in-out, transform 150ms ease-in-out;
}

.volume-container:hover .volume-slider,
.volume-slider:focus-within {
  width: 100px;
  transform: scaleX(1);
}

.duration-container {
  display: flex;
  align-items: baseline;
  gap: .25rem;
  font-size: 12px;
  font-family: 'InterSemiBold', monospace;
  margin-left: 1em;
  flex-grow: 1;
  background-color: rgba(78, 79, 82, 0.158);
  padding: 6px 9px 6px;
  border-radius: 22px;


  .total-time{
    font-size: 12px;
    color: #4c4d53;
  }
}

.video-container.captions .captions-btn {
  border-bottom: 3px solid red;
}

.video-controls-container .controls button.wide-btn {
  width: 50px;
}

.timeline-container {
  height: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 92%;
}

.timeline {
  background-color: rgba(100, 100, 100, 0.13);
  border-radius: 40px;
  height: 3px;
  width: 100%;
  position: relative;
}

.timeline::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  height: 8px;
  right: calc(100% - var(--preview-position) * 100%);
  background-color: rgba(236, 33, 43, 0.178);
  display: none;
  border-radius: 40px;
}

.timeline::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: calc(100% - var(--progress-position) * 100%);
  background-color: rgba(184, 184, 189, 0.075);
  border-radius: 40px;
}

.timeline .thumb-indicator {
  --scale: 0;
  position: absolute;
  transform: translateX(-50%) scale(var(--scale));
  height: 200%;
  top: -50%;
  left: calc(var(--progress-position) * 100%);
  background-color: rgb(214, 191, 191);
  border-radius: 50%;
  transition: transform 150ms ease-in-out;
  aspect-ratio: 1 / 1;
}
 
.thumbnail-img {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

}

.video-container.scrubbing .thumbnail-img {
  display: block;
}

.video-container.scrubbing .preview-img,
.timeline-container:hover .preview-img {
  display: block;
}

.video-container.scrubbing .timeline::before,
.timeline-container:hover .timeline::before {
  display: block;
}

.video-container.scrubbing .thumb-indicator,
.timeline-container:hover .thumb-indicator {
  --scale: 1;
}

.video-container.scrubbing .timeline,
.timeline-container:hover .timeline {
  height: 100%;
}

/* media queries */
@media (max-width: 980px) {
  .video-container {
      width: 85%;
      max-width: 1000px;
      margin-top: 5em;
      border-radius: 20px;
      padding: 1em;
      cursor: pointer;
      transition: 0.4s ease-in;
  }

  .big-btn {
      height: 65px;
      width: 65px;
  }
}

@media (max-width: 500px) {
  .video-container {
      width: 95%;
      border: none;
      border-radius: 0;
      padding: .3em;
      font-size: .8em;
  }

  .video-controls-container .controls button {
      height: 20px;
      width: 20px;
      font-size: .9rem;
  }

  .big-btn {
      display: none !important;

  }
}

`;