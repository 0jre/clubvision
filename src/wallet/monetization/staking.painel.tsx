import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import router from 'next/router';

interface Prop {
  updatedBitsOnStaking: number;
  lock: boolean;
}

const generateRandomTime = () =>
  Math.floor(Math.random() * (12000 - 5000 + 1)) + 5000;

export const StakingPainel = () => {
  const [summary, setTotalRewards] = useState<Prop | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [viewstaking, setstaking] = useState<any[]>([]);
  const [animateOnce, setAnimateOnce] = useState(false);
  const [active, setactive] = useState(false);

  const checkAndCalculateRewards = async (): Promise<boolean> => {
    try {
      const response = await axios.post("/api/staking/calculate");
      const { success, resumo, detalhesStaking, active } = response.data;

      if (response.status === 200 && success && detalhesStaking.some((s: any) => s.isEligibleForReward && s.lock)) {
        setTotalRewards(resumo);
        setstaking(detalhesStaking);
        setShowReward(true);
        setAnimateOnce(true);
        setactive(active);
        localStorage.setItem("lastRewardDate", new Date().toISOString());
        return true;
      } else {
        setShowReward(false);
        return false;
      }
    } catch (error) {
      console.error("Erro ao calcular recompensas:", error);
      setShowReward(false);
      return false;
    }
  };


  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runCycle = async () => {
      const success = await checkAndCalculateRewards();
      if (success) {
        const nextTime = generateRandomTime();
        timeout = setTimeout(runCycle, nextTime);
      } else {
        console.log("Atualização automática pausada devido a falha na requisição. Atualize manualmente.");
      }
    };

    runCycle();
    setTimeout(() => {
      setShowReward(false);
      setAnimateOnce(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (showReward) {
      const sound = new Audio("/Sounds/system-notification.mp3");
      sound.volume = 0.06;
      sound.play().catch((err) => console.error("Erro ao reproduzir som:", err));
    }
  }, [showReward]);

  const formatCurrency = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '•••';
    }

    return value.toLocaleString("en-US", {
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!showReward) return null;

  return active && showReward && (
    <Container showReward={animateOnce}>
      <Card
        onClick={() => router.push('?wallet=staking')}
        className="cardusdfi"
      >
        <ul>
          <li>
            <p>
              {viewstaking.some(staking => staking.lock && staking.isEligibleForReward) ? (
                <p>
                  Em Execução - <span>Staking </span>
                </p>
              ) : (
                <>
                  <p>
                    Staking inativo - <span> BLOQUEADO </span>
                  </p>
                </>
              )}
            </p>

            <div className="lines">
              <img
                src="/icons/coins/orbit-novision.webp"
                alt="bits"
                height={20}
                width={20}
              />
              <h1>{formatCurrency(summary?.updatedBitsOnStaking ?? 0)}</h1>
            </div>
          </li>
        </ul>
      </Card>
    </Container>
  );
};


const Container = styled.div<{ showReward: boolean }>`
  position: fixed;
  right: 8px;
  z-index: 99283;
  bottom: 6px;
  
  @media screen and (max-width:530px){
    bottom: 58px;
  }
  
`;

const Card = styled.div`
  padding: 0.4em 1em 0.4em;
  width: 240px;
  background-color: #0B0C0A;
  background-image: url('/icons/Npc_Miner.webp');
  background-position: right;
  background-position-y: 80% ;
  background-size: 37%;
  background-repeat: no-repeat;
  margin: 1em;
  border: 2px solid #151616;
  animation: glowAnimation 0.3s forwards;
   box-shadow: 0 0 15px 5px rgba(37, 37, 39, 0.4);
   --gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #2da061, #0f0c0c 99%, transparent);
   border: solid 2px transparent; 
   border-image: var(--gradient-border) 1;
   animation: bg-spin 3s linear infinite;
   cursor: var(--f-cursor-pointer);
  ul{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }


  p{
    font-size: 7px;
    font-family: 'Europa Grotesk';
    color: #2c2d2e;
    margin-bottom: 0.4em;
  }

  

  h1{
    font-size: 13px;
    font-family: 'InterSemiBold', monospace;
  }

  .lines{
    display: flex;
    align-items: center;
    gap: 9px;
  }

  @keyframes bg-spin {
   
    to {
      --border-angle: 9turn;
    }
  }

  @property --border-angle {
    syntax: "<angle>";
    inherits: true;
    initial-value: 0turn;
  }

  
`;
