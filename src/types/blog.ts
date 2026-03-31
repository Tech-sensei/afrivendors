export interface BlogAuthor {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  author: BlogAuthor;
}

export interface BlogPostWithContent extends BlogPost {
  content?: string;
}
