import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MessageSquare,
  Reply,
  Heart,
  Flag,
  Ban,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Search,
  Download,
  Shield,
} from 'lucide-react';
import { useCommentsList, moderateComment } from '@/admin/hooks/use-admin-api';

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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MetricCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const IconWrapper = styled.div<{ $bgColor?: string }>`
  width: 48px;
  height: 48px;
  background-color: ${props => props.$bgColor || '#f5f5f5'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricBadge = styled.div<{ $variant: 'positive' | 'negative' }>`
  background-color: ${props => props.$variant === 'positive' ? '#000000' : '#666666'};
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const MetricValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #000000;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666666;
`;

const FiltersCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
  }

  &::placeholder {
    color: #999999;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999999;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000000;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  border: 1px solid;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: #000000;
          color: #ffffff;
          border-color: #000000;
          &:hover { background-color: #333333; }
        `;
      case 'danger':
        return `
          background-color: #ffffff;
          color: #000000;
          border-color: #000000;
          &:hover { background-color: #000000; color: #ffffff; }
        `;
      case 'warning':
        return `
          background-color: #666666;
          color: #ffffff;
          border-color: #666666;
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

const CommentCard = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000000;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
`;

const AuthorDetails = styled.div``;

const AuthorName = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  span {
    font-weight: 500;
    color: #000000;
    font-size: 14px;
  }
`;

const AuthorMeta = styled.div`
  font-size: 12px;
  color: #666666;
  margin-top: 2px;
`;

const StatusBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'active':
        return `background-color: #000000; color: #ffffff;`;
      case 'under_review':
        return `background-color: #666666; color: #ffffff;`;
      case 'hidden':
        return `background-color: #f5f5f5; color: #666666;`;
      case 'deleted':
        return `background-color: #000000; color: #ffffff;`;
      default:
        return `background-color: #f5f5f5; color: #666666;`;
    }
  }}
`;

const ToxicityBadge = styled.div<{ $score: number }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => props.$score > 0.7 ? '#000000' : props.$score > 0.4 ? '#666666' : '#f5f5f5'};
  color: ${props => props.$score > 0.4 ? '#ffffff' : '#000000'};
`;

const CommentContent = styled.div`
  font-size: 14px;
  color: #000000;
  margin-bottom: 16px;
  line-height: 1.6;
`;

const PostReference = styled.div`
  padding: 12px 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #e5e5e5;
`;

const PostInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PostThumbnail = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
`;

const PostDetails = styled.div``;

const PostTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 2px;
`;

const PostId = styled.div`
  font-size: 11px;
  color: #666666;
`;

const CommentMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const MetricsRow = styled.div`
  display: flex;
  gap: 20px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    font-size: 12px;
    color: #666666;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const IconButton = styled.button<{ $variant?: 'primary' | 'warning' | 'danger' }>`
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.$variant) {
      case 'warning':
        return `background-color: #666666; color: #ffffff; &:hover { background-color: #333333; }`;
      case 'danger':
        return `background-color: #000000; color: #ffffff; &:hover { background-color: #333333; }`;
      default:
        return `background-color: #f5f5f5; color: #000000; &:hover { background-color: #e5e5e5; }`;
    }
  }}
`;

const ModerationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e5e5;
  flex-wrap: wrap;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #000000;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;

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

export function CommentManagement() {
 
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    toxicity: 'all',
    sortBy: 'recent',
    search: '',
    limit: 20,
  });

  // Buscar comentários usando a API
  const { data, loading, error, refetch } = useCommentsList({
    ...filters,
    page,
  });

  const handleDeleteComment = async (contentId: string, commentId: string) => {
    if (confirm('Tem certeza que deseja excluir este comentário?')) {
      try {
        await moderateComment(contentId, commentId, 'delete');
        refetch();
      } catch (err) {
        console.error('Erro ao excluir comentário:', err);
        alert('Erro ao excluir comentário. Tente novamente.');
      }
    }
  };

  const handleUpdateComment = async (contentId: string, commentId: string, status: string) => {
    try {
      await moderateComment(contentId, commentId, 'update', { status });
      refetch();
    } catch (err) {
      console.error('Erro ao atualizar comentário:', err);
      alert('Erro ao atualizar comentário. Tente novamente.');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTotalReports = () => {
    return data?.comments?.reduce((sum: number, c: any) => sum + (c.metrics?.reports || 0), 0) || 0;
  };

  const getSafeCommentsPercentage = () => {
    if (!data?.comments?.length) return '0%';
    const safeComments = data.comments.filter((c: any) => (c.toxicityScore || 0) < 0.4).length;
    return ((safeComments / data.comments.length) * 100).toFixed(0) + '%';
  };

  const getUnderReviewCount = () => {
    return data?.comments?.filter((c: any) => c.status === 'under_review').length || 0;
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <p>Carregando comentários...</p>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <p>Erro ao carregar comentários: {error}</p>
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
        <Title>Comments Management</Title>
        <Subtitle>Monitor, moderate, and manage user comments across all posts and content</Subtitle>
      </Header>

      {/* Metrics Overview */}
      <MetricsGrid>
        <MetricCard>
          <MetricCardHeader>
            <IconWrapper $bgColor="#f5f5f5">
              <MessageSquare size={24} color="#000000" />
            </IconWrapper>
            <MetricBadge $variant="positive">+18%</MetricBadge>
          </MetricCardHeader>
          <MetricValue>{data?.pagination?.totalItems || 0}</MetricValue>
          <MetricLabel>Total Comments</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricCardHeader>
            <IconWrapper $bgColor="#f5f5f5">
              <AlertTriangle size={24} color="#666666" />
            </IconWrapper>
            <MetricBadge $variant="negative">-12%</MetricBadge>
          </MetricCardHeader>
          <MetricValue>{getUnderReviewCount()}</MetricValue>
          <MetricLabel>Under Review</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricCardHeader>
            <IconWrapper $bgColor="#f5f5f5">
              <Flag size={24} color="#000000" />
            </IconWrapper>
            <MetricBadge $variant="positive">-25%</MetricBadge>
          </MetricCardHeader>
          <MetricValue>{getTotalReports()}</MetricValue>
          <MetricLabel>Total Reports</MetricLabel>
        </MetricCard>

        <MetricCard>
          <MetricCardHeader>
            <IconWrapper $bgColor="#f5f5f5">
              <Shield size={24} color="#000000" />
            </IconWrapper>
            <MetricBadge $variant="positive">+8%</MetricBadge>
          </MetricCardHeader>
          <MetricValue>{getSafeCommentsPercentage()}</MetricValue>
          <MetricLabel>Safe Comments</MetricLabel>
        </MetricCard>
      </MetricsGrid>

      {/* Filters and Search */}
      <FiltersCard>
        <FiltersContainer>
          <SearchContainer>
            <SearchIcon size={18} />
            <SearchInput
              placeholder="Search comments by content or author..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </SearchContainer>

          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="under_review">Under Review</option>
            <option value="hidden">Hidden</option>
            <option value="deleted">Deleted</option>
          </Select>

          <Select
            value={filters.toxicity}
            onChange={(e) => setFilters({ ...filters, toxicity: e.target.value })}
          >
            <option value="all">All Toxicity</option>
            <option value="low">Low (0-40%)</option>
            <option value="medium">Medium (40-70%)</option>
            <option value="high">High (70%+)</option>
          </Select>

          <Select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="recent">Most Recent</option>
            <option value="reports">Most Reported</option>
            <option value="toxic">Highest Toxicity</option>
            <option value="engagement">Most Liked</option>
          </Select>

          <Button>
            <Download size={16} />
            Export Data
          </Button>
        </FiltersContainer>
      </FiltersCard>

      {/* Comments List */}
      <div>
        {data?.comments?.length === 0 ? (
          <EmptyState>
            <p>Nenhum comentário encontrado.</p>
          </EmptyState>
        ) : (
          data?.comments?.map((comment: any) => (
            <CommentCard key={comment.commentId}>
              {/* Comment Header */}
              <CommentHeader>
                <AuthorInfo>
                  <Avatar
                    src={comment.author?.avatar || '/placeholder.svg?height=40&width=40'}
                    alt="Avatar"
                  />
                  <AuthorDetails>
                    <AuthorName>
                      <span>{comment.author?.displayName || 'Usuário desconhecido'}</span>
                      {comment.author?.verified && (
                        <CheckCircle size={14} color="#000000" />
                      )}
                    </AuthorName>
                    <AuthorMeta>
                      @{comment.author?.username || 'unknown'} • {new Date(comment.createdAt).toLocaleString()}
                    </AuthorMeta>
                  </AuthorDetails>
                </AuthorInfo>

                <StatusBadges>
                  <StatusBadge $status={comment.status}>
                    {comment.status?.replace('_', ' ') || 'active'}
                  </StatusBadge>
                  <ToxicityBadge $score={comment.toxicityScore || 0}>
                    {((comment.toxicityScore || 0) * 100).toFixed(0)}% toxic
                  </ToxicityBadge>
                </StatusBadges>
              </CommentHeader>

              {/* Comment Content */}
              <CommentContent>{comment.text}</CommentContent>

              {/* Post Reference */}
              <PostReference>
                <PostInfo>
                  <PostThumbnail
                    src={comment.post?.thumbnail || '/placeholder.svg?height=60&width=60'}
                    alt="Post thumbnail"
                  />
                  <PostDetails>
                    <PostTitle>{comment.postTitle || 'Post sem título'}</PostTitle>
                    <PostId>ID: {comment.postId}</PostId>
                  </PostDetails>
                </PostInfo>
              </PostReference>

              {/* Comment Metrics */}
              <CommentMetrics>
                <MetricsRow>
                  <MetricItem>
                    <Heart size={14} color="#666666" />
                    <span>{formatNumber(comment.metrics?.likes || 0)}</span>
                  </MetricItem>
                  <MetricItem>
                    <Reply size={14} color="#666666" />
                    <span>{comment.metrics?.replies || 0}</span>
                  </MetricItem>
                  <MetricItem>
                    <Flag size={14} color="#666666" />
                    <span>{comment.metrics?.reports || 0}</span>
                  </MetricItem>
                </MetricsRow>

                <ActionButtons>
                  <IconButton title="View Details">
                    <Eye size={14} />
                  </IconButton>
                  <IconButton
                    $variant="warning"
                    title="Flag Comment"
                    onClick={() => handleUpdateComment(comment.postId, comment.commentId, 'under_review')}
                  >
                    <Flag size={14} />
                  </IconButton>
                  <IconButton
                    $variant="danger"
                    title="Hide Comment"
                    onClick={() => handleUpdateComment(comment.postId, comment.commentId, 'hidden')}
                  >
                    <Ban size={14} />
                  </IconButton>
                  <IconButton
                    $variant="danger"
                    title="Delete Comment"
                    onClick={() => handleDeleteComment(comment.postId, comment.commentId)}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                  <IconButton title="More Actions">
                    <MoreHorizontal size={14} />
                  </IconButton>
                </ActionButtons>
              </CommentMetrics>

              {/* Moderation Actions */}
              <ModerationActions>
                <Button
                  $variant="primary"
                  onClick={() => handleUpdateComment(comment.postId, comment.commentId, 'active')}
                >
                  Approve
                </Button>
                <Button
                  $variant="danger"
                  onClick={() => handleDeleteComment(comment.postId, comment.commentId)}
                >
                  Remove
                </Button>
                <Button $variant="warning">
                  Warn User
                </Button>
                <Button>
                  Need Review
                </Button>
              </ModerationActions>
            </CommentCard>
          ))
        )}

        {/* Pagination */}
        {data?.comments?.length > 0 && (
          <Pagination>
            <PaginationInfo>
              Mostrando {data?.comments?.length} de {data?.pagination?.totalItems} comentários
            </PaginationInfo>
            <PaginationButtons>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={page >= (data?.pagination?.totalPages || 1)}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </PaginationButtons>
          </Pagination>
        )}
      </div>
    </Container>
  );
}