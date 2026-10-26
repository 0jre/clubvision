"use client";
import React from "react";
import styled from "styled-components";

const NavigationMenu: React.FC = () => {
  return (
    <NavContainer>
      <NavItem>
        <NavItemIcon>
          <NavIconCircle />
        </NavItemIcon>
        <NavItemText>Daily Races</NavItemText>
        <NavItemTimer>
          <TimerContainer>
            <TimerDigit>22</TimerDigit>
            <TimerSeparator>:</TimerSeparator>
            <TimerDigit>52</TimerDigit>
            <TimerSeparator>:</TimerSeparator>
            <TimerDigit>10</TimerDigit>
          </TimerContainer>
        </NavItemTimer>
      </NavItem>
      <NavItem>
        <NavItemIcon>
          <NavIcon
            src="https://cdn.builder.io/api/v1/image/assets/d8215076d0614637a4072bab3cbf005c/8373cdc646a4f3537c72552f5a2bf91ac9abe6280af6a0dbf6f71c3d510792e6?placeholderIfAbsent=true"
            alt="Daily Case Icon"
          />
        </NavItemIcon>
        <NavItemText>Daily Case</NavItemText>
      </NavItem>
      <NavItem>
        <NavItemIcon>
          <NavIcon
            src="https://cdn.builder.io/api/v1/image/assets/d8215076d0614637a4072bab3cbf005c/5864d99231ec6a0a6439d7640eb178b184382ea3472c89189d8a2cddf997915e?placeholderIfAbsent=true"
            alt="Giveaways Icon"
          />
        </NavItemIcon>
        <NavItemText>Giveaways</NavItemText>
      </NavItem>
      <NavItem>
        <NavItemIcon>
          <NavIcon
            src="https://cdn.builder.io/api/v1/image/assets/d8215076d0614637a4072bab3cbf005c/76b87850a98e4798f90066dee21de70fa3e2713eb0b41a46091767cf5f1dda86?placeholderIfAbsent=true"
            alt="Skins Rush Icon"
          />
        </NavItemIcon>
        <NavItemText>Skins Rush</NavItemText>
      </NavItem>
      <NavItem>
        <NavItemIcon>
          <NavIcon
            src="https://cdn.builder.io/api/v1/image/assets/d8215076d0614637a4072bab3cbf005c/b34a014c95d78944435107d1493491c3e9b83192bf4dd7a6665c81442794ea18?placeholderIfAbsent=true"
            alt="Skin Changer Icon"
          />
        </NavItemIcon>
        <NavItemText>Skin Changer</NavItemText>
      </NavItem>
      <NavItem>
        <NavItemIcon>
          <NavIcon
            src="https://cdn.builder.io/api/v1/image/assets/d8215076d0614637a4072bab3cbf005c/d84e2185c78570e79741112cfb79ed063617d32bc592a3e56c0ec8fb4d3d3455?placeholderIfAbsent=true"
            alt="Upgrader Icon"
          />
        </NavItemIcon>
        <NavItemText>Upgrader</NavItemText>
      </NavItem>
      <NavItem>
        <NavItemIcon>
          <NavIcon
            src="https://cdn.builder.io/api/v1/image/assets/d8215076d0614637a4072bab3cbf005c/7aa810f8bd742f025b21cc3549eb2d834510d3c9c3d38cce2cb70deebcf56aa8?placeholderIfAbsent=true"
            alt="Case Battle Icon"
          />
        </NavItemIcon>
        <NavItemTextHighlighted>Case Battle</NavItemTextHighlighted>
      </NavItem>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  align-self: stretch;
  display: flex;
  min-width: 240px;
  margin-top: auto;
  margin-bottom: auto;
  min-height: 70px;
  align-items: center;
  gap: 22px;
  justify-content: start;
  flex-wrap: wrap;
  @media (max-width: 991px) {
    max-width: 100%;
  }
`;

const NavItem = styled.div`
  align-self: stretch;
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  min-height: 70px;
  padding-top: 26px;
  padding-bottom: 26px;
  align-items: center;
  justify-content: start;
  padding-left: 2px;
`;

const NavItemIcon = styled.div`
  border-radius: 4px;
  align-self: stretch;
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  padding: 1px 2px 1px 1px;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 16px;
`;

const NavIconCircle = styled.div`
  display: flex;
  min-height: 13px;
  width: 13px;
`;

const NavIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 16px;
`;

const NavItemText = styled.span`
  line-height: 18px;
  align-self: stretch;
  margin-top: auto;
  margin-bottom: auto;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 12px;
  color: #b6bbce;
  font-weight: 600;
  margin-left: 8px;
  white-space: nowrap;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const NavItemTextHighlighted = styled(NavItemText)`
  color: #ffcb77;
`;

const NavItemTimer = styled.div`
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  background-color: #b6bbce;
  align-self: stretch;
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  min-height: 18px;
  padding: 4px;
  font-family:
    Poppins,
    -apple-system,
    Roboto,
    Helvetica,
    sans-serif;
  font-size: 10px;
  color: #0d0d0f;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1;
  margin-left: 8px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const TimerContainer = styled.div`
  align-self: stretch;
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  align-items: stretch;
  justify-content: start;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const TimerDigit = styled.span`
  border-radius: 6px;
  padding-right: 1px;
  text-align: center;
  width: 14px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

const TimerSeparator = styled.span`
  @media (max-width: 991px) {
    white-space: initial;
  }
`;

export default NavigationMenu;
