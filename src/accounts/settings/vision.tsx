"use client"

import { useState, useEffect } from "react"
import { SettingsModal, SettingsSection, SettingsItem, SettingsSwitch } from "./settings-modal"
import { useSettings } from "@/hooks/settings"

interface VisionSettingsProps {
  onClose: () => void
}

export function VisionSettings({ onClose }: VisionSettingsProps) {
  const { settings: apiSettings, updateSetting } = useSettings()
  const [settings, setSettings] = useState({
    shareProfile: false,
    shareVHash: false,
    shareTokens: false,
    shareSubscription: false,
    unlinkInvites: false,
    isecurityInGame: false,
    tradeAlerts: false,
  })

  useEffect(() => {
    if (apiSettings?.vision) {
      setSettings(apiSettings.vision)
    }
  }, [apiSettings])

  const handleSettingChange = (setting: keyof typeof settings) => async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: checked }))
    await updateSetting("vision", setting, checked)
  }

  return (
    <SettingsModal title="Thenovision" onClose={onClose}>
      <SettingsSection title="Meu Perfil">
        <SettingsItem label="Compartilhar meu perfil">
          <SettingsSwitch
            checked={settings.shareProfile}
            onChange={handleSettingChange("shareProfile")}
            id="share-profile"
          />
        </SettingsItem>

        <SettingsItem label="Compartilhar meu V-hash">
          <SettingsSwitch checked={settings.shareVHash} onChange={handleSettingChange("shareVHash")} id="share-vhash" />
        </SettingsItem>

        <SettingsItem label="Compartilhar meus Tokens Virtual">
          <SettingsSwitch
            checked={settings.shareTokens}
            onChange={handleSettingChange("shareTokens")}
            id="share-tokens"
          />
        </SettingsItem>

        <SettingsItem label="Compartilhar minha assinatura de conta">
          <SettingsSwitch
            checked={settings.shareSubscription}
            onChange={handleSettingChange("shareSubscription")}
            id="share-subscription"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Segurança">
        <SettingsItem
          label="Desvincular convites"
          description="Desvincule de seus amigos com status de conta critico. O convite de ser membro clubvision."
        >
          <SettingsSwitch
            checked={settings.unlinkInvites}
            onChange={handleSettingChange("unlinkInvites")}
            id="unlink-invites"
          />
        </SettingsItem>

        <SettingsItem
          label="Isecurity In-game"
          description="Acionar o Isecurity para todas as transações que ocorrem em in-game."
        >
          <SettingsSwitch
            checked={settings.isecurityInGame}
            onChange={handleSettingChange("isecurityInGame")}
            id="isecurity-ingame"
          />
        </SettingsItem>

        <SettingsItem
          label="Acionar o alerta de negociações"
          description="Para todas as negociações necessario que ambos como negociador e cliente passam a analisar seus status de conta."
        >
          <SettingsSwitch
            checked={settings.tradeAlerts}
            onChange={handleSettingChange("tradeAlerts")}
            id="trade-alerts"
          />
        </SettingsItem>
      </SettingsSection>
    </SettingsModal>
  )
}
