import styled from "styled-components"

export const CoreIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48">
      <rect width="48" height="48" fill="#d8dde2" rx="24"></rect>
      <path
        fill="#0E0E11"
        d="m28.954 21.189-4.784-7.03a.2.2 0 0 0-.17-.09.2.2 0 0 0-.169.09l-4.784 7.03a.103.103 0 0 1-.13.035l-7.447-3.715a.2.2 0 0 0-.211.017.21.21 0 0 0-.085.197l1.614 14.02c.119 1.212 5.093 2.188 11.211 2.188s11.093-.976 11.212-2.188l1.615-14.02a.21.21 0 0 0-.084-.196.2.2 0 0 0-.21-.018l-7.448 3.71a.1.1 0 0 1-.13-.03"
      ></path>
    </svg>
  </IconWrapper>
)

export const ProIcon = () => (
  <IconWrapper>
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48">
      <rect width="48" height="48" fill="#2fec94" rx="24"></rect>
      <path
        fill="#0E0E11"
        d="m28.954 21.189-4.784-7.03a.2.2 0 0 0-.17-.09.2.2 0 0 0-.169.09l-4.784 7.03a.103.103 0 0 1-.13.035l-7.447-3.715a.2.2 0 0 0-.211.017.21.21 0 0 0-.085.197l1.614 14.02c.119 1.212 5.093 2.188 11.211 2.188s11.093-.976 11.212-2.188l1.615-14.02a.21.21 0 0 0-.084-.196.2.2 0 0 0-.21-.018l-7.448 3.71a.1.1 0 0 1-.13-.03"
      ></path>
    </svg>
  </IconWrapper>
)

const IconWrapper = styled.span`
  display: inline-flex;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`
