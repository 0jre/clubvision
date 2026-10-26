"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styled from "styled-components"
import moment from "moment-timezone"
import dynamic from "next/dynamic"
import { decrypt } from "@/core/security/encryption"
import {
  Users,
  TrendingUp,
  Calendar,
  Activity,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"

moment.tz.setDefault("America/Sao_Paulo")

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface UserData {
  count: number
  lastUserName: string
  firstLoginDate: string
  log: Array<{
    firstLoginDate: string
    name: string
    reforms?: {
      type: boolean
      prime: boolean
    }
  }>
}

interface ChartDataPoint {
  x: string
  y: number
}

const StatusTotal = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [userInfo, setUserInfo] = useState<UserData | null>(null)
  const [userCount, setUserCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area")
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/_v4/check/list.graphic")
      const userDataa = decrypt(response.data)
      const userData = JSON.parse(userDataa)

      console.log("Dados recebidos da API:", userData)

      // Organiza os dados de login dos usuários por data de primeiro login
      const logins = userData.log.sort(
        (a: any, b: any) => new Date(a.firstLoginDate).getTime() - new Date(b.firstLoginDate).getTime(),
      )

      // Filtra dados baseado no período selecionado
      const filteredLogins = filterDataByTimeRange(logins, timeRange)

      // Cria um array de objetos contendo a data de login e o número de usuários até essa data
      const chartData = filteredLogins.map((login: any, index: number) => ({
        x: new Date(login.firstLoginDate).toISOString(),
        y: index + 1,
      }))

      console.log("Dados do gráfico:", chartData)

      setChartData(chartData)
      setUserInfo(userData)
      setUserCount(userData.count)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterDataByTimeRange = (data: any[], range: string) => {
    if (range === "all") return data

    const now = moment()
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90

    return data.filter((item) => {
      const itemDate = moment(item.firstLoginDate)
      return now.diff(itemDate, "days") <= days
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchData()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleTimeRangeChange = (range: "7d" | "30d" | "90d" | "all") => {
    setTimeRange(range)
    if (userInfo) {
      const filteredLogins = filterDataByTimeRange(userInfo.log, range)
      const newChartData = filteredLogins.map((login: any, index: number) => ({
        x: new Date(login.firstLoginDate).toISOString(),
        y: index + 1,
      }))
      setChartData(newChartData)
    }
  }

  const exportData = () => {
    if (!chartData.length) return

    const csvContent = [
      ["Data", "Usuários Acumulados"],
      ...chartData.map((point) => [moment(point.x).format("DD/MM/YYYY"), point.y.toString()]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `user-statistics-${moment().format("YYYY-MM-DD")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getGrowthRate = () => {
    if (chartData.length < 2) return 0
    const firstValue = chartData[0].y
    const lastValue = chartData[chartData.length - 1].y
    return ((lastValue - firstValue) / firstValue) * 100
  }

  const getActiveUsers = () => {
    if (!userInfo?.log) return 0
    return userInfo.log.filter((user) => user.reforms?.type).length
  }

  const getPrimeUsers = () => {
    if (!userInfo?.log) return 0
    return userInfo.log.filter((user) => user.reforms?.prime).length
  }

  const getAverageUsersPerDay = () => {
    if (chartData.length < 2) return 0
    const days = moment(chartData[chartData.length - 1].x).diff(moment(chartData[0].x), "days")
    return days > 0 ? Math.round(chartData[chartData.length - 1].y / days) : 0
  }

  const chartOptions = {
    chart: {
      id: "user-growth-chart",
      type: chartType,
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: true,
        },
        autoSelected: "zoom" as "zoom",
      },
      background: "#ffffff",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth" as "smooth",
      colors: ["#3b82f6"],
    },
    markers: {
      size: 4,
      colors: ["#3b82f6"],
      strokeColors: "#ffffff",
      strokeWidth: 2,
    },
    yaxis: {
      opposite: false,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: "#e5e7eb",
      },
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
    },
    xaxis: {
      type: "datetime" as "datetime",
      labels: {
        formatter: (val: any) => moment(val).format("DD/MM"),
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: true,
        color: "#e5e7eb",
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      followCursor: true,
      intersect: false,
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      x: {
        show: true,
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (value: number) => `${value} usuários`,
      },
      marker: {
        show: true,
        fillColors: ["#3b82f6"],
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: "#3b82f6",
            opacity: 0.4,
          },
          {
            offset: 100,
            color: "#3b82f6",
            opacity: 0.1,
          },
        ],
      },
    },
    grid: {
      show: true,
      borderColor: "#f3f4f6",
      strokeDashArray: 3,
    },
    colors: ["#3b82f6"],
  }

  const stats = [
    {
      label: "Total de Usuários",
      value: userCount.toString(),
      change: `+${getGrowthRate().toFixed(1)}%`,
      icon: Users,
      color: "#3b82f6",
    },
    {
      label: "Usuários Ativos",
      value: getActiveUsers().toString(),
      change: `${((getActiveUsers() / userCount) * 100).toFixed(1)}%`,
      icon: Activity,
      color: "#10b981",
    },
    {
      label: "Usuários Prime",
      value: getPrimeUsers().toString(),
      change: `${((getPrimeUsers() / userCount) * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: "#f59e0b",
    },
    {
      label: "Média por Dia",
      value: getAverageUsersPerDay().toString(),
      change: "últimos 30 dias",
      icon: Calendar,
      color: "#8b5cf6",
    },
  ]

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <RefreshCw className="animate-spin" size={32} />
          <p>Carregando estatísticas...</p>
        </LoadingState>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Estatísticas de Usuários</Title>
          <Subtitle>Acompanhe o crescimento e engajamento da plataforma</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <ActionButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Atualizar
          </ActionButton>
          <ActionButton onClick={exportData}>
            <Download size={16} />
            Exportar
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <StatCard key={index}>
              <StatHeader>
                <IconContainer color={stat.color}>
                  <Icon size={24} color={stat.color} />
                </IconContainer>
                <ChangeIndicator>{stat.change}</ChangeIndicator>
              </StatHeader>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          )
        })}
      </StatsGrid>

      <ChartSection>
        <ChartHeader>
          <ChartTitle>Crescimento de Usuários</ChartTitle>
          <ChartControls>
            <FilterGroup>
              <FilterButton active={timeRange === "7d"} onClick={() => handleTimeRangeChange("7d")}>
                7 dias
              </FilterButton>
              <FilterButton active={timeRange === "30d"} onClick={() => handleTimeRangeChange("30d")}>
                30 dias
              </FilterButton>
              <FilterButton active={timeRange === "90d"} onClick={() => handleTimeRangeChange("90d")}>
                90 dias
              </FilterButton>
              <FilterButton active={timeRange === "all"} onClick={() => handleTimeRangeChange("all")}>
                Todos
              </FilterButton>
            </FilterGroup>
            <ChartTypeGroup>
              <ChartTypeButton active={chartType === "area"} onClick={() => setChartType("area")}>
                <BarChart3 size={16} />
              </ChartTypeButton>
              <ChartTypeButton active={chartType === "line"} onClick={() => setChartType("line")}>
                <LineChart size={16} />
              </ChartTypeButton>
              <ChartTypeButton active={chartType === "bar"} onClick={() => setChartType("bar")}>
                <PieChart size={16} />
              </ChartTypeButton>
            </ChartTypeGroup>
          </ChartControls>
        </ChartHeader>

        <ChartContainer>
          
          <ApexChart
            options={chartOptions}
            series={[
              {
                name: "Usuários",
                data: chartData.map((point) => [new Date(point.x).getTime(), point.y]),
              },
            ]}
            type={chartType}
            height={350}
          />
        </ChartContainer>
      </ChartSection>

      {userInfo && (
        <DetailsSection>
          <DetailsTitle>Detalhes Adicionais</DetailsTitle>
          <DetailsGrid>
            <DetailCard>
              <DetailLabel>Primeiro Usuário</DetailLabel>
              <DetailValue>{userInfo.lastUserName || "---"}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Data do Último Registro</DetailLabel>
              <DetailValue>
                {userInfo.firstLoginDate ? (
                  <>
                    {moment(userInfo.firstLoginDate).format("DD/MM/YYYY")} às{" "}
                    {moment(userInfo.firstLoginDate).format("HH:mm")}
                  </>
                ) : (
                  "---"
                )}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Taxa de Conversão</DetailLabel>
              <DetailValue>{((getActiveUsers() / userCount) * 100).toFixed(1)}%</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Usuários Premium</DetailLabel>
              <DetailValue>{((getPrimeUsers() / userCount) * 100).toFixed(1)}%</DetailValue>
            </DetailCard>
          </DetailsGrid>
        </DetailsSection>
      )}
    </Container>
  )
}

export default StatusTotal

// Styled Components
const Container = styled.div`
  padding: 24px;
     border: 1px solid #e5e5e5;
  border-radius: 8px;
  margin: 16px 0;
`

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #6b7280;

  p {
    margin-top: 16px;
    font-size: 16px;
    font-family: "Inter", sans-serif;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`

const HeaderContent = styled.div``

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  font-family: "Inter", sans-serif;
`

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 16px;
`

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
`

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`

const StatCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

const IconContainer = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  background-color: ${(props) => props.color}20;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChangeIndicator = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 6px;
`

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  font-family: "Inter", sans-serif;
`

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: "Inter", sans-serif;
`

const ChartSection = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  font-family: "Inter", sans-serif;
`

const ChartControls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
`

const FilterGroup = styled.div`
  display: flex;
  gap: 4px;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
`

const FilterButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: "Inter", sans-serif;

  ${({ active }) =>
    active
      ? `
    background-color: #ffffff;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  `
      : `
    background-color: transparent;
    color: #6b7280;
    
    &:hover {
      color: #374151;
    }
  `}
`

const ChartTypeGroup = styled.div`
  display: flex;
  gap: 4px;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
`

const ChartTypeButton = styled.button<{ active: boolean }>`
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ active }) =>
    active
      ? `
    background-color: #ffffff;
    color: #1f2937;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  `
      : `
    background-color: transparent;
    color: #6b7280;
    
    &:hover {
      color: #374151;
    }
  `}
`

const ChartContainer = styled.div`
  padding: 20px;

  .apexcharts-tooltip {
    background-color: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
    color: #1f2937 !important;
    font-family: "Inter", sans-serif !important;
  }

  .apexcharts-menu {
    background-color: #ffffff !important;
    border: 1px solid #e5e7eb !important;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  }

  .apexcharts-menu-item {
    color: #374151 !important;
    font-family: "Inter", sans-serif !important;

    &:hover {
      background-color: #f9fafb !important;
    }
  }
`

const DetailsSection = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
`

const DetailsTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  font-family: "Inter", sans-serif;
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`

const DetailCard = styled.div`
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

const DetailLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  font-family: "Inter", sans-serif;
`

const DetailValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: "Inter", sans-serif;
`
