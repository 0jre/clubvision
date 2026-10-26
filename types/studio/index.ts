// types.ts
export interface Comment {
  text: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface Post {
  PasVideo: string;
  _id: string;
  description: string;
  imageUrl: string;
  userId: string;
  nvuser: string;
  AvatarUser: string;
  likes: number;
  comments: Comment[];
  likedBy: string[];

  totalComments: number;
  views: number;
  liked: number;
  visualizations: string[];
}

export interface ProfileStats {
  earnings: number; // Valor fictício, ajuste conforme necessário
  postViews: number;
  likes: number;
  profileViews: number; // Adapte conforme necessário
  visits: any[];
  comments: {
    count: number;
    details: Comment[];
  };
  mostEngagedPost: Post | null;
}
