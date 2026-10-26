"use client"

import { useState, useEffect } from "react"
import { SettingsModal, SettingsSection, SettingsItem, SettingsSwitch } from "./settings-modal"
import { useSettings } from "@/hooks/settings"
import Isecurity_wallet from "@/wallet/security/x/request"
import styled from "styled-components"
 
interface WalletSettingsProps {
  onClose: () => void
}

export function WalletSettings({ onClose }: WalletSettingsProps) {
  const { settings: apiSettings, updateSetting } = useSettings()
  const [settings, setSettings] = useState({
    privacyMode: false,
    isecurity: false,
    marketTVLs: false,
    blockSuspicious: false,
    transferReturn: false,
    stakingVision: false,
    univisionX: false,
    univisionValidator: false,
    notifications: false,
  })

  useEffect(() => {
    if (apiSettings?.wallet) {
      setSettings(apiSettings.wallet)
    }
  }, [apiSettings])

  const handleSettingChange = (setting: keyof typeof settings) => async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, [setting]: checked }))
    await updateSetting("wallet", setting, checked)
  }

  return (
     <SettingsModal title="Preferências" onClose={onClose}>
        <SettingsSection title="Configurações de Segurança da WalletVision">
          
 
            <MarginSelect> 
        <Isecurity_wallet active={true} classname="min-h-[30vh]">
          <SettingsItem label="Modo privacidade" description="Ocultar todos os saldos">
            <SettingsSwitch
              checked={settings.privacyMode}
              onChange={handleSettingChange("privacyMode")}
              id="privacy-mode"
            />
          </SettingsItem>

          <SettingsItem
            label="Ativação do Isecurity"
            description="O Isecurity será ativado em sua conta."
          >
            <SettingsSwitch checked={settings.isecurity} onChange={handleSettingChange("isecurity")} id="isecurity" />
          </SettingsItem>

          <SettingsItem
            label="Bloquear v-hash suspeitos"
            description="Tenha total segurança de suas moedas tanto em bits quanto em orbits."
          >
            <SettingsSwitch
              checked={settings.blockSuspicious}
              onChange={handleSettingChange("blockSuspicious")}
              id="block-suspicious"
            />
          </SettingsItem>

          <SettingsItem
            label="Conta Segura"
            description="Reforça a segurança da conta. Alguns acessos exigirão sua senha."
          >
            <SettingsSwitch
              checked={settings.transferReturn}
              onChange={handleSettingChange("transferReturn")}
              id="transfer-return"
            />
          </SettingsItem>
        </Isecurity_wallet>
        </MarginSelect>
      
        </SettingsSection>

        <SettingsSection title="Outras Configurações">
          <SettingsItem
            label="Staking vision"
            description="Mantenha funcionando o staking orbit enquanto você navega pelo clubvision."
          >
            <SettingsSwitch
              checked={settings.stakingVision}
              onChange={handleSettingChange("stakingVision")}
              id="staking-vision"
            />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Univision X">
          <SettingsItem
            label="UnivisionX"
            description="UnivisionX é um roteamento de dispersão. Quando ativado você permite que de 1 a 5% das taxas sejam entregues a membros qualificados."
          >
            <SettingsSwitch checked={settings.univisionX} onChange={handleSettingChange("univisionX")} id="univision-x" />
          </SettingsItem>

          <SettingsItem
            label="Univision X - Validator"
            description="Ao ativar, você se qualifica para receber entre 1% e 5% de orbs como recompensa pelo seu staking usando o validador UnivisionX."
          >
            <SettingsSwitch
              checked={settings.univisionValidator}
              onChange={handleSettingChange("univisionValidator")}
              id="univision-validator"
            />
          </SettingsItem>
        </SettingsSection>

        <SettingsSection title="Notificações">
          <SettingsItem
            label="Notificar"
            description="Receba notificações quando uma movimentação em sua wallet é reconhecida"
          >
            <SettingsSwitch
              checked={settings.notifications}
              onChange={handleSettingChange("notifications")}
              id="notifications"
            />
          </SettingsItem>
        </SettingsSection>
      </SettingsModal>

  )
}


const MarginSelect = styled.div`
  padding: 0.3em 0.5em;
  background: linear-gradient(204deg, #2a362a11 -7%, #b85cff00 33%), linear-gradient(162deg, #2e3d2e37 -10%, #2c88dd00 25%), linear-gradient(0deg, transparent, transparent);
  border: 2px solid rgb(41, 43, 42);
  border-radius: 12px;
 
`;