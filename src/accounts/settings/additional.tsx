"use client"

import { useState, useEffect } from "react"
import { SettingsModal, SettingsSection, SettingsItem, SettingsSwitch } from "./settings-modal"
import { useSettings } from "@/hooks/settings"

interface AdditionalSettingsProps {
  onClose: () => void
}

export function AdditionalSettings({ onClose }: AdditionalSettingsProps) {
  const { settings: apiSettings, updateSetting } = useSettings()
  const [settings, setSettings] = useState({
    accountAlerts: false,
    tradeAlerts: false,
    suspiciousInteractions: false,
    walletMovements: false,
    punishmentNotifications: false,
    permissionChanges: false,
  })

  useEffect(() => {
    if (apiSettings?.additional) {
      setSettings(apiSettings.additional)
    }
  }, [apiSettings])

  const handleSettingChange = (setting: keyof typeof settings) => async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: checked }))
    await updateSetting("additional", setting, checked)
  }

  return (
    <SettingsModal title="Adicional" onClose={onClose}>
      <SettingsSection title="Notificações">
        <SettingsItem label="Receber alertas de conta">
          <SettingsSwitch
            checked={settings.accountAlerts}
            onChange={handleSettingChange("accountAlerts")}
            id="account-alerts"
          />
        </SettingsItem>

        <SettingsItem label="Receber alertas de negociações">
          <SettingsSwitch
            checked={settings.tradeAlerts}
            onChange={handleSettingChange("tradeAlerts")}
            id="trade-alerts"
          />
        </SettingsItem>

        <SettingsItem label="Interações com contas club suspeitas">
          <SettingsSwitch
            checked={settings.suspiciousInteractions}
            onChange={handleSettingChange("suspiciousInteractions")}
            id="suspicious-interactions"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Segurança">
        <SettingsItem label="Movimentações em sua walletvision">
          <SettingsSwitch
            checked={settings.walletMovements}
            onChange={handleSettingChange("walletMovements")}
            id="wallet-movements"
          />
        </SettingsItem>

        <SettingsItem label="Notificar quando receber punições">
          <SettingsSwitch
            checked={settings.punishmentNotifications}
            onChange={handleSettingChange("punishmentNotifications")}
            id="punishment-notifications"
          />
        </SettingsItem>

        <SettingsItem label="Notificar mudanças de permissões em minha conta">
          <SettingsSwitch
            checked={settings.permissionChanges}
            onChange={handleSettingChange("permissionChanges")}
            id="permission-changes"
          />
        </SettingsItem>
      </SettingsSection>
    </SettingsModal>
  )
}
