"use client"

import { useState, useEffect } from "react"
import { SettingsModal, SettingsSection, SettingsItem, SettingsSwitch } from "./settings-modal"
import { useSettings } from "@/hooks/settings"

interface ClubSettingsProps {
  onClose: () => void
}

export function ClubSettings({ onClose }: ClubSettingsProps) {
  const { settings: apiSettings, updateSetting } = useSettings()
  const [settings, setSettings] = useState({
    publicProfile: false,
    friendsOfFriends: false,
    allowFollowers: false,
    comments: false,
    hideProblematicUsers: false,
    trendingPosts: false,
    communityRecommendations: false,
    featuredContent: false,
    havocModeration: false,
  })

  useEffect(() => {
    if (apiSettings?.club) {
      setSettings(apiSettings.club)
    }
  }, [apiSettings])

  const handleSettingChange = (setting: keyof typeof settings) => async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: checked }))
    await updateSetting("club", setting, checked)
  }

  return (
    <SettingsModal title="Clubvision" onClose={onClose}>
      <SettingsSection title="Perfil Club">
        <SettingsItem label="Tornar meu perfil club publico">
          <SettingsSwitch
            checked={settings.publicProfile}
            onChange={handleSettingChange("publicProfile")}
            id="public-profile"
          />
        </SettingsItem>

        <SettingsItem
          label="Permitir que apenas amigos de amigos me sigam"
          description="Permite que apenas amigos de seus amigos te sigam para verem posts do seu perfil em seus feeds principais"
        >
          <SettingsSwitch
            checked={settings.friendsOfFriends}
            onChange={handleSettingChange("friendsOfFriends")}
            id="friends-of-friends"
          />
        </SettingsItem>

        <SettingsItem
          label="Permitir que outras pessoas me sigam"
          description="Permite que as pessoas te sigam para verem posts do seu perfil em seus feeds principais"
        >
          <SettingsSwitch
            checked={settings.allowFollowers}
            onChange={handleSettingChange("allowFollowers")}
            id="allow-followers"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Atividade">
        <SettingsItem label="Comentarios no seus posts">
          <SettingsSwitch checked={settings.comments} onChange={handleSettingChange("comments")} id="comments" />
        </SettingsItem>

        <SettingsItem label="Ocultar meus posts para membros com problemas com conteúdo e mensagem removidos">
          <SettingsSwitch
            checked={settings.hideProblematicUsers}
            onChange={handleSettingChange("hideProblematicUsers")}
            id="hide-problematic-users"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Recomendações">
        <SettingsItem label="Posts em Alta">
          <SettingsSwitch
            checked={settings.trendingPosts}
            onChange={handleSettingChange("trendingPosts")}
            id="trending-posts"
          />
        </SettingsItem>

        <SettingsItem label="Recomendações de comunidade">
          <SettingsSwitch
            checked={settings.communityRecommendations}
            onChange={handleSettingChange("communityRecommendations")}
            id="community-recommendations"
          />
        </SettingsItem>

        <SettingsItem label="Conteudo em destaque">
          <SettingsSwitch
            checked={settings.featuredContent}
            onChange={handleSettingChange("featuredContent")}
            id="featured-content"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Moderação">
        <SettingsItem label="Moderação Havoc">
          <SettingsSwitch
            checked={settings.havocModeration}
            onChange={handleSettingChange("havocModeration")}
            id="havoc-moderation"
          />
        </SettingsItem>
      </SettingsSection>
    </SettingsModal>
  )
}
