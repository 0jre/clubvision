"use client"

import { useState } from "react"
import { Clock, Target, Globe, Gift, Check, Lock } from 'lucide-react'
import styled from "styled-components"
import { useBattlePass } from "@/lib/services/level/useBattlepass"
import { GridLock } from "iconsax-react"

interface Mission {
  id: string
  title: string
  description: string
  requirement: {
    current: number
    target: number
  }
  reward: {
    xp: number
    bits?: number
    coins?: number
    tokens?: number
  }
  expiresAt: string
  isCompleted: boolean
}

interface RewardInterfaceProps {
  dailyMissions?: Mission[]
  weeklyMissions?: Mission[]
  onCompleteMission?: (missionId: string) => void
}

export default function RewardsInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data, isLoading, completeMission } = useBattlePass()

  const handleCompleteMission = async (missionId: string) => {
    try {
      await completeMission(missionId)
    } catch (error: any) {
      alert(error.message)
    }
  }

  if (isLoading) {
    return (
      <Anim className="flex items-center justify-center">
        <div className="w-full overflow-hidden bg-[#1b1c1d88] p-3 rounded-[12px]">
          <div className="text-center text-[#00ff6a] p-8">Carregando missões...</div>
        </div>
      </Anim>
    )
  }

  if (!data) {
    return (
      <Anim className="flex items-center justify-center">
        <div className="w-full overflow-hidden bg-[#1b1c1d88] p-3 rounded-[12px]">
          <div className="text-center text-red-500 p-8">Erro ao carregar missões</div>
        </div>
      </Anim>
    )
  }

  // Verificar se o usuário tem contractmiss ativado
  if (!data.hasContractMiss) {
    return (
      <Anim className="flex items-center justify-center">
        <MissionsLockedContainer>
          <LockedIcon><GridLock size="52" color="#94a097" variant="Bulk"/></LockedIcon>
          <LockedTitle>Missões Bloqueadas</LockedTitle>
          <LockedDescription>
            Você precisa ativar o <strong>Contrato de missões</strong> na loja para desbloquear as missões do Battle Pass!
          </LockedDescription>
         
        </MissionsLockedContainer>
      </Anim>
    )
  }

  return (
    <Anim className="flex items-center justify-center">
      <div className="w-full overflow-hidden bg-[#1b1c1d88] p-3 rounded-[12px]">
        {/* Daily Missions */}
        <div className="px-4 pb-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-[#00ff6a] mr-2" />
              <h2 className="text-[#00ff6a] font-['Akac'] uppercase text-lg tracking-wider">Missões Diárias</h2>
            </div>
            <h2 className="bg-transparent text-[#474948] text-[12px] font-bold py-1 px-3 rounded uppercase">
              Resgate Manual
            </h2>
          </div>

          <div className="space-y-2">
            {data.userProgress.dailyMissions && data.userProgress.dailyMissions.length > 0 ? (
              data.userProgress.dailyMissions.map((mission: any) => (
                <div key={mission.id} className="flex items-center gap-1">
                  <div className="flex items-center w-full justify-between bg-[#1b1c1d88] rounded-[15px] p-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#333333] mr-2">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-300 font-['InterSemiBold'] text-sm">{mission.title}</span>
                        <span className="text-gray-500 text-xs">{mission.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-md mr-2">
                        {mission.requirement.current}/{mission.requirement.target}
                      </div>
                      <div className="flex flex-col items-end mr-2">
                        <span className="text-[#00ff6a] font-['Akac'] text-sm">{mission.reward.xp}</span>
                        <span className="text-[#00ff6a] text-xs">EXP</span>
                      </div>

                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#212222] border border-[#00ff6a]">
                        {mission.isCompleted ? (
                          <Check className="w-3 h-3 text-[#00ff6a]" />
                        ) : mission.requirement.current >= mission.requirement.target ? (
                          <Gift
                            className="w-3 h-3 text-[#00ff6a] cursor-pointer"
                            onClick={() => handleCompleteMission(mission.id)}
                          />
                        ) : (
                          <Clock className="w-3 h-3 text-[#00ff6a]" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">Nenhuma missão diária disponível</div>
            )}
          </div>
        </div>

        {/* Weekly Missions */}
        <div className="px-4 pb-6">
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-[#00ff6a] mr-2" />
            <h2 className="text-[#00ff6a] font-['Akac'] uppercase text-lg tracking-wider">Missões Semanais</h2>
          </div>

          <div className="space-y-2">
            {data.userProgress.weeklyMissions && data.userProgress.weeklyMissions.length > 0 ? (
              data.userProgress.weeklyMissions.map((mission: any) => (
                <div
                  key={mission.id}
                  className="flex items-center justify-between w-full bg-[#1b1c1d88] rounded-[15px] p-2"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#333333] mr-2">
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-300 font-['InterSemiBold'] text-sm">{mission.title}</span>
                      <span className="text-gray-500 text-xs">{mission.description}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#333333] text-gray-300 text-xs px-2 py-1 rounded-md mr-2">
                      {mission.requirement.current}/{mission.requirement.target}
                    </div>
                    <div className="flex flex-col items-end mr-2">
                      <span className="text-[#00ff6a] font-['Akac'] text-sm">{mission.reward.xp}</span>
                      <span className="text-[#00ff6a] text-xs">EXP</span>
                    </div>
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#212222] border border-[#00ff6a]">
                      {mission.isCompleted ? (
                        <Check className="w-3 h-3 text-[#00ff6a]" />
                      ) : mission.requirement.current >= mission.requirement.target ? (
                        <Gift
                          className="w-3 h-3 text-[#00ff6a] cursor-pointer"
                          onClick={() => handleCompleteMission(mission.id)}
                        />
                      ) : (
                        <Clock className="w-3 h-3 text-[#00ff6a]" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">Nenhuma missão semanal disponível</div>
            )}
          </div>
        </div>
      </div>
    </Anim>
  )
}

const Anim = styled.div`
  animation: fadeIn 0.5s ease-in-out;
  padding: 1em;
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }
` 
 
// Novos componentes para a tela de missões bloqueadas
const MissionsLockedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 20px;
  background: rgba(28, 34, 31, 0.158);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  margin: 4px;
  width: 100%;
`

const LockedIcon = styled.div`
  font-size: 48px;
  opacity: 0.6;
`

const LockedTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #94a097;
  font-family: 'InterSemiBold', monospace;
  margin: 0;
`

const LockedDescription = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 400px;
  line-height: 1.5;
  margin: 0;
  font-family: 'ProximaNova-Italic', monospace;

  strong {
    color: #00ff6a;
    font-weight: 700;
  }
`

 