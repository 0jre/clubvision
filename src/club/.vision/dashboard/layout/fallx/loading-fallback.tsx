import styled from "styled-components"

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: rgba(14, 14, 17, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 12px;
`

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default function LoadingFallback({ message = "Loading..." }: { message?: string }) {
  return (
    <LoadingContainer>
      <div className="flex flex-col items-center gap-3">
        <Spinner />
        <p className="text-sm text-white/80">{message}</p>
      </div>
    </LoadingContainer>
  )
}
