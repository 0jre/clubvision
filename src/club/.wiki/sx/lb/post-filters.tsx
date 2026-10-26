import { MDXFrontMatter } from './types';

// Utilitários para filtrar posts
export const filterPostsByCategory = (posts: Array<MDXFrontMatter>, category: string) => {
  // Primeiro filtra por posts que têm a tag 'Upgrades'
  let filteredPosts = posts.filter((post) => post.tags && post.tags.includes("Upgrades"))

  // Se não for "Tudo", filtra por categoria específica
  if (category !== "Tudo") {
    filteredPosts = filteredPosts.filter((post) => {
      return (
        post.category?.toLowerCase() === category.toLowerCase() ||
        (post.tags && post.tags.some((tag) => tag.toLowerCase() === category.toLowerCase()))
      )
    })
  }

  return filteredPosts
}

// Função para obter categorias disponíveis dos posts
export const getAvailableCategories = (posts: Array<MDXFrontMatter>) => {
  const upgradePosts = posts.filter((post) => post.tags && post.tags.includes("Upgrades"))

  const categories = new Set<string>()
  categories.add("Tudo")

  upgradePosts.forEach((post) => {
    if (post.category) {
      categories.add(post.category)
    }
    if (post.tags) {
      post.tags.forEach((tag) => {
        if (tag !== "Upgrades") {
          // Capitaliza a primeira letra para consistência
          const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
          categories.add(formattedTag)
        }
      })
    }
  })

  return Array.from(categories).sort((a, b) => {
    // "Tudo" sempre primeiro
    if (a === "Tudo") return -1
    if (b === "Tudo") return 1
    return a.localeCompare(b)
  })
}

// Função para obter estatísticas dos posts
export const getPostStats = (posts: Array<MDXFrontMatter>) => {
  const upgradePosts = posts.filter((post) => post.tags && post.tags.includes("Upgrades"))

  const categories = getAvailableCategories(posts)
  const byCategory: Record<string, number> = {}

  categories.forEach((category) => {
    byCategory[category] = filterPostsByCategory(posts, category).length
  })

  return {
    total: upgradePosts.length,
    byCategory,
    latestPost:
      upgradePosts.sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime())[0] || null,
  }
}

// Função para buscar posts por texto
export const searchPosts = (posts: Array<MDXFrontMatter>, searchTerm: string) => {
  const upgradePosts = posts.filter((post) => post.tags && post.tags.includes("Upgrades"))

  if (!searchTerm.trim()) return upgradePosts

  const term = searchTerm.toLowerCase()

  return upgradePosts.filter((post) => {
    return (
      post.title?.toLowerCase().includes(term) ||
      post.description?.toLowerCase().includes(term) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
      post.category?.toLowerCase().includes(term)
    )
  })
}

// Função para ordenar posts
export const sortPosts = (posts: Array<MDXFrontMatter>, sortBy: "date" | "title" | "category") => {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
      case "title":
        return (a.title || "").localeCompare(b.title || "")
      case "category":
        return (a.category || "").localeCompare(b.category || "")
      default:
        return 0
    }
  })
}
