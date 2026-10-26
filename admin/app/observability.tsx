import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

 
async function fetchMetrics() {
  return await fetch('/api/admin/observability-metrics').then(res => res.json());
}

interface Data {
  
  system?: {
    memory?: {
      heapUsed?: number;
    };
  };
  security?: {
    blockedRequests?: number;
  };

  cache?: {
    hitRatio?: number;
    errorRate?: number;
    queueLength?: number;
    syncLocks?: number;
  };
}
  
const ProgressCircle = ({ value, label, color = '#24e665', size = 80 }: { value: number, label: string, color?: string, size?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Fundo do círculo */}
      <circle cx={size/2} cy={size/2} r={size/2-6} fill="none" stroke="#e6e6e6" strokeWidth={8} />
      {/* Círculo de progresso */}
      <circle
        cx={size/2}
        cy={size/2}
        r={size/2-6}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={`${Math.PI * (size-12)}`}
        strokeDashoffset={`${Math.PI * (size-12) * (1 - value)}`}
        style={{ transition: 'stroke-dashoffset 0.5s', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      {/* Texto do valor percentual */}
      <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize={size/4.5} fill="#222" fontWeight="bold">{(value*100).toFixed(0)}%</text>
    </svg>
    {/* Rótulo abaixo do círculo */}
    <span style={{ fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' }}>{label}</span>
  </div>
);

// Cores para gráficos (ajustadas para um visual mais profissional)
const COLORS = ['#0070f3', '#ffb300', '#24e665', '#e62424', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
const COLOR_PRIMARY = '#0070f3'; // Azul Vercel
const COLOR_SECONDARY = '#ffb300'; // Laranja Vercel

export default function ObservabilityPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
 
  useEffect(() => {
    let mounted = true;
    async function poll() {
      try {
        const data = await fetchMetrics();
      const typedData = data as Data;
      const typedData2 = data as Data;

        if (!mounted) return;
        setMetrics(data);
        // Mantém os últimos 30 pontos de dados para o histórico
       setHistory(h => [
  ...h.slice(-29),
  {
    time: new Date().toLocaleTimeString(),
    hitRatio: typedData2.cache?.hitRatio,
    queueLength: typedData2.cache?.queueLength,
    syncLocks: typedData2.cache?.syncLocks,
    errorRate: typedData2.cache?.errorRate,
  }
]);
        // Gera alertas com base em limites predefinidos
       setAlerts([
  ...(typedData.cache?.hitRatio !== undefined && typedData.cache.hitRatio < 0.7
    ? [`Cache Hit Ratio baixo: ${(typedData.cache.hitRatio * 100).toFixed(1)}%!`]
    : []),
  ...(typedData.cache?.errorRate !== undefined && typedData.cache.errorRate > 0.05
    ? [`Alta taxa de erros: ${(typedData.cache.errorRate * 100).toFixed(1)}%!`]
    : []),
  ...(typedData.cache?.queueLength !== undefined && typedData.cache.queueLength > 50
    ? [`Fila de operações muito grande: ${typedData.cache.queueLength} operações pendentes.`]
    : []),
  ...(typedData.cache?.syncLocks !== undefined && typedData.cache.syncLocks > 30
    ? [`Muitos locks de invalidação: ${typedData.cache.syncLocks} locks ativos.`]
    : []),
  ...(typedData.system?.memory?.heapUsed !== undefined && typedData.system.memory.heapUsed / 1024 / 1024 > 500
    ? [`Uso de memória elevado: ${(typedData.system.memory.heapUsed / 1024 / 1024).toFixed(2)} MB.`]
    : []),
  ...(typedData.security?.blockedRequests !== undefined && typedData.security.blockedRequests > 0
    ? [`Requisições de segurança bloqueadas: ${typedData.security.blockedRequests}.`]
    : []),
]);
      } catch (error) {
        console.error("Falha ao buscar métricas:", error);
        if (mounted) {
          setAlerts(a => [...a, 'Falha ao buscar métricas do servidor.']);
        }
      }
      setTimeout(poll, 5000); // Polling a cada 5 segundos
    }
    poll();
    return () => { mounted = false; };
  }, []);

  // Dados para gráficos de barras do Cache
  const cacheBarData = [
    { name: 'Total Hits', value: metrics?.cache?.totalHits ?? 0 },
    { name: 'Total Misses', value: metrics?.cache?.totalMisses ?? 0 },
    { name: 'Total Sets', value: metrics?.cache?.totalSets ?? 0 },
    { name: 'Total Invalidations', value: metrics?.cache?.totalInvalidations ?? 0 },
  ];
  const lruBarData = [
    { name: 'LRU Hits', value: metrics?.cache?.lruHits ?? 0 },
    { name: 'LRU Misses', value: metrics?.cache?.lruMisses ?? 0 },
    { name: 'Evictions', value: metrics?.cache?.lruEvictions ?? 0 },
  ];
  const redisBarData = [
    { name: 'Redis Hits', value: metrics?.cache?.redisHits ?? 0 },
    { name: 'Redis Misses', value: metrics?.cache?.redisMisses ?? 0 },
  ];

  // Dados para gráficos de Segurança
  const securityOverviewData = [
    { name: 'Total Requisições', value: metrics?.security?.totalRequests ?? 0 },
    { name: 'Requisições Bloqueadas', value: metrics?.security?.blockedRequests ?? 0 },
    { name: 'Atividade Suspeita', value: metrics?.security?.suspiciousActivity ?? 0 },
    { name: 'Ameaças Ativas', value: metrics?.security?.activeThreats ?? 0 },
    { name: 'Falsos Positivos', value: metrics?.security?.falsePositives ?? 0 },
  ];
  const threatsPieData = metrics?.security?.threatsByType && Object.keys(metrics.security.threatsByType).length > 0
    ? Object.entries(metrics.security.threatsByType).map(([k, v]) => ({ name: k, value: v as number }))
    : null;

  // Dados para Performance
  const perf = metrics?.performance?.consolidated || {};
  const perfHealth = perf.healthScore ? Math.max(0, Math.min(1, perf.healthScore / 100)) : 0; // Normaliza para 0-1
  const perfStatus = perf.status || 'N/A';
  const perfOverall = perf.overallPerformance || 'N/A';
  const perfQueries = metrics?.performance?.queries || {};
  const perfWorkerPool = metrics?.performance?.workerPool ?? 'N/A';
  const perfRecommendations = metrics?.performance?.recommendations || [];

  // Dados para Sistema
  const sysMem = metrics?.system?.memory || {};
  const sysMemPie = Object.keys(sysMem).length > 0
    ? Object.entries(sysMem).map(([k, v]) => ({ name: k, value: typeof v === 'number' ? v : 0 }))
    : null;
  const sysUptime = metrics?.system?.uptime ?? 0;

  return (
    <Main>
      <Content>
        <Title>Observabilidade do Core</Title>
        <Section>
          <ProgressCircleContainer>
            <ProgressCircle value={metrics?.cache?.hitRatio ?? 0} label="Hit Ratio Cache" color={COLOR_PRIMARY} />
            <ProgressCircle value={metrics?.cache?.errorRate ?? 0} label="Taxa de Erros" color={metrics?.cache?.errorRate > 0.05 ? '#e62424' : '#24e665'} />
            <ProgressCircle value={metrics?.cache?.combinedHitRatio ?? 0} label="Hit Ratio Combinado" color={COLOR_PRIMARY} />
            <ProgressCircle value={metrics?.cache?.redisHitRatio ?? 0} label="Hit Ratio Redis" color={COLOR_SECONDARY} />
            <ProgressCircle value={metrics?.cache?.lruStats?.lruHitRatio ?? 0} label="Hit Ratio LRU" color={COLOR_SECONDARY} />
            <ProgressCircle value={perfHealth} label="Pontuação de Saúde" color={perfHealth < 0.7 ? '#e62424' : '#24e665'} />
          </ProgressCircleContainer>

          <GridContainer>
            <Card>
              <CardTitle>Ambiente</CardTitle>
              <CardValue>{metrics?.environment || 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Status Geral</CardTitle>
              <CardValue>{metrics?.cache?.status || 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Fila de Operações</CardTitle>
              <CardValue>{metrics?.cache?.queueLength ?? 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Locks Síncronos</CardTitle>
              <CardValue>{metrics?.cache?.syncLocks ?? 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Uso de Memória (MB)</CardTitle>
              <CardValue>{typeof metrics?.system?.memory?.heapUsed === 'number' ? (metrics.system.memory.heapUsed / 1024 / 1024).toFixed(2) : 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Uptime</CardTitle>
              <CardValue>{typeof metrics?.system?.uptime === 'number' ? `${(metrics.system.uptime / 60).toFixed(1)} min` : 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Versão do Cache</CardTitle>
              <CardValue>{metrics?.cache?.cacheVersion || 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Redis Ativado</CardTitle>
              <CardValue>{metrics?.cache?.redisEnabled ? 'Sim' : 'Não'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Modo Redis Forçado</CardTitle>
              <CardValue>{metrics?.cache?.forceRedisMode ? 'Sim' : 'Não'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Limite de Memória</CardTitle>
              <CardValue>{metrics?.cache?.memoryThreshold ?? 'N/A'}</CardValue>
            </Card>
            <Card>
              <CardTitle>Status do Redis</CardTitle>
              <CardValue>{metrics?.cache?.redisStatus || 'N/A'}</CardValue>
            </Card>
          </GridContainer>
        </Section>

        {/* Seção de Tendências em Tempo Real */}
        <Section>
          <SectionTitle>Tendências em Tempo Real (Últimos 30 Polls)</SectionTitle>
          <ChartGrid>
            <ChartContainer>
              <CardTitle>Hit Ratio do Cache</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="time" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} formatter={(value: number) => `${(value * 100).toFixed(1)}%`} />
                  <Line type="monotone" dataKey="hitRatio" stroke={COLOR_PRIMARY} strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <CardTitle>Fila de Operações</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="time" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                  <Bar dataKey="queueLength" fill={COLOR_SECONDARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <CardTitle>Locks Síncronos</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="time" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                  <Bar dataKey="syncLocks" fill={COLOR_PRIMARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartGrid>
        </Section>

        {/* Seção de Detalhes do Cache */}
        <Section>
          <SectionTitle>Detalhes do Cache</SectionTitle>
          <ChartGrid>
            <ChartContainer>
              <CardTitle>Operações de Cache</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cacheBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                  <Bar dataKey="value" fill={COLOR_PRIMARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <CardTitle>Estatísticas do Cache LRU</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={lruBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                  <Bar dataKey="value" fill={COLOR_SECONDARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <ChartContainer>
              <CardTitle>Estatísticas do Cache Redis</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={redisBarData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                  <Bar dataKey="value" fill={COLOR_PRIMARY} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartGrid>

          <GridContainer style={{ marginTop: '20px' }}>
            <MetricBox>
              <MetricLabel>Tamanho Básico do Cache</MetricLabel>
              <MetricValue>{metrics?.cache?.basicCacheSize ?? 'N/A'}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Tamanho Máx. do Cache Básico</MetricLabel>
              <MetricValue>{metrics?.cache?.maxBasicCacheSize ?? 'N/A'}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Operações Pendentes</MetricLabel>
              <MetricValue>{metrics?.cache?.pendingOperations ?? 'N/A'}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Processando Fila</MetricLabel>
              <MetricValue>{metrics?.cache?.isProcessingQueue ? 'Sim' : 'Não'}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Uso de Memória do Cache (MB)</MetricLabel>
              <MetricValue>{typeof metrics?.cache?.memoryUsage === 'number' ? metrics.cache.memoryUsage.toFixed(2) : 'N/A'}</MetricValue>
            </MetricBox>
          </GridContainer>

          {metrics?.cache?.recommendation && (
            <RecommendationBox>
              <strong>Recomendação do Cache:</strong> {metrics.cache.recommendation}
            </RecommendationBox>
          )}

          {metrics?.cache?.lruStats && (
            <MetricBox style={{ marginTop: '20px', minWidth: 'unset', maxWidth: '100%' }}>
              <MetricLabel>Estatísticas Detalhadas do LRU</MetricLabel>
              <MetricValue style={{ fontSize: '16px', fontWeight: 'normal', lineHeight: '1.6' }}>
                {Object.entries(metrics.cache.lruStats).map(([key, val]) => (
                  <div key={key}><strong>{key}:</strong> {typeof val === 'object' ? JSON.stringify(val) : String(val)}</div>
                ))}
              </MetricValue>
            </MetricBox>
          )}
        </Section>

        {/* Seção de Segurança */}
        <Section>
          <SectionTitle>Segurança</SectionTitle>
          <ChartGrid>
            <ChartContainer>
              <CardTitle>Visão Geral de Requisições de Segurança</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={securityOverviewData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={{ stroke: "#e3e5e8" }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                  <Bar dataKey="value" fill="#e62424" radius={[4, 4, 0, 0]} /> {/* Cor para segurança */}
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {threatsPieData && threatsPieData.length > 0 && (
              <ChartContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardTitle>Ameaças por Tipo</CardTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={threatsPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                    >
                      {threatsPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </ChartGrid>

          <MetricBox style={{ marginTop: '20px', minWidth: 'unset', maxWidth: '300px' }}>
            <MetricLabel>Tempo de Resposta de Segurança</MetricLabel>
            <MetricValue>{metrics?.security?.responseTime ?? 'N/A'} ms</MetricValue>
          </MetricBox>
        </Section>

        {/* Seção de Performance */}
        <Section>
          <SectionTitle>Performance</SectionTitle>
          <GridContainer>
            <MetricBox>
              <MetricLabel>Status da Performance</MetricLabel>
              <MetricValue>{perfStatus}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Performance Geral</MetricLabel>
              <MetricValue>{perfOverall}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Worker Pool</MetricLabel>
              <MetricValue>{perfWorkerPool}</MetricValue>
            </MetricBox>
            <MetricBox>
              <MetricLabel>Total de Consultas</MetricLabel>
              <MetricValue>{perfQueries.totalQueries ?? 'N/A'}</MetricValue>
            </MetricBox>
          </GridContainer>

          {perfRecommendations.length > 0 && (
            <RecommendationBox>
              <strong>Recomendações de Performance:</strong>
              <ul>
                {perfRecommendations.map((rec: string, i: number) => <li key={i}>{rec}</li>)}
              </ul>
            </RecommendationBox>
          )}
        </Section>

        {/* Seção de Sistema */}
        <Section>
          <SectionTitle>Sistema</SectionTitle>
          <GridContainer>
            <MetricBox>
              <MetricLabel>Uptime do Sistema</MetricLabel>
              <MetricValue>{sysUptime ? `${(sysUptime / 3600).toFixed(2)} horas` : 'N/A'}</MetricValue>
            </MetricBox>

            {sysMemPie && sysMemPie.length > 0 && (
              <ChartContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardTitle>Uso de Memória do Sistema (Bytes)</CardTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sysMemPie}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      labelLine={false}
                    >
                      {sysMemPie.map((entry, index) => (
                        <Cell key={`cell-mem-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ececec', borderRadius: '5px', color: '#111', fontSize: 13 }} formatter={(value: number) => `${(value / 1024 / 1024).toFixed(2)} MB`} />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </GridContainer>
        </Section>

        {/* Seção de Alertas Recentes */}
        <Section>
          <SectionTitle>Alertas Recentes</SectionTitle>
          <AlertList>
            {alerts.length === 0 && <li>Nenhum alerta crítico no momento.</li>}
            {alerts.map((a, i) => <li key={i}>{a}</li>)}
          </AlertList>
        </Section>

      </Content>
    </Main>
  );
}




const Main = styled.main`
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
 
  min-height: 100vh;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1300px; 
  padding: 0 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 24px;
  color: #111;
  font-weight: 700;
  letter-spacing: -0.8px;
  line-height: 1.2;
  text-align: left;
`;

const Section = styled.section`
  background: #ffffff;
  border-radius: 12px; /* Cantos mais arredondados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Sombra mais suave */
  padding: 24px;
  margin-bottom: 32px;
  border: 1px solid #e3e5e8; /* Borda sutil */
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  color: #111;
  font-weight: 600;
  letter-spacing: -0.3px;
  border-bottom: 1px solid #f0f0f0; 
  padding-bottom: 15px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));  
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  border-radius: 10px;
  padding: 11px 22px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1px solid #e3e5e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);  
`;

const CardTitle = styled.div`
  font-size: 14px;
  color: #666;
 
  font-weight: 500;
  letter-spacing: 0.01em;
`;

const CardValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.8px;
`;

const ChartContainer = styled.div`
  background-color: #fcfdfe; /* Fundo claro para gráficos */
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ececec;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); /* Grid para múltiplos gráficos */
  gap: 20px;
`;

const AlertList = styled.ul`
  background: #fffbe7; /* Fundo amarelo claro para alertas */
  border-radius: 10px;
  padding: 15px 25px;
  list-style: disc; /* Usar marcadores de lista */
  color: #b45309; /* Cor de texto para alertas */
  border: 1px solid #f5e7c3;
  font-size: 15px;
  box-shadow: 0 1px 4px #f5e7c033;
  li {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const RecommendationBox = styled.div`
  background: #e6f7ed; /* Fundo verde claro para recomendações */
  border-radius: 8px;
  padding: 15px 20px;
  color: #1a7f37; /* Cor de texto para recomendações */
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #b7e4c7;
  margin-top: 15px;
  line-height: 1.5;
`;

const ProgressCircleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 20px;
  background: #fcfdfe;
  border-radius: 12px;
  border: 1px solid #e3e5e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const MetricBox = styled.div`
  background: #f3f3f3; /* Fundo para métricas individuais */
  border-radius: 8px;
  padding: 15px 20px;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ececec;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const MetricValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;
