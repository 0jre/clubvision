"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  Activity,
  Brain,
  Zap,
  Sparkles,
  Cpu,
  ChevronDown,
  BarChart3,
} from "lucide-react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import styled from "styled-components";
import { getActionDescription } from "@/components/vision/ui/charts";
import LoadingPageView from "@/resources/loading/market.loading";

// Interfaces
interface WalletInsights {
  summary: {
    totalTransactions: number
    totalVolume: number
    mostFrequentAction: string
    mostProfitableAction: string
    mostCostlyAction: string
    averageTransactionSize: number
  }
  patterns: {
    bestDayOfWeek: string
    bestTimeOfDay: string
    worstDayOfWeek: string
    successRate: number
  }
  recommendations: string[]
  riskAnalysis: {
    riskLevel: "low" | "medium" | "high"
    volatilityScore: number
    largestLoss: number
    largestGain: number
    riskRewardRatio: number
  }
}

export default function HavocAIInterface({ userId }: { userId: string }) {
  const [data, setData] = useState<WalletInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [visibleSections, setVisibleSections] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const fullText = "Analisando seu perfil financeiro para gerar insights personalizados..."
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  // Simulated typing effect
  useEffect(() => {
    if (loading && typingText.length < fullText.length) {
      typingRef.current = setTimeout(() => {
        setTypingText(fullText.substring(0, typingText.length + 1))
      }, 90)
    }

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current)
    }
  }, [typingText, loading])

    useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 8000) // 8 segundos

    return () => clearTimeout(timer)
  }, [])
  
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/activity/wallet/insights/wallet-insights?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Falha ao buscar insights da carteira")
        }

        const result = await response.json()

        // Simulate AI processing time
        setTimeout(() => {
          setData(result)
       

          // Sequentially reveal sections
          setTimeout(() => setVisibleSections((prev) => [...prev, "summary"]), 500)
          setTimeout(() => setVisibleSections((prev) => [...prev, "transactions"]), 1000)
          setTimeout(() => setVisibleSections((prev) => [...prev, "patterns"]), 1500)
          setTimeout(() => setVisibleSections((prev) => [...prev, "risk"]), 2000)
          setTimeout(() => {
            setVisibleSections((prev) => [...prev, "recommendations"])
            setAnalysisComplete(true)
          }, 4500)
        }, 4000)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
        console.error("Erro ao buscar insights:", err)
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[400px] p-8"
      
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
          
          <LoadingPageView />
        
      </motion.div>
    )
  }

  if (error || !data) {
    return (
      <motion.div
        className="p-6 text-center"
        style={{
          backgroundColor: "rgb(32, 34, 33)",
          borderRadius: "0.75rem",
          border: "2px solid rgba(128, 128, 128, 0.3)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-500 mb-2">Erro na Análise</h3>
        <p className="text-red-300">Não foi possível processar os dados da carteira</p>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </motion.div>
    )
  }

  const { summary, patterns, recommendations, riskAnalysis } = data

  return (
    <div className="space-y-6 font-sans">
       
 

      <AnimatePresence>


          {/* Recommendations Section */}
        {visibleSections.includes("recommendations") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)",
              borderRadius: "0.75rem",
           
            }}
            className="overflow-hidden"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("recommendations")}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Recomendações</h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes("recommendations") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>

            <AnimatePresence>
              {(expandedSections.includes("recommendations") || !analysisComplete) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-[#262928] space-y-3">
                    {recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <div className="mr-3 mt-0.5">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [0.8, 1.2, 1] }}
                            transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                          >
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        </div>
                        <p className="text-sm text-gray-200 font-['Inter']">{recommendation}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Summary Section */}
        {visibleSections.includes("summary") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)",
              borderRadius: "0.75rem",
             
            }}
            className="overflow-hidden"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("summary")}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Atividade da Carteira</h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes("summary") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>

            <AnimatePresence>
              {(expandedSections.includes("summary") || !analysisComplete) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-[#262928]">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Total de Transações</span>
                      <span className="text-sm font-medium text-white">{summary.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Volume Total</span>
                      <span className="text-sm font-medium text-white">{summary.totalVolume.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Média por Transação</span>
                      <span className="text-sm font-medium text-white">
                        {summary.averageTransactionSize.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Transactions Section */}
        {visibleSections.includes("transactions") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)",
              borderRadius: "0.75rem",
              
            }}
            className="overflow-hidden"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("transactions")}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Análise de Transações</h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes("transactions") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>

            <AnimatePresence>
              {(expandedSections.includes("transactions") || !analysisComplete) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-[#262928]">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Ação Mais Frequente</span>
                      <span className="text-sm font-medium text-white">{getActionDescription(summary.mostFrequentAction)}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Mais Lucrativa</span>
                      <span className="text-sm font-medium text-emerald-400">{getActionDescription(summary.mostProfitableAction)}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Mais Custosa</span>
                      <span className="text-sm font-medium text-red-400">{getActionDescription(summary.mostCostlyAction)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-400">Taxa de Sucesso</span>
                      <span className="text-sm font-medium text-white">{patterns.successRate.toFixed(2)}%</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${patterns.successRate > 50 ? "bg-emerald-500" : "bg-red-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${patterns.successRate}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Patterns Section */}
        {visibleSections.includes("patterns") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)",
              borderRadius: "0.75rem",
             
            }}
            className="overflow-hidden"
          >
            <div
              className="p-4 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("patterns")}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Padrões Temporais</h3>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.includes("patterns") ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>

            <AnimatePresence>
              {(expandedSections.includes("patterns") || !analysisComplete) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-[#262928]">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Melhor Dia</span>
                      <span className="text-sm font-medium text-emerald-400">{patterns.bestDayOfWeek}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Pior Dia</span>
                      <span className="text-sm font-medium text-red-400">{patterns.worstDayOfWeek}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Melhor Horário</span>
                      <span className="text-sm font-medium text-emerald-400">{patterns.bestTimeOfDay}</span>
                    </div>
                   
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Risk Analysis Section */}
        {visibleSections.includes("risk") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: "linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)",
              borderRadius: "0.75rem",
            
            }}
            className="overflow-hidden"
          >
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleSection("risk")}>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Perfil de Risco</h3>
              </div>
              <div className="flex items-center">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium mr-3
                    ${
                      riskAnalysis.riskLevel === "low"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : riskAnalysis.riskLevel === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                >
                  {riskAnalysis.riskLevel === "low" ? "Baixo" : riskAnalysis.riskLevel === "medium" ? "Médio" : "Alto"}
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.includes("risk") ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {(expandedSections.includes("risk") || !analysisComplete) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t border-[#262928]">
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Volatilidade</span>
                      <span className="text-sm font-medium text-white">{riskAnalysis.volatilityScore.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Maior Ganho</span>
                      <span className="text-sm font-medium text-emerald-400">
                        {riskAnalysis.largestGain.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <span className="text-xs text-gray-400">Maior Perda</span>
                      <span className="text-sm font-medium text-red-400">{riskAnalysis.largestLoss.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-400">Relação Risco/Recompensa</span>
                      <span
                        className={`text-sm font-medium ${
                          riskAnalysis.riskRewardRatio >= 1 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {riskAnalysis.riskRewardRatio.toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-400">Equilíbrio Risco/Recompensa</span>
                        <span
                          className={`text-xs ${
                            riskAnalysis.riskRewardRatio >= 1 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {riskAnalysis.riskRewardRatio >= 1 ? "Favorável" : "Desfavorável"}
                        </span>
                      </div>
                      <div className="h-1 bg-gray-700 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-500 z-10"></div>
                        <motion.div
                          className={`h-full ${riskAnalysis.riskRewardRatio >= 1 ? "bg-emerald-500" : "bg-red-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, riskAnalysis.riskRewardRatio * 50)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">Risco</span>
                        <span className="text-xs text-gray-500">Recompensa</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

       
      </AnimatePresence>

      {analysisComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: "linear-gradient(204deg, #17181740 -7%, #1d1d1d 33%), linear-gradient(162deg, #24252540 -10%, #2c88dd00 25%), linear-gradient(0deg, #1e1e1f, #1e1e1f)",
            borderRadius: "0.75rem",
            
          }}
          className="p-4"
        >
          <div className="flex items-center mb-3">
            <Sparkles className="w-5 h-5 text-emerald-400 mr-2" />
            <h3 className="text-base font-semibold text-white">Conclusão da Análise</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4 font-['Inter']">
            Baseado na análise completa do seu perfil de transações, identificamos padrões significativos em seu
            comportamento financeiro. Suas transações apresentam uma taxa de sucesso de{" "}
            <span className="font-medium">{patterns.successRate.toFixed(2)}%</span> com melhor desempenho às{" "}
            <span className="font-medium text-emerald-400">{patterns.bestTimeOfDay}</span> de{" "}
            <span className="font-medium text-emerald-400">{patterns.bestDayOfWeek}</span>. Seu perfil de risco atual é
            classificado como{" "}
            <span
              className={`font-medium ${
                riskAnalysis.riskLevel === "low"
                  ? "text-emerald-400"
                  : riskAnalysis.riskLevel === "medium"
                    ? "text-amber-400"
                    : "text-red-400"
              }`}
            >
              {riskAnalysis.riskLevel === "low" ? "baixo" : riskAnalysis.riskLevel === "medium" ? "médio" : "alto"}
            </span>
            .
          </p>

          

          <motion.div
            className="mt-4 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </div>
  )
}

const BadgeContainer = styled.div`
  text-align: center;
  background-color: #3bc77a;
  border-radius: 9999px;
  padding: 0.125rem;
  display: inline-block;

   
`;

const BadgeCs = styled.div`
  text-transform: uppercase;
  font-weight: bold;
  padding: 0.25rem 1rem;
  border: 2px solid #0a0a0a; 
  border-radius: 9999px;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: black;
`;
