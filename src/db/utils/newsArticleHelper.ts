import {Q} from '@nozbe/watermelondb';
import {INewsArticle} from '../../common/interface';
import database from '../database';
import {schemaNames} from '../strings';

const DBNewsArticleHelper = {
  async addNewsArticleList(articleList: INewsArticle[]) {
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
  async fetchAndDeleteRandomArticles(
    count: number = 5,
  ): Promise<INewsArticle[]> {
    try {
      const articles = await database
        .get(schemaNames.NEWS_ARTICLES)
        .query(Q.take(count))
        .fetch();
      await database.write(async () => {
        for (const article of articles) {
          await article.destroyPermanently();
        }
      });
      return articles;
    } catch (error) {
      console.error('Error fetching or deleting articles:', error);
      return [];
    }
  },
  async deleteArticleById(id: string) {
    const article = await database.collections
      .get(schemaNames.NEWS_ARTICLES)
      .find(id);
    await database.write(async () => {
      await article.destroyPermanently();
    });
  },
};

export default DBNewsArticleHelper;
