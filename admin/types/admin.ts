export interface ContentItem {
  _id: string
  title?: string
  description?: string
  contentType: "post" | "video"
  status: "active" | "under_review" | "removed" | "hidden"
  createdAt: string
  userId: string
  author?: {
    id: string
    username: string
    displayName: string
    avatar?: string
    verified?: boolean
  }
  metrics?: {
    views: number
    likes: number
    comments: number
    reports: number
    shares?: number
  }
  thumbnail?: string
  image?: string
  moderationHistory?: ModerationAction[]
}

export interface CommentItem {
  commentId: string
  text: string
  userId: string
  postId: string
  postTitle?: string
  postType: "post" | "video"
  createdAt: string
  status?: "active" | "under_review" | "hidden" | "deleted"
  toxicityScore?: number
  reports?: number
  author?: {
    id: string
    username: string
    displayName: string
    avatar?: string
    verified?: boolean
  }
  metrics?: {
    likes: number
    replies: number
    reports: number
  }
}

export interface ModerationAction {
  action: string
  moderator: string
  moderatorName: string
  timestamp: string
  notes?: string
}

export interface AuditLog {
  _id: string
  action: string
  userId: string
  contentId?: string
  commentId?: string
  timestamp: string
  details?: Record<string, any>
  user?: {
    id: string
    displayName: string
    avatar?: string
  }
}

export interface Pagination {
  page: number
  limit: number
  totalItems: number
  totalPages: number
}

export interface ContentListResponse {
  content: ContentItem[]
  pagination: Pagination
}

export interface CommentListResponse {
  comments: CommentItem[]
  pagination: Pagination
}

export interface AuditLogResponse {
  logs: AuditLog[]
  pagination: Pagination
}

export interface DashboardStats {
  timeframe: string
  content: {
    totalContent: number
    totalPosts: number
    totalVideos: number
    newContent: number
    newPosts: number
    newVideos: number
  }
  moderation: {
    actions: number
    underReview: number
    reported: number
  }
  users: {
    total: number
    new: number
    banned: number
  }
  engagement: {
    views: number
    likes: number
    comments: number
  }
  charts: {
    contentByDay: Array<{
      date: string
      posts: number
      videos: number
      total: number
    }>
    moderationByDay: Array<{
      date: string
      update_content_status: number
      delete_content: number
      delete_comment: number
      update_comment: number
      total: number
    }>
  }
}
