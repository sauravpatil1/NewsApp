import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

class NewsArticle extends Model {
  static table = 'news_articles';

  @text('source_id') sourceId;
  @text('source_name') sourceName;
  @text('author') author;
  @text('title') title;
  @text('description') description;
  @text('url') url;
  @text('url_to_image') urlToImage;
  @text('published_at') publishedAt;
  @text('content') content;

  getArticle() {
    return {
      sourceId: this.sourceId,
      sourceName: this.sourceName,
      author: this.author,
      title: this.title,
      description: this.description,
      url: this.url,
      urlToImage: this.urlToImage,
      publishedAt: this.publishedAt,
      content: this.content,
      id: this.id,
    };
  }
}

export default NewsArticle;
