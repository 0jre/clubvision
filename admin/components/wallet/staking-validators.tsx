"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styled from "styled-components"
import useWalletAPIx from "@/admin/hooks/use-wallet-api"

const Container = styled.div`
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 24px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 16px;
`

const Title = styled.h2`
  color: #000;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`

const AddButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #333;
  }
`

const ValidatorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
`

const ValidatorCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  position: relative;
`

const ValidatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`

const ValidatorName = styled.h3`
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const ValidatorId = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`

const StatusBadge = styled.span<{ active: boolean }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => (props.active ? "#28a745" : "#dc3545")};
  color: white;
`

const ValidatorStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`

const StatItem = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`

const StatLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`

const PerformanceBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`

const PerformanceFill = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background: ${(props) => (props.percentage >= 80 ? "#28a745" : props.percentage >= 60 ? "#ffc107" : "#dc3545")};
  transition: width 0.3s ease;
`

const Modal = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 12px;
`

const ModalTitle = styled.h3`
  color: #000;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #000;
  }
`

const FormGroup = styled.div`
  margin-bottom: 16px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #000;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #000;
  }
`

const SubmitButton = styled.button`
  background: #000;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;

  &:hover {
    background: #333;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`

export function StakingValidators() {
  const { fetchStakingValidators, createValidator } = useWalletAPIx()
  const [validators, setValidators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    validatorId: "",
    name: "",
    performance: 0,
    rewardRate: 1,
    minStake: 10000,
    isActive: true,
  })

  useEffect(() => {
    loadValidators()
  }, [])

  const loadValidators = async () => {
    try {
      setLoading(true)
      const response = await fetchStakingValidators() as any
      setValidators(response.validators)
    } catch (error) {
      console.error("Error loading validators:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateValidator = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setCreating(true)
      await createValidator(formData)
      setShowModal(false)
      setFormData({
        validatorId: "",
        name: "",
        performance: 0,
        rewardRate: 1,
        minStake: 10000,
        isActive: true,
      })
      await loadValidators()
    } catch (error) {
      console.error("Error creating validator:", error)
    } finally {
      setCreating(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-BR").format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Carregando validadores...</LoadingSpinner>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <Title>Validadores de Staking</Title>
        <AddButton onClick={() => setShowModal(true)}>+ Novo Validador</AddButton>
      </Header>

      <ValidatorGrid>
        {validators.map((validator) => (
          <ValidatorCard key={validator.validatorId}>
            <ValidatorHeader>
              <div>
                <ValidatorName>{validator.name}</ValidatorName>
                <ValidatorId>ID: {validator.validatorId}</ValidatorId>
              </div>
              <StatusBadge active={validator.isActive}>{validator.isActive ? "Ativo" : "Inativo"}</StatusBadge>
            </ValidatorHeader>

            <div style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#666" }}>Performance</span>
                <span style={{ fontSize: "12px", fontWeight: "600" }}>{validator.performance}%</span>
              </div>
              <PerformanceBar>
                <PerformanceFill percentage={validator.performance} />
              </PerformanceBar>
            </div>

            <ValidatorStats>
              <StatItem>
                <StatValue>{formatCurrency(validator.totalDelegated)}</StatValue>
                <StatLabel>Total Delegado</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{formatNumber(validator.totalStakers)}</StatValue>
                <StatLabel>Stakers</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{validator.rewardRate}%</StatValue>
                <StatLabel>Taxa de Recompensa</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{formatNumber(validator.minStake)}</StatValue>
                <StatLabel>Stake Mínimo</StatLabel>
              </StatItem>
            </ValidatorStats>

            <div style={{ fontSize: "12px", color: "#666", textAlign: "center" }}>
              {validator.activeStaking} ativos • {validator.inactiveStaking} inativos
            </div>
          </ValidatorCard>
        ))}
      </ValidatorGrid>

      <Modal show={showModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Criar Novo Validador</ModalTitle>
            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
          </ModalHeader>

          <form onSubmit={handleCreateValidator}>
            <FormGroup>
              <Label>ID do Validador</Label>
              <Input
                type="text"
                value={formData.validatorId}
                onChange={(e) => setFormData((prev) => ({ ...prev, validatorId: e.target.value }))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Nome</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Performance (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.performance}
                onChange={(e) => setFormData((prev) => ({ ...prev, performance: Number(e.target.value) }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Taxa de Recompensa (%)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={formData.rewardRate}
                onChange={(e) => setFormData((prev) => ({ ...prev, rewardRate: Number(e.target.value) }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Stake Mínimo</Label>
              <Input
                type="number"
                min="0"
                value={formData.minStake}
                onChange={(e) => setFormData((prev) => ({ ...prev, minStake: Number(e.target.value) }))}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={creating}>
              {creating ? "Criando..." : "Criar Validador"}
            </SubmitButton>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  )
}
