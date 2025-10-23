export interface Tag {
  id: number;
  name: string;
}

export interface CommentUser {
  id: number;
  name: string;
}

export interface ArticleOnTag {
  tagId: number;
  tag: Tag;
}


export interface Article {
  id: number;
  title: string;
  content: string;
  author: CommentUser;
  tags: ArticleOnTag[];
  createdAt: string;
  imageUrl?: string;
}

export interface PaginatedArticles {
  data: Article[];
  meta: {
    page: number;
    pageCount: number;
    total: number;
  };
}

export interface IArticleForm {
  title: string;
  imageUrl: string;
  content: string;
  tags: string[];
}


export interface Comment {
  id: number;
  content: string;
  createdAt: string;

  userId: number;
  user: CommentUser; 

  articleId: number;

  parentId?: number | null;
}


export interface CommentWithReplies extends Comment {
  replies?: CommentWithReplies[];
}
