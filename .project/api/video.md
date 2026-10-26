# API video/ — Upload e Streaming de Vídeos

## Visão Geral
O domínio `video` é responsável por:
- Gerenciar upload, streaming, manipulação e controle de vídeos dos usuários.
- Processar uploads, conversão, listagem e controle de acesso a vídeos.

### Principais Endpoints
- `videoX/`, `videos/`: Upload, listagem e manipulação de vídeos.

## Diagrama Mermaid — Fluxo de Upload e Streaming
```mermaid
sequenceDiagram
    participant User as "Usuário"
    participant API as "video/"
    participant Storage as "Armazenamento"
    participant Converter as "Conversor de Vídeo"

    User->>API: Envia vídeo para upload
    API->>Storage: Salva vídeo bruto
    API->>Converter: Converte vídeo para formatos suportados
    Converter-->>Storage: Salva vídeo convertido
    API-->>User: Retorna URL e status do vídeo

    Note over API,Storage: Upload seguro, controle de tamanho e formato.
    Note over API,Converter: Conversão automática para múltiplos dispositivos.
```

## Exemplos Práticos
### Payload de Upload
```json
{
  "userId": "abc123",
  "file": "video.mp4"
}
```
### Resposta de Upload
```json
{
  "success": true,
  "videoUrl": "https://cdn.novision.app/videos/abc123.mp4"
}
```

## Taxas, Limites e Segurança
- Limite de 5 uploads por hora por usuário.
- Tamanho máximo de 100MB por vídeo.
- Vídeos passam por moderação automática e logs de acesso.

 