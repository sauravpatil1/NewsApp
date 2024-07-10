import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

class NewsArticle extends Model {
  static table = 'news_articles';

  @field('source_id') sourceId;
  @field('source_name') sourceName;
  @field('author') author;
  @field('title') title;
  @field('description') description;
  @field('url') url;
  @field('url_to_image') urlToImage;
  @field('published_at') publishedAt;
  @field('content') content;
  @field('is_pinned') isPinned;
}

export default NewsArticle;
