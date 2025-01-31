interface INewsSource {
  id: string;
  name: string;
}

export interface INewsArticle {
  id: string;
  source: INewsSource;
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
  isPinned: boolean;
}
