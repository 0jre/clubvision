import useSWR, { mutate } from "swr"
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export interface Settings {
  wallet: {
    privacyMode: boolean
    isecurity: boolean
    blockSuspicious: boolean
    transferReturn: boolean
    stakingVision: boolean
    univisionX: boolean
    univisionValidator: boolean
    notifications: boolean
  }
  vision: {
    shareProfile: boolean
    shareVHash: boolean
    shareTokens: boolean
    shareSubscription: boolean
    unlinkInvites: boolean
    isecurityInGame: boolean
    tradeAlerts: boolean
  }
  club: {
    publicProfile: boolean
    friendsOfFriends: boolean
    allowFollowers: boolean
    comments: boolean
    hideProblematicUsers: boolean
    trendingPosts: boolean
    communityRecommendations: boolean
    featuredContent: boolean
    havocModeration: boolean
  }
  additional: {
    accountAlerts: boolean
    tradeAlerts: boolean
    suspiciousInteractions: boolean
    walletMovements: boolean
    punishmentNotifications: boolean
    permissionChanges: boolean
  }
}

export const defaultSettings: Settings = {
  wallet: {
    privacyMode: false,
    isecurity: false,
    blockSuspicious: false,
    transferReturn: false,
    stakingVision: false,
    univisionX: false,
    univisionValidator: false,
    notifications: false,
  },
  vision: {
    shareProfile: false,
    shareVHash: false,
    shareTokens: false,
    shareSubscription: false,
    unlinkInvites: false,
    isecurityInGame: false,
    tradeAlerts: false,
  },
  club: {
    publicProfile: false,
    friendsOfFriends: false,
    allowFollowers: false,
    comments: false,
    hideProblematicUsers: false,
    trendingPosts: false,
    communityRecommendations: false,
    featuredContent: false,
    havocModeration: false,
  },
  additional: {
    accountAlerts: false,
    tradeAlerts: false,
    suspiciousInteractions: false,
    walletMovements: false,
    punishmentNotifications: false,
    permissionChanges: false,
  },
}

export function useSettings() {
  const { data, error, isLoading } = useSWR("/api/settings", fetcher, {
    fallbackData: { success: true, settings: defaultSettings },
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })
  
  const Data = data as any
  const settings = Data?.success ? Data.settings : defaultSettings

  const updateSetting = async (category: keyof Settings, settingKey: string, value: boolean) => {
    try {
      const optimisticSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          [settingKey]: value,
        },
      }

      mutate("/api/settings", { success: true, settings: optimisticSettings }, false)

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          settingKey,
          value,
        }),
      })

      const result = await response.json() as any

      if (result.success) {
        mutate("/api/settings")
        return { success: true }
      } else {
        mutate("/api/settings")
        return { success: false, message: result.message }
      }
    } catch (error) {
      mutate("/api/settings")
      return { success: false, message: "Erro ao atualizar configuração" }
    }
  }

  // Função para atualizar múltiplas configurações
  const bulkUpdateSettings = async (category: keyof Settings, newSettings: Record<string, boolean>) => {
    try {
      const optimisticSettings = {
        ...settings,
        [category]: {
          ...settings[category],
          ...newSettings,
        },
      }
      mutate("/api/settings", { success: true, settings: optimisticSettings }, false)

      const response = await fetch("/api/settings/bulk-update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          settings: newSettings,
        }),
      })

      const result = await response.json() as any

      if (result.success) {
        mutate("/api/settings")
        return { success: true }
      } else {
        mutate("/api/settings")
        return { success: false, message: result.message }
      }
    } catch (error) {
      mutate("/api/settings")
      return { success: false, message: "Erro ao atualizar configurações" }
    }
  }

  const resetSettings = async (category?: keyof Settings) => {
    try {
      const response = await fetch("/api/settings/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
        }),
      })

      const result = await response.json() as any

      if (result.success) {
        mutate("/api/settings")
        return { success: true }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      return { success: false, message: "Erro ao resetar configurações" }
    }
  }

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    bulkUpdateSettings,
    resetSettings,
  }
}


// export function useUserSession() {
//   const { data, error, isLoading } = useSWR("/api/autentic/searchuser", fetcher, {
//     revalidateOnFocus: false,
//   })

//   return {
//     user: data?.user,
//     isLoading,
//     error,
//   }
// }