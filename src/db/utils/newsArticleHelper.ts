import {Q} from '@nozbe/watermelondb';
import {INewsArticle} from '../../common/interface';
import database from '../database';
import {schemaNames} from '../strings';

const DBNewsArticleHelper = {
  async addNewsArticleList(articleList: INewsArticle[]) {
    if (!articleList || articleList.length < 0) return true;
    await this.deleteNewsArticleList();
    try {
      await database.write(async () => {
        for (const article of articleList) {
          if (!article) continue;
          const {
            source,
            author,
            title,
            description,
            url,
            urlToImage,
            publishedAt,
            content,
            isPinned,
          } = article;
          const {id: sourceId, name: sourceName} = source || {};
          await database.collections
            .get(schemaNames.NEWS_ARTICLES)
            .create(article => {
              article.sourceId = sourceId;
              article.sourceName = sourceName;
              article.author = author;
              article.title = title;
              article.description = description;
              article.url = url;
              article.urlToImage = urlToImage;
              article.publishedAt = publishedAt;
              article.content = content;
              article.isPinned = isPinned;
            });
        }
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  async deleteNewsArticleList() {
    try {
      await database.write(async () => {
        const recentlyViewedCars = await database.collections
          .get(schemaNames.NEWS_ARTICLES)
          .query()
          .fetch();
        await Promise.all(
          recentlyViewedCars.map(car => car.destroyPermanently()),
        );
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  async getNewsArticleList() {
    try {
      const newsArticle = await database.collections
        .get(schemaNames.NEWS_ARTICLES)
        .query()
        .fetch();
      return newsArticle;
    } catch (err) {
      return [];
    }
  },
  async deleteArticleById(id: string) {
    try {
      const article = await database.collections
        .get(schemaNames.NEWS_ARTICLES)
        .find(id);
      await database.write(async () => {
        await article.destroyPermanently();
      });
      return true;
    } catch (error) {
      return false;
    }
  },
  async fetchPaginatedHeadlines(page: number, limit: number) {
    try {
      const offset = (page - 1) * limit;
      const headlines = await database.collections
        .get(schemaNames.NEWS_ARTICLES)
        .query(Q.sortBy('published_at', Q.desc), Q.take(limit), Q.skip(offset))
        .fetch();
      return headlines;
    } catch (error) {
      return [];
    }
  },
  async setPinnedHeadline(item: INewsArticle) {
    try {
      await database.write(async () => {
        const post = await database
          .get(schemaNames.NEWS_ARTICLES)
          .find(item.id);
        await post.update(article => {
          article.isPinned = !item.isPinned;
        });
      });
      return true;
    } catch (err) {
      return false;
    }
  },
  async getPinnedHeadlines() {
    try {
      const articlesCollection = database.collections.get(
        schemaNames.NEWS_ARTICLES,
      );
      const pinnedArticles = await articlesCollection
        .query(Q.where('is_pinned', true))
        .fetch();

      return pinnedArticles;
    } catch (error) {
      console.error('Error fetching pinned articles:', error);
      return [];
    }
  },
};

export default DBNewsArticleHelper;
