"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AreaChart, Area, ResponsiveContainer, ReferenceLine, Label, type DotProps } from "recharts"
import styled, { keyframes } from "styled-components"

const CustomDot = (props: DotProps) => {
  const { cx, cy } = props
  return (
    <div style={{ position: "relative", transform: `translate(${cx}px, ${cy}px)` }}>
      <PulsatingDot />
    </div>
  )
}

// Gera dados CAÓTICOS como Bitcoin, garantindo o resultado final
const generateData = (
  data: { name: string; amount: number }[],
  userBet: "HIGH" | "LOW",
  apiResult: "HIGH" | "LOW" | null,
  timeRemaining: number,
  crashPoint: number,
  hasStarted: boolean,
  volatilityState: { trend: number; momentum: number; lastSpike: number },
  strikePrice: number | null, // Ponto de entrada da aposta
) => {
  const newData = [...data]
  const time = new Date().toLocaleTimeString()
  const lastAmount = newData.length === 0 ? 50 : newData[newData.length - 1].amount

  const progress = (20 - timeRemaining) / 20

  let change = 0
  let finalAmount = lastAmount

  // *** LÓGICA DO RESULTADO DA API E GARANTIA DO CRASH ***
  if (apiResult && progress >= crashPoint && strikePrice !== null) {
    const targetOffset = Math.abs(strikePrice * 0.1); // Dynamic offset based on strikePrice
    if (apiResult === "HIGH") {
      finalAmount = Math.max(strikePrice + targetOffset, strikePrice + 1); // Ensure crash above strikePrice
    } else {
      finalAmount = Math.min(strikePrice - targetOffset, strikePrice - 1); // Ensure crash below strikePrice
    }
  } else if (apiResult && progress > crashPoint * 0.7 && strikePrice !== null) {
    const influence = apiResult === "HIGH" ? 0.5 : -0.5
    change += influence * (progress - crashPoint * 0.7) * 10
  } else {
    const baseVolatility = (Math.random() - 0.5) * 3
    const spikeChance = Math.random()
    let spike = 0
    if (spikeChance < 0.1 && volatilityState.lastSpike > 5) {
      spike = (Math.random() - 0.5) * 15
      volatilityState.lastSpike = 0
    } else {
      volatilityState.lastSpike++
    }

    if (Math.random() < 0.15) {
      volatilityState.momentum = (Math.random() - 0.5) * 2
    }

    if (Math.random() < 0.08) {
      volatilityState.trend = (Math.random() - 0.5) * 1.5
    }

    let correction = 0
    if (Math.random() < 0.05) {
      correction = (Math.random() - 0.5) * 8
    }

    change = baseVolatility + spike + volatilityState.momentum + volatilityState.trend + correction
  }

  finalAmount = Math.max(1, Math.min(200, finalAmount + change))

  newData.push({ name: time, amount: finalAmount })
  return newData
}

interface Props {
  data: { name: string; amount: number }[]
  trend: "HIGH" | "LOW" | null
  apiResult?: "HIGH" | "LOW" | null // Resultado real da API (para onde o gráfico deve ir)
  multiplier?: number
  onEnd: () => void
}

const ChartGameX: React.FC<Props> = ({ data, trend, apiResult = null, multiplier = 0, onEnd }) => {
  const [chartData, setChartData] = useState(data)
  const [timer, setTimer] = useState(30)
  const [chartKey, setChartKey] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [strikePrice, setStrikePrice] = useState<number | null>(null) // Estado para o ponto de entrada

  const [volatilityState] = useState({
    trend: 0,
    momentum: 0,
    lastSpike: 0,
  })

  const [crashPoint] = useState(Math.random() * 0.4 + 0.3)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (trend && !gameEnded) {
      setHasStarted(true)
      if (strikePrice === null) {
        // Define o strikePrice no início do jogo, usando o valor inicial ou o primeiro ponto
        setStrikePrice(chartData.length > 0 ? chartData[chartData.length - 1].amount : 50)
      }

      interval = setInterval(() => {
        setChartData((prevData) =>
          generateData(prevData, trend, apiResult, timer, crashPoint, hasStarted, volatilityState, strikePrice),
        )
      }, 80)

      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerInterval)
            if (interval) clearInterval(interval)
            setGameEnded(true)

            setTimeout(() => {
              setChartData([])
              setTimer(20)
              setGameEnded(false)
              setHasStarted(false)
              setStrikePrice(null) // Reseta o strikePrice
              volatilityState.trend = 0
              volatilityState.momentum = 0
              volatilityState.lastSpike = 0
              setChartKey((prevKey) => prevKey + 1)
              onEnd()
            }, 3000)

            return 0
          }
          return prevTimer - 1
        })
      }, 1000)

      return () => {
        clearInterval(timerInterval)
        if (interval) clearInterval(interval)
      }
    } else if (!trend && strikePrice !== null) {
      setStrikePrice(null)
    }
  }, [trend, apiResult, onEnd, timer, crashPoint, hasStarted, gameEnded, volatilityState, strikePrice, chartData])

  const getChartColor = () => {
    if (!chartData.length) return "#22c55e"

    if (gameEnded && apiResult) {
      // A cor final é baseada se a aposta do usuário (trend) corresponde ao resultado da API (apiResult)
      const userWon = trend === apiResult
      return userWon ? "#22c55e" : "#ef4444"
    }

    if (chartData.length >= 2) {
      const current = chartData[chartData.length - 1].amount
      const previous = chartData[chartData.length - 2].amount
      return current > previous ? "#22c55e" : "#ef4444"
    }

    return "#22c55e"
  }

  const chartColor = getChartColor()

  const getCurrentStats = () => {
    if (chartData.length < 2) return { change: 0, volatility: "LOW" }

    const current = chartData[chartData.length - 1].amount
    const previous = chartData[chartData.length - 2].amount
    const change = ((current - previous) / previous) * 100

    const recent = chartData.slice(-10)
    const volatility =
      recent.length > 1
        ? recent.reduce((acc, point, i) => {
            if (i === 0) return acc
            const prevPoint = recent[i - 1]
            return acc + Math.abs(point.amount - prevPoint.amount)
          }, 0) / recent.length
        : 0

    return {
      change: change.toFixed(2),
      volatility: volatility > 3 ? "HIGH" : volatility > 1.5 ? "MED" : "LOW",
    }
  }

  const stats = getCurrentStats()

  const finalAmount = chartData.length > 0 ? chartData[chartData.length - 1].amount : 0
  // *** CORREÇÃO AQUI: A vitória/derrota é determinada se a aposta do usuário (trend)
  // corresponde ao resultado da API (apiResult), não pela posição final vs strike.
  // A posição final vs strike é apenas uma representação visual do apiResult.
  const userWon = apiResult === trend; // Corrige a lógica para determinar vitória/derrota com base no resultado da API e na aposta do usuário
  const graphResult = apiResult; // Usa apiResult diretamente para alinhar o gráfico

  

  return (
    
    <StyledChartWrapper>
      <ResponsiveContainer key={chartKey}>
        {trend ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity="0.2" />
                <stop offset="50%" stopColor={chartColor} stopOpacity="0.1" />
                <stop offset="100%" stopColor={chartColor} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="amount"
              stroke={chartColor}
              fill="url(#areaGradient)"
              strokeWidth={1.5}
              dot={gameEnded ? false : <CustomDot />}
              animationDuration={0}
              style={{ filter: `drop-shadow(0px 1px 3px ${chartColor}40)` }}
            />
            {strikePrice !== null && (
              <ReferenceLine y={strikePrice} stroke="#333a33" strokeDasharray="4 4" strokeWidth={1.5}>
                <Label
                  value={`Entrada: ${strikePrice.toFixed(2)}`}
                  position="right"
                  fill="#41413d"
                  offset={10}
                  style={{ fontSize: "11px", fontWeight: "bold" }}
                />
              </ReferenceLine>
            )}
          </AreaChart>
        ) : (
          <MarginResult>
            <section>
              {gameEnded && graphResult ? (
                <div>
                  <h4 style={{ color: chartColor }}>🎯 CRASH: {graphResult}</h4>
                  <p style={{ fontSize: "14px", marginTop: "3px", color: chartColor }}>
                    {trend} → {userWon ? "✅ WIN!" : "❌ LOSE!"}
                  </p>
                </div>
              ) : (
                <div>
                  <h4>⏱ {timer}s</h4>
                  <div style={{ fontSize: "11px", marginTop: "2px", opacity: 0.7 }}>
                     {stats.change}% |  {stats.volatility}
                  </div>
                </div>
              )}
            </section>
          </MarginResult>
        )}
      </ResponsiveContainer>
    </StyledChartWrapper>
  )
}

export default ChartGameX

const StyledChartWrapper = styled.div`
  width: 100%;
  height: 140px;
  overflow: hidden;
  position: relative;
 

`

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`

const PulsatingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border: 1px solid #ffffff;
  border-radius: 50%;
  animation: ${pulseAnimation} 1s infinite;
  position: absolute;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
`

const MarginResult = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  height: 100%;

  section {
    width: 100%;
    height: 100%;
    display: flex;
    place-items: center;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  h4 {
    font-family: 'Graffiti';
    font-size: 18px;
    font-weight: 600;
    color: #22c55e;
    text-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
  }

  p, div {
    font-family: 'InterSemiBold', monospace;
    color: #a0a0a0;
    font-weight: 500;
  }
`
