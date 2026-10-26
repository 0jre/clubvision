import React, { useState } from 'react';
import styled from 'styled-components';
import { Eye, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useContentList, updateContentStatus, deleteContent } from '@/admin/hooks/use-admin-api';

// Styled Components
const Container = styled.div`
  padding: 32px;
  background-color: #ffffff;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #666666;
  margin: 0;
  font-size: 16px;
`;

const TabsContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  overflow: hidden;
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e5e5;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 16px 24px;
  background-color: ${props => props.$active ? '#f5f5f5' : 'transparent'};
  border: none;
  border-bottom: 2px solid ${props => props.$active ? '#000000' : 'transparent'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$active ? '#000000' : '#666666'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #000000;
  }
`;

const TabBadge = styled.div<{ $active: boolean }>`
  padding: 2px 6px;
  background-color: ${props => props.$active ? '#000000' : '#e5e5e5'};
  color: ${props => props.$active ? '#ffffff' : '#666666'};
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
`;

const TabContent = styled.div`
  padding: 24px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return `
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
          &:hover { background-color: #333333; }
        `;
      case 'danger':
        return `
          background-color: #666666;
          color: #ffffff;
          border-color: #666666;
          &:hover { background-color: #333333; }
        `;
      case 'primary':
        return `
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
          &:hover { background-color: #333333; }
        `;
      default:
        return `
          background-color: #ffffff;
          color: #000000;
          border-color: #e5e5e5;
          &:hover { border-color: #000000; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background-color: #f5f5f5;
      color: #999999;
      border-color: #e5e5e5;
    }
  }
`;

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ContentCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 20px;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000000;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ContentInfo = styled.div`
  flex: 1;
`;

const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

const TypeBadge = styled.div<{ $type: string }>`
  padding: 4px 8px;
  background-color: ${props => props.$type === 'post' ? '#f5f5f5' : '#f5f5f5'};
  color: ${props => props.$type === 'post' ? '#000000' : '#000000'};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  border: 1px solid #e5e5e5;
`;

const SeverityBadge = styled.div<{ $severity: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: ${props => {
    switch (props.$severity) {
      case 'high': return '#000000';
      case 'medium': return '#666666';
      case 'low': return '#f5f5f5';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$severity) {
      case 'high': return '#ffffff';
      case 'medium': return '#ffffff';
      case 'low': return '#000000';
      default: return '#000000';
    }
  }};
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const ContentId = styled.div`
  font-size: 12px;
  color: #666666;
`;

const ContentText = styled.div`
  font-size: 14px;
  color: #000000;
  margin-bottom: 12px;
  line-height: 1.5;
`;

const ContentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #666666;
  flex-wrap: wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;

  @media (max-width: 768px) {
    margin-left: 0;
    justify-content: flex-start;
  }
`;

const IconButton = styled.button<{ $variant?: 'primary' | 'success' | 'danger' | 'warning' }>`
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case 'success':
        return `background-color: #f5f5f5; color: #000000; &:hover { background-color: #000000; color: #ffffff; }`;
      case 'danger':
        return `background-color: #f5f5f5; color: #666666; &:hover { background-color: #666666; color: #ffffff; }`;
      case 'warning':
        return `background-color: #f5f5f5; color: #666666; &:hover { background-color: #666666; color: #ffffff; }`;
      default:
        return `background-color: #f5f5f5; color: #000000; &:hover { background-color: #e5e5e5; }`;
    }
  }}
`;

const ModerationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
  flex-wrap: wrap;
`;

const SmallButton = styled.button<{ $variant?: 'primary' | 'danger' | 'warning' | 'secondary' }>`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `background-color: #000000; color: #ffffff; &:hover { background-color: #333333; }`;
      case 'danger':
        return `background-color: #666666; color: #ffffff; &:hover { background-color: #333333; }`;
      case 'warning':
        return `background-color: #666666; color: #ffffff; &:hover { background-color: #333333; }`;
      default:
        return `background-color: #f5f5f5; color: #000000; &:hover { background-color: #e5e5e5; }`;
    }
  }}
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px;
  color: #000000;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #666666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  color: #666666;
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export function ContentModeration() {
  const [selectedTab, setSelectedTab] = useState('flagged');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({
    status: 'under_review',
    reportedOnly: true,
    sortBy: 'most_reported',
    limit: 10,
  });

  // Buscar conteúdo flagged usando a API
  const { data, loading, error, refetch } = useContentList({
    ...filter,
    page,
  });

  const handleApprove = async (contentId: string) => {
    try {
      await updateContentStatus(contentId, 'active', 'Conteúdo aprovado após revisão');
      refetch();
    } catch (err) {
      console.error('Erro ao aprovar conteúdo:', err);
      alert('Erro ao aprovar conteúdo. Tente novamente.');
    }
  };

  const handleRemove = async (contentId: string, contentType: string) => {
    if (confirm('Tem certeza que deseja remover este conteúdo?')) {
      try {
        await deleteContent(contentId, contentType);
        refetch();
      } catch (err) {
        console.error('Erro ao remover conteúdo:', err);
        alert('Erro ao remover conteúdo. Tente novamente.');
      }
    }
  };

  const handleReject = async (contentId: string) => {
    try {
      await updateContentStatus(contentId, 'removed', 'Conteúdo removido por violar diretrizes da comunidade');
      refetch();
    } catch (err) {
      console.error('Erro ao rejeitar conteúdo:', err);
      alert('Erro ao rejeitar conteúdo. Tente novamente.');
    }
  };

  const tabs = [
    { id: 'flagged', label: 'Flagged Content', count: data?.pagination?.totalItems || 0 },
    { id: 'reviewed', label: 'Recently Reviewed', count: 0 },
    { id: 'appeals', label: 'Appeals', count: 0 },
  ];

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <p>Carregando conteúdo...</p>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <p>Erro ao carregar conteúdo: {error}</p>
          <Button $variant="primary" style={{ marginTop: '16px' }} onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </ErrorState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Content Moderation</Title>
        <Subtitle>Review and moderate user-generated content across the platform</Subtitle>
      </Header>

      <TabsContainer>
        <TabsHeader>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={selectedTab === tab.id}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
              <TabBadge $active={selectedTab === tab.id}>
                {tab.count}
              </TabBadge>
            </Tab>
          ))}
        </TabsHeader>

        <TabContent>
          <FilterBar>
            <FilterGroup>
              <Select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="under_review">Under Review</option>
                <option value="flagged">Flagged</option>
                <option value="all">All Content</option>
              </Select>

              <Select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
              >
                <option value="most_reported">Most Reported</option>
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <Button $variant="success">
                Bulk Approve
              </Button>
              <Button $variant="danger">
                Bulk Remove
              </Button>
            </FilterGroup>
          </FilterBar>

          {data?.content?.length === 0 ? (
            <EmptyState>
              <p>Nenhum conteúdo encontrado para moderação.</p>
            </EmptyState>
          ) : (
            <ContentList>
              {data?.content?.map((item: any) => (
                <ContentCard key={item._id}>
                  <ContentHeader>
                    <ContentInfo>
                      <BadgeGroup>
                        <TypeBadge $type={item.type}>
                          {item.type}
                        </TypeBadge>

                        <SeverityBadge $severity={item.severity || 'medium'}>
                          <AlertTriangle size={12} />
                          {item.severity || 'medium'} priority
                        </SeverityBadge>

                        <ContentId>
                          ID: {item._id}
                        </ContentId>
                      </BadgeGroup>

                      <ContentText>
                        {item.title || item.description || 'Sem descrição'}
                      </ContentText>

                      <ContentMeta>
                        <span>Author: {item.author?.username || 'Desconhecido'}</span>
                        <span>Reports: {item.metrics?.reports || 0}</span>
                        <span>Time: {new Date(item.createdAt).toLocaleString()}</span>
                      </ContentMeta>
                    </ContentInfo>

                    <ActionButtons>
                      <IconButton title="View Details">
                        <Eye size={16} />
                      </IconButton>

                      <IconButton
                        $variant="success"
                        title="Approve"
                        onClick={() => handleApprove(item._id)}
                      >
                        <CheckCircle size={16} />
                      </IconButton>

                      <IconButton
                        $variant="danger"
                        title="Reject"
                        onClick={() => handleReject(item._id)}
                      >
                        <XCircle size={16} />
                      </IconButton>

                      <IconButton
                        $variant="warning"
                        title="Remove"
                        onClick={() => handleRemove(item._id, item.type)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </ActionButtons>
                  </ContentHeader>

                  <ModerationActions>
                    <SmallButton
                      $variant="primary"
                      onClick={() => handleApprove(item._id)}
                    >
                      Approve
                    </SmallButton>

                    <SmallButton
                      $variant="danger"
                      onClick={() => handleRemove(item._id, item.type)}
                    >
                      Remove
                    </SmallButton>

                    <SmallButton $variant="warning">
                      Warn User
                    </SmallButton>

                    <SmallButton>
                      Need Review
                    </SmallButton>
                  </ModerationActions>
                </ContentCard>
              ))}

              {/* Paginação */}
              <Pagination>
                <PaginationInfo>
                  Mostrando {data?.content?.length} de {data?.pagination?.totalItems} itens
                </PaginationInfo>
                <PaginationButtons>
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    disabled={page >= (data?.pagination?.totalPages || 1)}
                    onClick={() => setPage(page + 1)}
                  >
                    Próxima
                  </Button>
                </PaginationButtons>
              </Pagination>
            </ContentList>
          )}
        </TabContent>
      </TabsContainer>
    </Container>
  );
}