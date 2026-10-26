const withAlpha50 = (hex: string): string => hex.slice(0, 7) + '80';
const withAlpha0 = (hex: string): string => hex.slice(0, 7) + '30';

// Extrai cor com fallback para sólido
const extractColorFromTheme = (
  theme: string,
  fallback: string,
  alphaFn: (hex: string) => string
): string => {
  if (!theme || !theme.includes('linear-gradient')) return fallback;

  const gradients = theme.split(/,(?=\s*linear-gradient)/);
  const firstMatch = gradients[0].match(/#([a-fA-F0-9]{6,8})/g);
  const firstColor = firstMatch?.[0]?.toLowerCase();

  if (firstColor === '#12131240') {
    const secondGradient = gradients[1];
    const secondMatch = secondGradient?.match(/#([a-fA-F0-9]{6,8})/g);
    const fallbackColor = secondMatch?.[0] ?? '#289c66';
    return alphaFn(fallbackColor);
  }

  return alphaFn(firstColor ?? '#289c66');
};

// Cor padrão para sólidos
const solidFallback = '#4c504e80';

export const getBorderColorFromTheme = (theme: string): string =>
  extractColorFromTheme(theme, solidFallback, withAlpha50);

export const getBorderColorFromThemex = (theme: string): string =>
  extractColorFromTheme(theme, solidFallback, withAlpha0);


const extractIfDarkBackground = (
  theme: string,
  fallback: string,
  alphaFn: (hex: string) => string
): string => {
  if (!theme || !theme.includes('linear-gradient')) return fallback;

  // Verifica se algum gradiente tem exatamente #0e0e11
  const gradients = theme.split(/,(?=\s*linear-gradient)/);
  const containsDark = gradients.some(g => g.toLowerCase().includes('#0e0e11'));

  if (!containsDark) return fallback;

  // Extrai #0e0e11 do último gradiente ou retorna fallback se não encontrar
  const lastGradient = gradients[gradients.length - 1];
  const match = lastGradient.match(/#0e0e11/i);
  const color = match?.[0] ?? fallback;

  return alphaFn(color.toLowerCase());
};

// Exportações específicas
export const getDarkThemeColor = (theme: string): string =>
  extractIfDarkBackground(theme, theme, withAlpha50);

 