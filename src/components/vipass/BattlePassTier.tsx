"use client"
import styled from "styled-components"
import { Gift, Lock, Check, Crown } from "lucide-react"

interface BattlePassTierProps {
  tier: number
  xpRequired: number
  freeReward?: any
  premiumReward?: any
  isUnlocked: boolean
  isClaimed: boolean
  isPremiumClaimed: boolean
  isPremium: boolean
  onClaimReward: (tier: number, isPremium: boolean) => void
}

export default function BattlePassTier({
  tier,
  xpRequired,
  freeReward,
  premiumReward,
  isUnlocked,
  isClaimed,
  isPremiumClaimed,
  isPremium,
  onClaimReward,
}: BattlePassTierProps) {
  const formatReward = (reward: any) => {
    if (!reward) return null

    const icons = {
      bits: "💎",
      coins: "🪙",
      tokens: "🎫",
      item: "📦",
      badge: "🏆",
    }

    return {
      icon: icons[reward.type as keyof typeof icons] || "🎁",
      text: reward.amount ? `${reward.amount} ${reward.type}` : reward.type,
      rarity: reward.rarity,
    }
  }

  const freeRewardFormatted = formatReward(freeReward)
  const premiumRewardFormatted = formatReward(premiumReward)

  return (
    <TierContainer>
      <TierNumber>{tier}</TierNumber>
      <XPRequirement>{xpRequired.toLocaleString()} XP</XPRequirement>

      <RewardsContainer>
        {/* Free Reward */}
        <RewardSlot type="free" rarity={freeReward?.rarity}>
          {freeRewardFormatted ? (
            <>
              <RewardIcon>{freeRewardFormatted.icon}</RewardIcon>
              <RewardText>{freeRewardFormatted.text}</RewardText>
              {isUnlocked && !isClaimed && (
                <ClaimButton onClick={() => onClaimReward(tier, false)} disabled={isClaimed}>
                  <Gift size={16} />
                </ClaimButton>
              )}
              {isClaimed && (
                <ClaimedIcon>
                  <Check size={16} />
                </ClaimedIcon>
              )}
              {!isUnlocked && (
                <LockedIcon>
                  <Lock size={16} />
                </LockedIcon>
              )}
            </>
          ) : (
            <EmptySlot>-</EmptySlot>
          )}
        </RewardSlot>

        {/* Premium Reward */}
        <RewardSlot type="premium" rarity={premiumReward?.rarity}>
          <PremiumBadge>
            <Crown size={12} />
          </PremiumBadge>
          {premiumRewardFormatted ? (
            <>
              <RewardIcon>{premiumRewardFormatted.icon}</RewardIcon>
              <RewardText>{premiumRewardFormatted.text}</RewardText>
              {isUnlocked && isPremium && !isPremiumClaimed && (
                <ClaimButton onClick={() => onClaimReward(tier, true)} disabled={isPremiumClaimed} premium>
                  <Gift size={16} />
                </ClaimButton>
              )}
              {isPremiumClaimed && (
                <ClaimedIcon>
                  <Check size={16} />
                </ClaimedIcon>
              )}
              {(!isUnlocked || !isPremium) && (
                <LockedIcon>
                  <Lock size={16} />
                </LockedIcon>
              )}
            </>
          ) : (
            <EmptySlot>-</EmptySlot>
          )}
        </RewardSlot>
      </RewardsContainer>
    </TierContainer>
  )
}

const TierContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(35, 35, 45, 0.8);
  border-radius: 12px;
  border: 1px solid #2E3244;
  min-width: 120px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
  }
`

const TierNumber = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 8px;
`

const XPRequirement = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
`

const RewardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

const RewardSlot = styled.div<{ type: "free" | "premium"; rarity?: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: ${(props) =>
    props.type === "premium" ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" : "rgba(16, 185, 129, 0.1)"};
  border: 2px solid ${(props) => {
    if (props.rarity === "legendary") return "#f59e0b"
    if (props.rarity === "epic") return "#8b5cf6"
    if (props.rarity === "rare") return "#3b82f6"
    return props.type === "premium" ? "#f59e0b" : "#10b981"
  }};
  min-height: 80px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`

const PremiumBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f59e0b;
  border-radius: 50%;
  padding: 4px;
  color: white;
`

const RewardIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`

const RewardText = styled.div`
  font-size: 10px;
  text-align: center;
  color: white;
  font-weight: 600;
`

const ClaimButton = styled.button<{ premium?: boolean }>`
  position: absolute;
  top: -8px;
  left: -8px;
  background: ${(props) => (props.premium ? "#f59e0b" : "#10b981")};
  border: none;
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: pulse 2s infinite;

  &:hover {
    transform: scale(1.1);
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
`

const ClaimedIcon = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  background: #059669;
  border-radius: 50%;
  padding: 8px;
  color: white;
`

const LockedIcon = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  background: #6b7280;
  border-radius: 50%;
  padding: 8px;
  color: white;
`

const EmptySlot = styled.div`
  color: #6b7280;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
