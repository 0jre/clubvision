import { useState, useEffect, type ComponentType, memo, useMemo } from "react"
import { componentCache } from "./performance-turbo"

type TurboLoaderProps<P> = {
  importFn: () => Promise<{ default: ComponentType<P> }>
  props: P
  cacheKey?: string
  priority?: "high" | "low"
  fallback?: React.ReactNode
}

/**
 * ComponentLoaderTurbo - Carregador de componentes ultra-otimizado
 * - Cache de componentes
 * - Priorização de carregamento
 * - Memoização automática
 * - Prefetch inteligente
 */
function ComponentLoaderTurboBase<P>({
  importFn,
  props,
  cacheKey,
  priority = "low",
  fallback = <div className="skeleton-loader" style={{ minHeight: "100px" }} />,
}: TurboLoaderProps<P>) {
  const [Component, setComponent] = useState<React.ComponentType<P> | React.MemoExoticComponent<ComponentType<P>> | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const key = cacheKey || importFn.toString()

  // Usar cache se disponível
  useEffect(() => {
    if (componentCache.has(key)) {
      setComponent(componentCache.get(key) as React.ComponentType<P> | React.MemoExoticComponent<ComponentType<P>>)
      return
    }

    let isMounted = true
    let loadStartTime = performance.now()

    // Adiciona prioridade ao carregamento
    if (priority === "high" && "fetchPriority" in HTMLImageElement.prototype) {
      // Técnica avançada: usar link preload para aumentar prioridade
      const preloadLink = document.createElement("link")
      preloadLink.rel = "preload"
      preloadLink.as = "script"
      preloadLink.href = key
      document.head.appendChild(preloadLink)
    }

    importFn()
      .then((module) => {
        if (!isMounted) return

        const loadTime = performance.now() - loadStartTime
        console.log(`Component loaded in ${loadTime.toFixed(2)}ms: ${key}`)

        // Memoize o componente automaticamente
        const MemoizedComponent = memo(module.default)
        
        // Armazena no cache
        componentCache.set(key, MemoizedComponent)
        setComponent(MemoizedComponent)
      })
      .catch((err) => {
        if (isMounted) {
          console.error(`Failed to load component: ${key}`, err)
          setError(err)
        }
      })

    return () => {
      isMounted = false
    }
  }, [importFn, key, priority])

  // Memoize a renderização do componente para evitar re-renders
  const MemoizedComponent = useMemo(() => {
    if (error) {
      return <div className="error-boundary">Erro ao carregar componente</div>
    }
    if (!Component) return fallback || null;
    return <Component {...(props as any)} />;
  }, [Component, props, error, fallback]);

  return MemoizedComponent
}

// Exporta uma versão memoizada do loader para evitar re-renders desnecessários
export const ComponentLoaderTurbo = memo(ComponentLoaderTurboBase) as typeof ComponentLoaderTurboBase
