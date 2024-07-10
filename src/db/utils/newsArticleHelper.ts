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
  async deleteArticle() {},
};

export default DBNewsArticleHelper;
