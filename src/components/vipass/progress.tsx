"use client"

import {  Crown } from "lucide-react"
import styled from "styled-components"
import { Levelinfo } from "@/types/user/level.up"

export default function BattlePass({Info} : {Info: Levelinfo}) {
   
  if (!Info) { 
    return <></>
  }
  const xpNeeded = 800
  const totalSegments = 7
  const progress = Info.xp / xpNeeded
  const activeSegments = Math.floor(progress * totalSegments)
  const hasHalfSegment = (progress * totalSegments) % 1 >= 0.5

  return (
    <Anim > 
      <div className="relative ">
        

        <div className="absolute inset-0 bg-gradient-to-b rounded-full from-black/80 to-black/40 z-0"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
        
          {/* Level Indicator */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#00ff6a]">
                <Crown className="w-3 h-3 text-black" />
              </div>
              <span className="text-[#00ff6a] font-bold uppercase text-sm">Nível {Info.level}</span>
            </div>
            <span className="text-[#00ff6a] font-bold">•</span>
            <span className="text-[#00ff6a] font-bold">100</span>
          </div>
 
          <div className="w-full flex items-center justify-between">
            {/* Left Hexagon */}
            <div className="relative flex items-center justify-center w-10 h-10">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#00ff6a]" fill="currentColor">
                <path d="M12,0 L23.1,6 L23.1,18 L12,24 L0.9,18 L0.9,6 L12,0 Z" />
              </svg>
              <span className="absolute text-black font-bold">{Info.level}</span>
            </div>
  
            <div className="flex-1 mx-2 flex flex-col items-center">
              <div className="w-full gap-1 flex justify-center">
              {[...Array(totalSegments)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-[8px] rounded-full w-[45px] ${
                      index < activeSegments
                        ? "bg-[#00ff6a]"
                        : index === activeSegments && hasHalfSegment
                        ? "bg-[#00ff6a]/50"
                        : "bg-[#333333]"
                    }`}
                  ></div>
                ))}
              </div>
            
          
            </div>
            {/* Right Hexagon */}
            <div className="relative flex items-center justify-center w-10 h-10">
              <svg viewBox="0 0 24 24" className="w-full h-full text-[#272928]  " fill="currentColor">
                <path d="M12,0 L23.1,6 L23.1,18 L12,24 L0.9,18 L0.9,6 L12,0 Z" />
              </svg>
              <span className="absolute text-white font-bold">{Info.level + 1}</span>
              {/* <div className="absolute -right-2 -top-2 flex items-center justify-center w-5 h-5 rounded-full bg-[#333333] border border-[#00ff6a]">
                <span className="text-[#00ff6a] text-xs font-bold">+5</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Anim>
  )
}


const Anim = styled.div`
    margin-bottom: 1em;
 
  
`;