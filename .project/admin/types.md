# Arquitetura de Tipos e Contratos Administrativos

## Visão Geral
Os tipos e contratos administrativos definem a estrutura de dados, contratos de serviço e regras de validação para todas as operações administrativas do ClubVision. Eles garantem consistência, segurança e interoperabilidade entre serviços, APIs e integrações.

### Principais Estruturas
- **AdminUser:** Dados do administrador/moderador, permissões, roles, histórico de ações.
- **AuditLog:** Estrutura de logs de auditoria, ação, timestamp, responsável, status.
- **Permission:** Contrato de permissões administrativas, escopos, níveis e validade.
- **Event:** Estrutura de eventos administrativos, tipo, status, participantes, histórico.
- **PromoCode:** Contrato de códigos promocionais, valor, validade, status, uso.

## Exemplo de Tipo AdminUser (TypeScript)
```typescript
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  status: 'ativo' | 'suspenso' | 'banido';
  createdAt: string;
  lastAction: string;
}
```

## Exemplo de Log de Auditoria
```json
{
  "action": "ban_user",
  "adminId": "admin_001",
  "targetId": "user_123",
  "timestamp": "2024-06-20T12:00:00Z",
  "status": "sucesso"
}
```

## Integração
- Todos os serviços e APIs consomem e produzem dados seguindo esses contratos.
- Tipos versionados para garantir compatibilidade e evolução segura.
 