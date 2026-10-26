"use client"

import type React from "react"
import styled, { keyframes } from "styled-components"
import { Check, X } from "lucide-react"
 
interface AnimatedSwitchProps {
    onChange: (checked: boolean) => void
    checked: boolean
    id?: string
  }

  
const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({ onChange, checked, id }) => {
  return (
    <SwitchContainer>
      <SwitchInput type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} id={id} />
      <Slider />
      <IconWrapper checked={checked}>{checked ? <Check /> : <X />}</IconWrapper>
    </SwitchContainer>
  )
}

export default AnimatedSwitch


const pullAnimation = keyframes`
  0% {
    transform: translateX(0) scale(1);
  }
  50% {
    transform: translateX(13px) scale(1.1);
  }
  100% {
    transform: translateX(26px) scale(1);
  }
`

const SwitchContainer = styled.label`
  display: inline-block;
  width: 60px;
  height: 34px;
  position: relative;
  cursor: pointer;
`

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: #287c4e;
  }

  &:focus + span {
    box-shadow: 0 0 1px #287c4e;
  }

  &:checked + span:before {
    animation: ${pullAnimation} 0.4s ease-out forwards;
  }
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #252527;
  transition: background-color 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: #ced6d5;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const IconWrapper = styled.div<{ checked: boolean }>`
  position: absolute;
  top: 50%;
  left: ${(props) => (props.checked ? "calc(100% - 30px)" : "4px")};
  transform: translateY(-50%);
  transition: left 0.4s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  opacity: ${(props) => (props.checked ? 1 : 0.5)};

  svg {
    width: 16px;
    height: 16px;
    color: ${(props) => (props.checked ? "#287c4e" : "#050505")};
  }
`

 