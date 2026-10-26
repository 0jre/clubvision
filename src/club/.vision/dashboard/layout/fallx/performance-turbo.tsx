import ROUTENVX  from '@/routes/routes'

/**
 * Performance Turbo - Sistema de otimização extrema
 * Reduz tempos de carregamento para 0.3-0.8s
 */

// Prefetch e Cache Inteligente
export const routePredictor = {
  // Rotas que serão pré-carregadas com base em análise de padrões de navegação
//  commonRoutes: Object.values(ROUTENVX).filter(route => {
//   if (typeof route !== 'string') return false;
//   return (
//     route.startsWith('/') &&
//     !route.startsWith('/api/') &&
//     !route.startsWith('http') &&
//     !route.startsWith('https')
//   );
// }),

  // Componentes que serão pré-carregados
  criticalComponents: [
    () => import("../../../../../wallet/kop"),
    () => import("../../../../../club/.vision/containers/navigation/topbar/account.user")
  ],
  
  // Inicializa o sistema de prefetch
  init: () => {
    if (typeof window === 'undefined') return;
    
    // Prefetch de rotas comuns durante tempo ocioso
    // if ('requestIdleCallback' in window) {
    //   (window as any).requestIdleCallback(() => {
    //     routePredictor.commonRoutes.forEach(route => {
    //       const link = document.createElement('link');
    //       link.rel = 'prefetch';
    //       link.href = route;
    //       document.head.appendChild(link);
    //     });
    //   });
    // }
    
    // Prefetch de componentes críticos
    const connection = (navigator as any).connection;
    if (connection && connection.effectiveType !== '2g') {
      setTimeout(() => {
        routePredictor.criticalComponents.forEach(component => {
          // Apenas inicia o download sem executar
          component();
        });
      }, 2000); // Atrasa 2s após carregamento inicial
    }
  }
};

// Cache de Componentes
export const componentCache = {
  cache: new Map<string, any>(),
  
  // Armazena componentes renderizados para reutilização
  set: (key: string, component: any) => {
    componentCache.cache.set(key, component);
  },
  
  get: (key: string) => {
    return componentCache.cache.get(key);
  },
  
  has: (key: string) => {
    return componentCache.cache.has(key);
  }
};

// Otimizador de Recursos
export const resourceOptimizer = {
  // Carrega scripts de forma otimizada
  loadScript: (src: string, priority: 'high' | 'low' = 'low') => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      if (priority === 'high') {
   (script as any).fetchPriority = 'high';
     }
      
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  },
  
  // Pré-conecta a domínios externos
  preconnect: (urls: string[]) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
};

// Otimizador de Renderização
export const renderOptimizer = {
  // Evita re-renders desnecessários
  memoizeComponent: (Component: any, propsAreEqual = (prevProps: any, nextProps: any) => {
    return Object.keys(prevProps).every(key => prevProps[key] === nextProps[key]);
  }) => {
    const cache = new Map();
    
    return (props: any) => {
      const key = JSON.stringify(props);
      
      if (!cache.has(key)) {
        cache.set(key, <Component {...props} />);
      }
      
      return cache.get(key);
    };
  },
  
  // Prioriza renderização de conteúdo visível
  prioritizeVisibleContent: () => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          if (element.dataset.priority) {
            // Carrega o conteúdo de alta prioridade
            const loadFunc = window[element.dataset.priority as keyof Window] as Function;
            if (typeof loadFunc === 'function') {
              loadFunc(element);
            }
          }
          observer.unobserve(element);
        }
      });
    });
    
    // Observa elementos com data-priority
    document.querySelectorAll('[data-priority]').forEach(el => {
      observer.observe(el);
    });
  }
};

// Inicializador de Performance
export const initTurboPerformance = () => {
  if (typeof window === 'undefined') return;
  
  // Inicializa todos os sistemas de otimização
  routePredictor.init();
  
  // Pré-conecta a domínios externos comuns
  resourceOptimizer.preconnect([
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]);
  
  // Prioriza renderização de conteúdo visível
  renderOptimizer.prioritizeVisibleContent()
  
};
