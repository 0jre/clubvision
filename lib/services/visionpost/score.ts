import { calculateSimilarityScore } from "./similarity";

// Função para calcular a pontuação de relevância dos posts
export async function calculatePostScores(posts: any[], db: any) {
    const scoredPosts = await Promise.all(posts.map(async post => {
      const engagementScore = post.likes * 0.5 + post.views * 0.3; // Exemplo de cálculo
      const similarityScore = await calculateSimilarityScore(post); // Pontuação de similaridade
      return {
        ...post,
        score: engagementScore + similarityScore // Pontuação final
      };
    }));
  
    return scoredPosts.sort((a, b) => b.score - a.score); // Ordenar por pontuação
  }
  