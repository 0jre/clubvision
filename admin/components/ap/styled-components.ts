"use client"

import styled from "styled-components"

// Container principal
export const FormContainer = styled.div`
  padding: 24px;
  background-color: #ffffff;
  min-height: 100%;
`

export const FormHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
`

export const FormContent = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

// Seção de busca
export const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SearchLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;

  i {
    color: #6b7280;
    font-size: 14px;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  transition: all 0.15s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

// Resultados da busca
export const SearchResults = styled.div`
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 8px;
  background: #f9fafb;
`

export const UserCard = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${(props) => (props.$selected ? "#f3f4f6" : "#ffffff")};
  border: 1px solid ${(props) => (props.$selected ? "#d1d5db" : "#e5e7eb")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => (props.$selected ? "#f3f4f6" : "#f9fafb")};
    border-color: #d1d5db;
  }
`

export const UserAvatar = styled.div`
  img {
    border-radius: 50%;
    border: 2px solid #e5e7eb;
  }
`

export const UserInfo = styled.div`
  flex: 1;
`

export const UserName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #374151;
`

export const UserDetails = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`

export const UserDetail = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;

  i {
    color: #9ca3af;
    font-size: 12px;
  }
`

export const SelectIndicator = styled.div<{ $selected: boolean }>`
  background: ${(props) => (props.$selected ? "#4f46e5" : "#f3f4f6")};
  color: ${(props) => (props.$selected ? "white" : "#6b7280")};
  padding: 8px;
  border-radius: 6px;
  transition: all 0.15s ease;

  i {
    font-size: 14px;
  }
`

// Estados de loading e vazio
export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #6b7280;

  p {
    margin: 8px 0 0 0;
    font-size: 14px;
  }
`

export const LoadingSpinner = styled.div<{ $small?: boolean }>`
  width: ${(props) => (props.$small ? "16px" : "24px")};
  height: ${(props) => (props.$small ? "16px" : "24px")};
  border: 2px solid #f3f4f6;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #9ca3af;
  text-align: center;

  i {
    font-size: 32px;
    margin-bottom: 8px;
    opacity: 0.5;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`

// Seções
export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #374151;

  i {
    color: #6b7280;
    font-size: 16px;
  }
`

// Opções e roles
export const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
`

export const OptionCard = styled.button<{ $selected: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${(props) => (props.$selected ? `${props.$color}10` : "#ffffff")};
  border: 1px solid ${(props) => (props.$selected ? `${props.$color}40` : "#e5e7eb")};
  border-radius: 8px;
  color: ${(props) => (props.$selected ? props.$color : "#6b7280")};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${(props) => `${props.$color}08`};
    border-color: ${(props) => `${props.$color}30`};
    color: ${(props) => props.$color};
  }
`

export const OptionIcon = styled.i`
  font-size: 18px;
`

export const OptionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
`

export const OptionCheck = styled.i`
  font-size: 14px;
  color: inherit;
`

// Categorias
export const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const CategoryTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

export const RoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
`

export const RoleChip = styled.button<{ $selected: boolean; $color: string; $removal?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${(props) => (props.$selected ? `${props.$color}10` : "#ffffff")};
  border: 1px solid ${(props) => (props.$selected ? `${props.$color}40` : "#e5e7eb")};
  border-radius: 6px;
  color: ${(props) => (props.$selected ? props.$color : "#6b7280")};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  &:hover {
    background: ${(props) => `${props.$color}08`};
    border-color: ${(props) => `${props.$color}30`};
    color: ${(props) => props.$color};
  }

  ${(props) =>
    props.$removal &&
    `
    opacity: 0.8;
  `}
`

export const RoleIcon = styled.i`
  font-size: 14px;
`

export const RoleLabel = styled.span`
  flex: 1;
  font-size: 13px;
  font-weight: 500;
`

export const RoleCheck = styled.i`
  font-size: 12px;
  color: inherit;
`

// Resumo da seleção
export const SelectionSummary = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
`

export const SummaryTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
  color: #374151;
`

export const SelectedRoles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const SelectedRole = styled.div<{ $removal: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: ${(props) => (props.$removal ? "#fef2f2" : "#f0f9ff")};
  border: 1px solid ${(props) => (props.$removal ? "#fecaca" : "#bae6fd")};
  border-radius: 4px;
  color: ${(props) => (props.$removal ? "#dc2626" : "#0369a1")};
  font-size: 12px;
  font-weight: 500;

  i {
    font-size: 12px;
  }
`

export const RemoveSelection = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  i {
    font-size: 10px;
  }
`

// Botão de submit
export const SubmitButton = styled.button<{ $variant: "primary" | "danger" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 24px;
  background: ${(props) => (props.$variant === "danger" ? "#dc2626" : "#4f46e5")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$variant === "danger" ? "#b91c1c" : "#4338ca")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  i {
    font-size: 14px;
  }
`
