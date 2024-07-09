import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {appSchema, Database} from '@nozbe/watermelondb';
import NewsArticleSchema from './schema/NewsArticleSchema';
import NewsArticle from './models/NewsArticle';

const version = 1;

const schema = appSchema({version, tables: [NewsArticleSchema]});

const adapter = new SQLiteAdapter({schema});

const database = new Database({
  adapter,
  modelClasses: [NewsArticle],
});

export default database;
